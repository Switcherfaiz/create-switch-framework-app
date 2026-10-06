import chalk from 'chalk';
import { INSTALL_DEPS, RUN_WEB_DEV, installDoctor, RUN_DOCTOR, installElectronTooling, linkCommand } from '../commands/index.js';
import { needsElectron } from '../commands/index.js';
import { RUN_ELECTRON_DEV } from '../commands/electron_commands.js';

const DOCS_URL = 'https://github.com/Switcherfaiz/switch-framework-docs';

export function printNextSteps({
  projectName,
  appType,
  install,
  installDoctor: wantDoctor,
  useLocal,
  versions
}) {
  console.log(`\n${chalk.green(chalk.bold('Success!'))}`);
  console.log('\nNext steps:');
  console.log(`  ${chalk.cyan(`cd ${projectName}`)}`);

  if (!install) {
    console.log(`  ${chalk.cyan(INSTALL_DEPS)}`);
    if (needsElectron(appType)) {
      console.log(`  ${chalk.cyan(installElectronTooling(versions))}`);
    }
    if (wantDoctor) {
      console.log(`  ${chalk.cyan(installDoctor(versions))}`);
    }
  }

  if (wantDoctor) console.log(`  ${chalk.cyan(RUN_DOCTOR)}`);
  if (useLocal) console.log(`  ${chalk.cyan(linkCommand({ appType }))}`);

  if (appType === 'web') {
    console.log(`  ${chalk.cyan(RUN_WEB_DEV)}`);
  } else if (appType === 'electron') {
    console.log(`  ${chalk.cyan(RUN_ELECTRON_DEV)}`);
  } else {
    console.log(`  ${chalk.cyan(RUN_WEB_DEV)}`);
    console.log(`  ${chalk.cyan(RUN_ELECTRON_DEV)}`);
    console.log('\nNote: web UI lives in ./web and electron files in ./electron');
  }

  console.log(`\n${chalk.gray('Read the docs: ')}${chalk.cyan(DOCS_URL)}\n`);
}
