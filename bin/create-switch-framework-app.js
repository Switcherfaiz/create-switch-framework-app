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

function serverJsTemplate({ port, appType }) {
  const staticRoot = appType === 'both' ? 'web' : '.';

  return `const express = require('express');\n` +
    `const session = require('express-session');\n` +
    `const path = require('node:path');\n` +
    `require('dotenv').config();\n\n` +
    `const { checkRestrict } = require('switch-framework-backend/middleware');\n\n` +
    `const app = express();\n` +
    `const PORT = process.env.PORT ? Number(process.env.PORT) : ${port};\n\n` +
    `app.use(express.json({ limit: '25mb' }));\n\n` +
    `app.use(session({\n` +
    `  secret: process.env.SESSION_SECRET || 'dev-secret',\n` +
    `  resave: false,\n` +
    `  saveUninitialized: false\n` +
    `}));\n\n` +
    `// Serve switch-framework to the browser from node_modules\n` +
    `app.use('/switch-framework', express.static(path.join(__dirname, 'node_modules', 'switch-framework')));\n\n` +
    `// Serve project files\n` +
    `app.use(express.static(path.join(__dirname, '${staticRoot}')));\n\n` +
    `const restrictConfig = {\n` +
    `  public: ['/', '/login'],\n` +
    `  rules: [\n` +
    `    { prefix: '/admin', roles: ['admin'] },\n` +
    `    { prefix: '/billing', roles: ['billing', 'admin'] },\n` +
    `    { path: '/login', roles: ['*'] }\n` +
    `  ]\n` +
    `};\n\n` +
    `app.use(checkRestrict(restrictConfig));\n\n` +
    `app.get('*', (req, res) => {\n` +
    `  res.sendFile(path.join(__dirname, '${staticRoot}', 'index.html'));\n` +
    `});\n\n` +
    `app.listen(PORT, () => {\n` +
    `  console.log('Switch Framework app running at http://localhost:' + PORT);\n` +
    `});\n`;
}

function electronMainTemplate({ port }) {
  return `const { app, BrowserWindow } = require('electron');\n` +
    `const path = require('node:path');\n\n` +
    `let mainWindow;\n\n` +
    `function createWindow() {\n` +
    `  mainWindow = new BrowserWindow({\n` +
    `    width: 1200,\n` +
    `    height: 800,\n` +
    `    webPreferences: {\n` +
    `      preload: path.join(__dirname, 'preload.js')\n` +
    `    }\n` +
    `  });\n\n` +
    `  mainWindow.loadURL('http://localhost:${port}');\n` +
    `}\n\n` +
    `app.whenReady().then(() => {\n` +
    `  require('../server.js');\n` +
    `  setTimeout(createWindow, 350);\n` +
    `  app.on('activate', () => {\n` +
    `    if (BrowserWindow.getAllWindows().length === 0) createWindow();\n` +
    `  });\n` +
    `});\n\n` +
    `app.on('window-all-closed', () => {\n` +
    `  if (process.platform !== 'darwin') app.quit();\n` +
    `});\n`;
}

function electronPreloadTemplate() {
  return `const { contextBridge } = require('electron');\n\n` +
    `contextBridge.exposeInMainWorld('switchApp', {\n` +
    `  ping: () => 'pong'\n` +
    `});\n`;
}

function electronBuilderTemplate({ packageName }) {
  return JSON.stringify(
    {
      appId: `com.switchframework.${packageName}`,
      productName: packageName,
      directories: { output: 'dist' },
      files: ['**/*'],
      win: { target: 'nsis' },
      mac: { target: 'dmg' },
      linux: { target: 'AppImage' }
    },
    null,
    2
  ) + '\n';
}

