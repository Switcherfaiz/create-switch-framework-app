#!/usr/bin/env node

import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

import fs from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';
import enquirer from 'enquirer';

const { prompt } = enquirer;
const require = createRequire(import.meta.url);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function printHelp() {
  console.log(`\n${chalk.bold('create-switch-framework-app')}\n`);
  console.log('Usage:');
  console.log('  npx create-switch-framework-app <project-name> [options]');
  console.log('\nOptions:');
  console.log('  --yes, -y        Skip prompts and use defaults');
  console.log('  --app-type       One of: web | electron | both');
  console.log('  --port           Server port (1-65535)');
  console.log('  --no-install     Do not run npm install');
  console.log('  --use-local      Use npm link for switch-framework + switch-framework-backend (no npm registry)');
  console.log('  -h, --help       Show help');
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const flags = new Set(args.filter(a => a.startsWith('-')));

  const help = flags.has('-h') || flags.has('--help');
  const yes = flags.has('--yes') || flags.has('-y');
  const noInstall = flags.has('--no-install');
  const useLocal = flags.has('--use-local');

  const getValue = (name) => {
    const i = args.indexOf(name);
    if (i === -1) return null;
    const v = args[i + 1];
    if (!v || v.startsWith('-')) return null;
    return v;
  };

  const appType = getValue('--app-type');
  const port = getValue('--port');

  const positional = args.filter(a => !a.startsWith('-'));
  const projectName = positional[0] || null;

  return { help, yes, noInstall, useLocal, projectName, appType, port };
}

function sanitizeProjectName(input) {
  const name = String(input || '').trim();
  return name.replace(/[\\/]/g, '-');
}

function toPackageName(projectName) {
  return projectName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '') || 'switch-framework-app';
}

async function askQuestions({ projectName, yes, noInstall, appTypeOverride, portOverride }) {
  const defaults = {
    appType: 'web',
    port: 3000,
    install: true
  };

  const resolvedAppType = appTypeOverride || defaults.appType;
  const resolvedPort = portOverride != null ? Number(portOverride) : defaults.port;

  if (yes) {
    return {
      projectName: projectName || 'switch-framework-app',
      appType: resolvedAppType,
      port: resolvedPort,
      install: noInstall ? false : defaults.install
    };
  }

  const questions = [];

  if (!projectName) {
    questions.push({
      type: 'input',
      name: 'projectName',
      message: 'Project name',
      initial: 'switch-framework-app',
      validate(value) {
        const v = sanitizeProjectName(value);
        if (!v) return 'Project name is required';
        return true;
      }
    });
  }

  questions.push(
    {
      type: 'select',
      name: 'appType',
      message: 'What type of app do you want to create?',
      choices: [
        { name: 'web', message: 'Web App (browser + Node.js/Express backend)' },
        { name: 'electron', message: 'Electron Desktop App (with shared Express backend)' },
        { name: 'both', message: 'Both (monorepo with web + electron targets)' }
      ],
      initial: resolvedAppType
    },
    {
      type: 'numeral',
      name: 'port',
      message: 'Which port do you want the server to use?',
      initial: resolvedPort,
      validate(value) {
        const n = Number(value);
        if (!Number.isInteger(n) || n < 1 || n > 65535) return 'Enter a valid port (1-65535)';
        return true;
      }
    },
    {
      type: 'confirm',
      name: 'install',
      message: 'Do you want to install dependencies automatically?',
      initial: defaults.install,
      skip() {
        return noInstall;
      }
    }
  );

  const answers = await prompt(questions);
  return {
    projectName: projectName || answers.projectName,
    appType: answers.appType,
    port: Number(answers.port),
    install: noInstall ? false : Boolean(answers.install)
  };
}

async function copyElectronShell({ electronBase, targetDir, packageName }) {
  await fs.copy(path.join(electronBase, 'electron'), path.join(targetDir, 'electron'), { overwrite: true });
  await fs.copy(path.join(electronBase, 'constants'), path.join(targetDir, 'constants'), { overwrite: true });
  await fs.ensureDir(path.join(targetDir, 'server'));
  await fs.copy(path.join(electronBase, 'server', 'local-auth.js'), path.join(targetDir, 'server', 'local-auth.js'));
  await fs.copy(path.join(electronBase, 'main.js'), path.join(targetDir, 'main.js'));
  await fs.copy(path.join(electronBase, 'preload.js'), path.join(targetDir, 'preload.js'));

  const builderPath = path.join(targetDir, 'electron', 'electron-builder.json');
  const builder = JSON.parse(await fs.readFile(builderPath, 'utf8'));
  builder.appId = `com.switchframework.${packageName}`;
  builder.productName = packageName;
  await fs.writeFile(builderPath, JSON.stringify(builder, null, 2) + '\n', 'utf8');
}

