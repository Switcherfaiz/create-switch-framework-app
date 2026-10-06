export const RUN_ELECTRON_DEV = 'npm run electron:dev';
export const LINK_ELECTRON_PACKAGES = 'npm link switch-framework switch-framework-backend switch-framework-electron switch-framework-icons switch-framework-router';

export function electronToolingToInstall(versions) {
  return `electron@${versions.electron} electron-builder@${versions.electronBuilder}`;
}

export function installElectronTooling(versions) {
  return `npm install ${electronToolingToInstall(versions)} --save-dev`;
}

export function electronPacksToInstall(versions) {
  return `switch-framework-electron@${versions.electronFramework}`;
}

export function installElectronPacks(versions) {
  return `npm install ${electronPacksToInstall(versions)}`;
}
