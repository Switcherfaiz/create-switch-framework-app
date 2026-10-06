import { spawn } from 'node:child_process';

export function runCommand(command, { cwd } = {}) {
  if (!command) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const child = spawn(command, {
      cwd,
      stdio: 'inherit',
      shell: true
    });

    child.on('exit', (code) => {
      if (code === 0) resolve(command);
      else reject(new Error(`Command failed (${code}): ${command}`));
    });

    child.on('error', reject);
  });
}
