import { INSTALL_DEPS, installSwitchPacks, LINK_WEB_PACKAGES } from './web_commands.js';
import { installElectronPacks, installElectronTooling, LINK_ELECTRON_PACKAGES } from './electron_commands.js';
import { installDoctor } from './doctor_commands.js';

export function needsElectron(appType) {
  return appType === 'electron' || appType === 'both';
}

export function installCommands({ appType, useLocal, installDoctor: wantDoctor, versions }) {
  const commands = [INSTALL_DEPS];

  if (!useLocal) {
    commands.push(installSwitchPacks(versions));
    if (needsElectron(appType)) commands.push(installElectronPacks(versions));
  }

  if (needsElectron(appType)) commands.push(installElectronTooling(versions));
  if (wantDoctor) commands.push(installDoctor(versions));

  return commands;
}

export function linkCommand({ appType }) {
  return needsElectron(appType) ? LINK_ELECTRON_PACKAGES : LINK_WEB_PACKAGES;
}

export {
  INSTALL_DEPS,
  installSwitchPacks,
  LINK_WEB_PACKAGES
} from './web_commands.js';
export {
  installElectronPacks,
  installElectronTooling,
  LINK_ELECTRON_PACKAGES,
  RUN_ELECTRON_DEV
} from './electron_commands.js';
export { installDoctor, RUN_DOCTOR } from './doctor_commands.js';
export { RUN_WEB_DEV } from './web_commands.js';
