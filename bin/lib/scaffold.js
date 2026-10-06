import path from 'node:path';
import fs from 'fs-extra';
import { createPackageJson } from './packageJson.js';
import { needsElectron } from '../commands/index.js';

async function copyDir(srcDir, destDir) {
  await fs.ensureDir(destDir);
  await fs.copy(srcDir, destDir, {
    overwrite: true,
    errorOnExist: false
  });
}

async function copyIfExists(src, dest) {
  if (!(await fs.pathExists(src))) return false;
  await fs.copy(src, dest, { overwrite: true });
  return true;
}

async function copyElectronShell({ electronBase, targetDir, packageName }) {
  await copyIfExists(path.join(electronBase, 'electron'), path.join(targetDir, 'electron'));
  await copyIfExists(path.join(electronBase, 'constants'), path.join(targetDir, 'constants'));
  await copyIfExists(path.join(electronBase, 'server'), path.join(targetDir, 'server'));
  await copyIfExists(path.join(electronBase, 'main.js'), path.join(targetDir, 'main.js'));
  await copyIfExists(path.join(electronBase, 'preload.js'), path.join(targetDir, 'preload.js'));

  const builderPath = path.join(targetDir, 'electron', 'electron-builder.json');
  if (!(await fs.pathExists(builderPath))) return;

  const builder = JSON.parse(await fs.readFile(builderPath, 'utf8'));
  builder.appId = `com.switchframework.${packageName}`;
  builder.productName = packageName;
  await fs.writeFile(builderPath, `${JSON.stringify(builder, null, 2)}\n`, 'utf8');
}

async function writeEnvExample({ targetDir, appType, port }) {
  const dest = path.join(targetDir, '.env.example');
  let text = `PORT=${port}\nSESSION_SECRET=dev-secret\n`;
  if (await fs.pathExists(dest)) {
    text = (await fs.readFile(dest, 'utf8')).replace(/PORT=\d+/, `PORT=${port}`);
    if (!/^PORT=/m.test(text)) text = `PORT=${port}\n${text}`;
  } else if (needsElectron(appType)) {
    text += '# ALLOW_WEB_VIEWING is set in constants/index.js (not .env)\n';
  }
  await fs.writeFile(dest, text, 'utf8');
}

export async function copyProjectTemplate({
  appType,
  templatesRoot,
  targetDir,
  packageName,
  port,
  useLocal,
  scaffoldVersion,
  installDoctor,
  versions
}) {
  const webBase = path.join(templatesRoot, 'web', 'base');
  const electronBase = path.join(templatesRoot, 'electron', 'base');
  const bothServer = path.join(templatesRoot, 'both', 'server.js');

  if (appType === 'web') {
    await copyDir(webBase, targetDir);
  }

  if (appType === 'electron') {
    await copyDir(electronBase, targetDir);
    await copyElectronShell({ electronBase, targetDir, packageName });
  }

  if (appType === 'both') {
    await fs.ensureDir(path.join(targetDir, 'web'));
    await copyDir(webBase, path.join(targetDir, 'web'));
    await copyElectronShell({ electronBase, targetDir, packageName });
    await copyIfExists(bothServer, path.join(targetDir, 'server.js'));
  }

  await writeEnvExample({ targetDir, appType, port });
  await fs.writeFile(
    path.join(targetDir, 'package.json'),
    createPackageJson({
      packageName,
      appType,
      port,
      useLocal,
      scaffoldVersion,
      installDoctor,
      versions
    }),
    'utf8'
  );
}
