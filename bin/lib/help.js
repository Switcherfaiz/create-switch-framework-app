import chalk from 'chalk';

export function printHelp() {
  console.log(`\n${chalk.bold('create-switch-framework-app')}\n`);
  console.log('Usage:');
  console.log('  npx create-switch-framework-app <project-name> [options]');
  console.log('\nOptions:');
  console.log('  --yes, -y        Skip prompts and use defaults');
  console.log('  --app-type       One of: web | electron | both');
  console.log('  --port           Server port (1-65535)');
  console.log('  --no-install     Do not run npm install');
  console.log('  --use-local      Use npm link for local switch-framework packages');
  console.log('  --doctor         Also install switch-framework-doctor (npx switch-framework-doctor)');
  console.log('  --no-doctor      Do not install switch-framework-doctor');
  console.log('  -h, --help       Show help');
}
