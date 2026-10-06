import enquirer from 'enquirer';
import { sanitizeProjectName } from './names.js';

const { prompt } = enquirer;

export async function askQuestions({
  projectName,
  yes,
  noInstall,
  appTypeOverride,
  portOverride,
  doctorOverride
}) {
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
      install: noInstall ? false : defaults.install,
      installDoctor: doctorOverride === true
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

  if (doctorOverride == null) {
    questions.push({
      type: 'confirm',
      name: 'installDoctor',
      message: 'Also install switch-framework-doctor? (npx switch-framework-doctor)',
      initial: true
    });
  }

  const answers = await prompt(questions);
  return {
    projectName: projectName || answers.projectName,
    appType: answers.appType,
    port: Number(answers.port),
    install: noInstall ? false : Boolean(answers.install),
    installDoctor: doctorOverride != null ? Boolean(doctorOverride) : Boolean(answers.installDoctor)
  };
}
