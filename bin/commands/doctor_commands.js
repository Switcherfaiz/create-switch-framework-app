export const RUN_DOCTOR = 'npx switch-framework-doctor';

export function doctorPackToInstall(versions) {
  return `switch-framework-doctor@${versions.doctor}`;
}

export function installDoctor(versions) {
  return `npm install ${doctorPackToInstall(versions)} --save-dev`;
}
