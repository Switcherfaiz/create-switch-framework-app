export const INSTALL_DEPS = 'npm install';
export const RUN_WEB_DEV = 'npm run dev';
export const LINK_WEB_PACKAGES = 'npm link switch-framework switch-framework-backend switch-framework-icons switch-framework-router';

export function switchPacksToInstall(versions) {
  return `switch-framework@${versions.framework} switch-framework-backend@${versions.backend} switch-framework-icons@${versions.icons} switch-framework-router@${versions.router}`;
}

export function installSwitchPacks(versions) {
  return `npm install ${switchPacksToInstall(versions)}`;
}