function createPackageJson({ packageName, appType, port, useLocal, scaffoldVersion }) {
  const scripts = {
    dev: 'node server.js',
    start: 'node server.js'
  };

  if (appType === 'electron' || appType === 'both') {
    scripts['electron:dev'] = 'electron .';
    scripts.build = 'electron-builder --config electron/electron-builder.json';
  }

  const deps = {};

  // When --use-local is set, we intentionally do NOT add switch-framework deps to package.json
  // to avoid npm registry fetching during testing. We will npm link them instead.
  if (!useLocal) {
    deps['switch-framework'] = '^0.2.9';
    deps['switch-framework-backend'] = '^0.2.9';
  }

  if ((appType === 'electron' || appType === 'both') && !useLocal) {
    deps['switch-framework-electron'] = '^0.2.9';
  }

  const pkg = {
    name: packageName,
    private: true,
    type: 'commonjs',
    scripts,
    dependencies: deps
  };

  if (appType === 'electron' || appType === 'both') {
    pkg.main = 'main.js';
  }

  pkg.switchFramework = { port, scaffoldVersion };

  return JSON.stringify(pkg, null, 2) + '\n';
}

async function copyDir(srcDir, destDir) {
  await fs.ensureDir(destDir);
  await fs.copy(srcDir, destDir, {
    overwrite: true,
    errorOnExist: false
  });
}

async function runNpmInstall({ cwd, packages = [] }) {
  const args = packages.length ? ['install', ...packages] : ['install'];
  return new Promise((resolve, reject) => {
    const child = require('node:child_process').spawn('npm', args, {
      cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32'
    });

    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`npm install failed with exit code ${code}`));
    });

    child.on('error', reject);
  });
}

async function runNpmLink({ cwd, packages }) {
  return new Promise((resolve, reject) => {
    const child = require('node:child_process').spawn('npm', ['link', ...packages], {
      cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32'
    });

    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`npm link failed with exit code ${code}`));
    });

    child.on('error', reject);
  });
}

const DOCS_URL = 'https://github.com/Switcherfaiz/switch-framework-docs';

