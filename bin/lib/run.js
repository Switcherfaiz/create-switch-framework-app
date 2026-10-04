import path from 'node:path';
import process from 'node:process';
import fs from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';
import { parseArgs, normalizeAppType, normalizePort } from './args.js';
import { printHelp } from './help.js';
import { askQuestions } from './ask.js';
import { sanitizeProjectName, toPackageName } from './names.js';
import { getCliVersion, resolveVersions } from './versions.js';
import { copyProjectTemplate } from './scaffold.js';
import { runCommand } from './runCommand.js';
import { printNextSteps } from './nextSteps.js';
import { installCommands, linkCommand } from '../commands/index.js';

export async function runCli({ argv, cliRoot }) {
  const cliVersion = getCliVersion(cliRoot);
  console.log(chalk.cyan(`\nWelcome to switch-framework CLI v${cliVersion}\n`));

  const parsed = parseArgs(argv);
  if (parsed.help) {
    printHelp();
    process.exit(0);
  }

  const appTypeNorm = normalizeAppType(parsed.appType);
  if (appTypeNorm?.error) {
    console.error(chalk.red(`Invalid --app-type: ${appTypeNorm.error}. Use one of: web | electron | both`));
    process.exit(1);
  }

  const portNorm = normalizePort(parsed.port);
  if (portNorm.error) {
    console.error(chalk.red(`Invalid --port: ${portNorm.error}. Use an integer 1-65535`));
    process.exit(1);
  }

  const answers = await askQuestions({
    projectName: parsed.projectName,
    yes: parsed.yes,
    noInstall: parsed.noInstall,
    appTypeOverride: appTypeNorm?.value || null,
    portOverride: portNorm.value,
    doctorOverride: parsed.doctor
  });

  const projectName = sanitizeProjectName(answers.projectName);
  const appType = answers.appType;
  const port = answers.port;
  const install = answers.install;
  const installDoctor = answers.installDoctor;
  const useLocal = parsed.useLocal;
  const versions = resolveVersions({ cliVersion, nodeVersion: process.versions.node, appType });

  if (!projectName) {
    console.error(chalk.red('Project name is required.'));
    process.exit(1);
  }

  const targetDir = path.resolve(process.cwd(), projectName);
  const spinner = ora();
  const templatesRoot = path.join(cliRoot, 'templates');

  try {
    if (await fs.pathExists(targetDir)) {
      const items = await fs.readdir(targetDir);
      if (items.length > 0) {
        console.error(chalk.red(`Target directory already exists and is not empty: ${targetDir}`));
        process.exit(1);
      }
    }

    spinner.start('Creating project...');
    await fs.ensureDir(targetDir);

    await copyProjectTemplate({
      appType,
      templatesRoot,
      targetDir,
      packageName: toPackageName(projectName),
      port,
      useLocal,
      scaffoldVersion: cliVersion,
      installDoctor,
      versions
    });

    spinner.succeed('Project created');

    if (install) {
      try {
        for (const command of installCommands({ appType, useLocal, installDoctor, versions })) {
          spinner.start(`Running ${command}...`);
          await runCommand(command, { cwd: targetDir });
        }
        spinner.succeed('Dependencies installed');
      } catch (err) {
        spinner.warn('npm install failed (project was still created)');
        console.error(chalk.yellow(err?.message || String(err)));
      }
    }

    if (useLocal) {
      const command = linkCommand({ appType });
      spinner.start(`Running ${command}...`);
      try {
        await runCommand(command, { cwd: targetDir });
        spinner.succeed('Local packages linked');
      } catch (err) {
        spinner.warn('npm link failed');
        console.error(chalk.yellow(err?.message || String(err)));
        console.log(chalk.yellow('Make sure you ran npm link inside switch-framework, switch-framework-backend, and (for Electron) switch-framework-electron first.'));
      }
    }

    spinner.stop();
    printNextSteps({
      projectName,
      appType,
      install,
      installDoctor,
      useLocal,
      versions
    });
  } catch (err) {
    spinner.fail('Failed');
    console.error(chalk.red(err?.stack || err?.message || String(err)));
    process.exit(1);
  }
}