function createPackageJson({ packageName, appType, port, useLocal }) {
  const scripts = {
    dev: 'node server.js',
    start: 'node server.js'
  };

  if (appType === 'electron' || appType === 'both') {
    scripts['electron:dev'] = 'electron .';
  }

  const deps = {
    dotenv: '^16.4.5',
    express: '^4.19.2',
    'express-session': '^1.18.1'
  };

  // When --use-local is set, we intentionally do NOT add switch-framework deps to package.json
  // to avoid npm registry fetching during testing. We will npm link them instead.
  if (!useLocal) {
    deps['switch-framework'] = '^0.2.0';
    deps['switch-framework-backend'] = '^0.1.0';
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

  if (appType === 'electron' || appType === 'both') {
    pkg.devDependencies = {
      electron: '^31.3.1',
      'electron-builder': '^24.13.3'
    };
  }

  // Keep port discoverable
  pkg.switchFramework = { port };

  return JSON.stringify(pkg, null, 2) + '\n';
}

async function copyDir(srcDir, destDir) {
  await fs.ensureDir(destDir);
  await fs.copy(srcDir, destDir, {
    overwrite: true,
    errorOnExist: false
  });
}

async function runNpmInstall({ cwd }) {
  return new Promise((resolve, reject) => {
    const child = require('node:child_process').spawn('npm', ['install'], {
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

async function main() {
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

    if (appType === 'web') {
      await copyDir(webBase, targetDir);
      await fs.writeFile(path.join(targetDir, 'server.js'), serverJsTemplate({ port, appType }), 'utf8');
    }

    if (appType === 'electron') {
      const baseDir = (await fs.pathExists(electronBase)) ? electronBase : webBase;
      await copyDir(baseDir, targetDir);
      await fs.ensureDir(path.join(targetDir, 'electron'));
      await fs.writeFile(path.join(targetDir, 'server.js'), serverJsTemplate({ port, appType }), 'utf8');
      await fs.writeFile(path.join(targetDir, 'electron', 'main.js'), electronMainTemplate({ port }), 'utf8');
      await fs.writeFile(path.join(targetDir, 'electron', 'preload.js'), electronPreloadTemplate(), 'utf8');
      await fs.writeFile(path.join(targetDir, 'electron', 'electron-builder.json'), electronBuilderTemplate({ packageName }), 'utf8');

      // Electron expects entry at project root
      await fs.writeFile(
        path.join(targetDir, 'main.js'),
        "module.exports = require('./electron/main.js');\n",
        'utf8'
      );
      await fs.writeFile(
        path.join(targetDir, 'preload.js'),
        "module.exports = require('./electron/preload.js');\n",
        'utf8'
      );
    }

    if (appType === 'both') {
      await fs.ensureDir(path.join(targetDir, 'web'));
      await copyDir(webBase, path.join(targetDir, 'web'));

      await fs.ensureDir(path.join(targetDir, 'electron'));
      await fs.writeFile(path.join(targetDir, 'server.js'), serverJsTemplate({ port, appType }), 'utf8');
      await fs.writeFile(path.join(targetDir, 'electron', 'main.js'), electronMainTemplate({ port }), 'utf8');
      await fs.writeFile(path.join(targetDir, 'electron', 'preload.js'), electronPreloadTemplate(), 'utf8');
      await fs.writeFile(path.join(targetDir, 'electron', 'electron-builder.json'), electronBuilderTemplate({ packageName }), 'utf8');

      await fs.writeFile(
        path.join(targetDir, 'main.js'),
        "module.exports = require('./electron/main.js');\n",
        'utf8'
      );
      await fs.writeFile(
        path.join(targetDir, 'preload.js'),
        "module.exports = require('./electron/preload.js');\n",
        'utf8'
      );
    }

    await fs.writeFile(
      path.join(targetDir, '.env.example'),
      `PORT=${port}\nSESSION_SECRET=dev-secret\n`,
      'utf8'
    );

    await fs.writeFile(
      path.join(targetDir, 'package.json'),
      createPackageJson({ packageName, appType, port, useLocal }),
      'utf8'
    );

    spinner.succeed('Project created');

    if (install) {
      spinner.start('Installing dependencies (npm install)...');
      try {
        await runNpmInstall({ cwd: targetDir });
        spinner.succeed('Dependencies installed');
      } catch (e) {
        spinner.warn('npm install failed (project was still created)');
        console.error(chalk.yellow(e?.message || String(e)));
      }
    }

    if (useLocal) {
      spinner.start('Linking local packages (npm link switch-framework switch-framework-backend)...');
      try {
        await runNpmLink({ cwd: targetDir, packages: ['switch-framework', 'switch-framework-backend'] });
        spinner.succeed('Local packages linked');
      } catch (e) {
        spinner.warn('npm link failed');
        console.error(chalk.yellow(e?.message || String(e)));
        console.log(chalk.yellow('Make sure you ran npm link inside your switch-framework and switch-framework-backend packages first.'));
      }
    }

    // Ensure no spinner state bleeds into final output
    spinner.stop();

    const docsUrl = 'https://github.com/Switcherfaiz/switch-framework-docs';

    console.log('\n' + chalk.green(chalk.bold('Success!')));
    console.log('\nNext steps:');
    console.log('  ' + chalk.cyan('cd ' + projectName));

    if (!install) {
      console.log('  ' + chalk.cyan('npm install'));
    }

    if (useLocal) {
      console.log('  ' + chalk.cyan('npm link switch-framework switch-framework-backend'));
    }

    if (appType === 'web') {
      console.log('  ' + chalk.cyan('npm run dev'));
    } else if (appType === 'electron') {
      console.log('  ' + chalk.cyan('npm run electron:dev'));
    } else {
      console.log('  ' + chalk.cyan('cd web && npm run dev'));
      console.log('  ' + chalk.cyan('npm run electron:dev'));
      console.log('\nNote: web UI lives in ./web and electron files in ./electron');
    }

    console.log('\n' + chalk.bold('Docs:'));
    console.log('  ' + chalk.cyan(docsUrl));
    console.log('  Clone the repo, run ' + chalk.cyan('npm run dev') + ', then open http://localhost:3000');
    console.log('');
  } catch (err) {
    spinner.fail('Failed');
    console.error(chalk.red(err?.stack || err?.message || String(err)));
    process.exit(1);
  }
}

main();
