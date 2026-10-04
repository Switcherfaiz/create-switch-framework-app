import { needsElectron } from '../commands/index.js';

export function createPackageJson({
  packageName,
  appType,
  port,
  useLocal,
  scaffoldVersion,
  installDoctor,
  versions
}) {
  const scripts = {
    dev: 'node server.js',
    start: 'node server.js'
  };

  if (needsElectron(appType)) {
    scripts['electron:dev'] = 'electron .';
    scripts.build = 'electron-builder --config electron/electron-builder.json';
  }

  if (installDoctor) scripts.doctor = 'switch-framework-doctor';

  const deps = {
    dotenv: versions.dotenv
  };

  if (!useLocal) {
    deps['switch-framework'] = versions.framework;
    deps['switch-framework-backend'] = versions.backend;
    if (needsElectron(appType)) deps['switch-framework-electron'] = versions.electronFramework;
  }

  const pkg = {
    name: packageName,
    private: true,
    type: 'commonjs',
    scripts,
    dependencies: deps
  };

  if (needsElectron(appType)) pkg.main = 'main.js';

  if (installDoctor) {
    pkg.devDependencies = {
      'switch-framework-doctor': versions.doctor
    };
  }

  pkg.switchFramework = { port, scaffoldVersion };

  return `${JSON.stringify(pkg, null, 2)}\n`;
}