function getCliVersion() {
  try {
    const pkgPath = path.join(__dirname, '..', 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    return pkg.version || '0.0.0';
  } catch {
    return '0.0.0';
  }
}

async function main() {
  const cliVersion = getCliVersion();
  console.log(chalk.cyan(`\nWelcome to switch-framework CLI v${cliVersion}\n`));

  const { help, yes, noInstall, useLocal, appType: appTypeArg, port: portArg, projectName: rawProjectName } = parseArgs(process.argv);
  if (help) {
    printHelp();
    process.exit(0);
  }

  const normalizedAppType = appTypeArg ? String(appTypeArg).trim().toLowerCase() : null;
  if (normalizedAppType && !['web', 'electron', 'both'].includes(normalizedAppType)) {
    console.error(chalk.red(`Invalid --app-type: ${appTypeArg}. Use one of: web | electron | both`));
    process.exit(1);
  }

  const normalizedPort = portArg != null ? Number(portArg) : null;
  if (portArg != null && (!Number.isInteger(normalizedPort) || normalizedPort < 1 || normalizedPort > 65535)) {
    console.error(chalk.red(`Invalid --port: ${portArg}. Use an integer 1-65535`));
    process.exit(1);
  }

  const answers = await askQuestions({
    projectName: rawProjectName,
    yes,
    noInstall,
    appTypeOverride: normalizedAppType,
    portOverride: normalizedPort
  });
  const projectName = sanitizeProjectName(answers.projectName);
  const appType = answers.appType;
  const port = answers.port;
  const install = answers.install;

  if (!projectName) {
    console.error(chalk.red('Project name is required.'));
    process.exit(1);
  }

  const targetDir = path.resolve(process.cwd(), projectName);
  const spinner = ora();

  const templatesRoot = path.resolve(__dirname, '..', 'templates');
  const webBase = path.join(templatesRoot, 'web', 'base');
  const electronBase = path.join(templatesRoot, 'electron', 'base');

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

    const packageName = toPackageName(projectName);

    const bothServerTemplate = path.join(templatesRoot, 'both', 'server.js');

    if (appType === 'web') {
      await copyDir(webBase, targetDir);
    }

    if (appType === 'electron') {
      await copyDir(electronBase, targetDir);
    }

    if (appType === 'both') {
      await fs.ensureDir(path.join(targetDir, 'web'));
      await copyDir(webBase, path.join(targetDir, 'web'));
      await copyElectronShell({ electronBase, targetDir, packageName });
      await fs.copy(bothServerTemplate, path.join(targetDir, 'server.js'), { overwrite: true });
    }

    const envExample = appType === 'web'
      ? `PORT=${port}\nSESSION_SECRET=dev-secret\n`
      : `PORT=${port}\nSESSION_SECRET=dev-secret\n# ALLOW_WEB_VIEWING is set in constants/index.js (not .env)\n`;
    await fs.writeFile(path.join(targetDir, '.env.example'), envExample, 'utf8');

    await fs.writeFile(
      path.join(targetDir, 'package.json'),
      createPackageJson({ packageName, appType, port, useLocal, scaffoldVersion: cliVersion }),
      'utf8'
    );

    spinner.succeed('Project created');

    if (install) {
      spinner.start('Installing dependencies (npm install)...');
      try {
        await runNpmInstall({ cwd: targetDir });
        if (!useLocal) {
          spinner.start('Ensuring switch-framework packages...');
          await runNpmInstall({ cwd: targetDir, packages: ['switch-framework@^0.2.9', 'switch-framework-backend@^0.2.9'] });
        }
        if (appType === 'electron' || appType === 'both') {
          spinner.start('Installing Electron tooling (npm install electron electron-builder --save-dev)...');
          await runNpmInstall({ cwd: targetDir, packages: ['electron', 'electron-builder', '--save-dev'] });
        }
        spinner.succeed('Dependencies installed');
      } catch (e) {
        spinner.warn('npm install failed (project was still created)');
        console.error(chalk.yellow(e?.message || String(e)));
      }
    }

    if (useLocal) {
      const linkPackages = ['switch-framework', 'switch-framework-backend'];
      if (appType === 'electron' || appType === 'both') {
        linkPackages.push('switch-framework-electron');
      }
      spinner.start(`Linking local packages (npm link ${linkPackages.join(' ')})...`);
      try {
        await runNpmLink({ cwd: targetDir, packages: linkPackages });
        spinner.succeed('Local packages linked');
      } catch (e) {
        spinner.warn('npm link failed');
        console.error(chalk.yellow(e?.message || String(e)));
        console.log(chalk.yellow('Make sure you ran npm link inside switch-framework, switch-framework-backend, and (for Electron) switch-framework-electron first.'));
      }
    }

    // Ensure no spinner state bleeds into final output
    spinner.stop();

    console.log('\n' + chalk.green(chalk.bold('Success!')));
    console.log('\nNext steps:');
    console.log('  ' + chalk.cyan('cd ' + projectName));

    if (!install) {
      console.log('  ' + chalk.cyan('npm install'));
      if (appType === 'electron' || appType === 'both') {
        console.log('  ' + chalk.cyan('npm install electron electron-builder --save-dev'));
      }
    }

    if (useLocal) {
      const linkHint = (appType === 'electron' || appType === 'both')
        ? 'npm link switch-framework switch-framework-backend switch-framework-electron'
        : 'npm link switch-framework switch-framework-backend';
      console.log('  ' + chalk.cyan(linkHint));
    }

    if (appType === 'web') {
      console.log('  ' + chalk.cyan('npm run dev'));
    } else if (appType === 'electron') {
      console.log('  ' + chalk.cyan('npm run electron:dev'));
    } else {
      console.log('  ' + chalk.cyan('npm run dev'));
      console.log('  ' + chalk.cyan('npm run electron:dev'));
      console.log('\nNote: web UI lives in ./web and electron files in ./electron');
    }

    console.log('\n' + chalk.gray('Read the docs: ') + chalk.cyan(DOCS_URL));
    console.log('');
  } catch (err) {
    spinner.fail('Failed');
    console.error(chalk.red(err?.stack || err?.message || String(err)));
    process.exit(1);
  }
}

main();
