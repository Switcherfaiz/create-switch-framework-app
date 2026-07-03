const express = require('express');
const fs = require('node:fs');
const path = require('node:path');

function readPackageVersion(packageName) {
  try {
    return require(`${packageName}/package.json`).version;
  } catch {
    return null;
  }
}

function readProjectPackage() {
  const candidates = [
    path.join(__dirname, '..', 'package.json'),
    path.join(__dirname, '..', '..', 'package.json')
  ];

  for (const pkgPath of candidates) {
    try {
      return JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    } catch {}
  }

  return null;
}

function createApiRouter() {
  const router = express.Router();

  router.get('/versions', (req, res) => {
    const pkg = readProjectPackage();
    const createSwitchFrameworkApp = pkg?.switchFramework?.scaffoldVersion ?? null;

    res.json({
      switchFramework: readPackageVersion('switch-framework'),
      switchFrameworkBackend: readPackageVersion('switch-framework-backend'),
      createSwitchFrameworkApp
    });
  });

  return router;
}

module.exports = { createApiRouter };
