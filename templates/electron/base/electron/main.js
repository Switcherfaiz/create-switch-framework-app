const path = require('node:path');
const { bootstrapElectronApp } = require('switch-framework-electron');
const servers = require('./servers.js');

bootstrapElectronApp({
  servers,
  preloadPath: path.join(__dirname, 'preload.js'),
  splashHtmlPath: path.join(__dirname, 'splash.html'),
  appRoot: path.join(__dirname, '..'),
  cwd: path.join(__dirname, '..'),
});
