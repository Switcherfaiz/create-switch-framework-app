'use strict';

const path = require('node:path');
const fs = require('node:fs');
const http = require('http');
const { fork } = require('node:child_process');
const { SERVER_READY_MESSAGE } = require('./messages.js');
const serverList = require('./servers.js');

const SERVER_CHILD_FLAG = 'SWITCH_SERVER_CHILD';
const APP_ROOT_ENV = 'SWITCH_APP_ROOT';
const USER_DATA_ENV = 'SWITCH_USER_DATA';
const IS_PACKAGED_ENV = 'SWITCH_IS_PACKAGED';

const processes = new Map();

function getAppRoot() {
  const { app } = require('electron');
  return app.isPackaged ? app.getAppPath() : path.join(__dirname, '..');
}

function configurePackagedPaths() {
  const { app } = require('electron');
  if (!app.isPackaged) return;

  const esbuildBinary = path.join(
    process.resourcesPath,
    'app.asar.unpacked',
    'node_modules',
    '@esbuild',
    `${process.platform}-${process.arch}`,
    process.platform === 'win32' ? 'esbuild.exe' : 'bin/esbuild',
  );

  if (fs.existsSync(esbuildBinary)) {
    process.env.ESBUILD_BINARY_PATH = esbuildBinary;
  }
}

function stopServerProcess(name) {
  if (name) {
    const child = processes.get(name);
    if (child && !child.killed) child.kill();
    processes.delete(name);
    return;
  }
  for (const [key, child] of processes) {
    if (child && !child.killed) child.kill();
    processes.delete(key);
  }
}

function startServerProcess(spec = {}, session = {}) {
  const name = spec.name || 'app';
  if (processes.has(name)) return processes.get(name);

  const { app } = require('electron');
  const { registerServerIpc } = require('./ipc.js');

  configurePackagedPaths();

  const childPath = path.join(__dirname, 'child.js');
  const forkCwd = app.isPackaged ? process.resourcesPath : path.join(__dirname, '..');
  const appRoot = getAppRoot();
  const userDataPath = app.getPath('userData');

  const child = fork(childPath, [], {
    cwd: forkCwd,
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: '1',
      [SERVER_CHILD_FLAG]: '1',
      [APP_ROOT_ENV]: appRoot,
      [USER_DATA_ENV]: userDataPath,
      [IS_PACKAGED_ENV]: app.isPackaged ? '1' : '0',
      SWITCH_SERVER_NAME: name,
      SWITCH_SERVER_ENTRY: spec.entry || 'server.js',
      PORT: '0',
      SWITCH_BIND_HOST: '127.0.0.1',
      SWITCH_LOCAL_AUTH_TOKEN: session.token || '',
      ...(spec.env || {}),
    },
    stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
  });

  registerServerIpc(child);

  child.on('error', (err) => {
    console.error(`[electron/child:${name}] Process error:`, err);
  });

  child.on('exit', (code, signal) => {
    if (code !== 0 && code !== null) {
      console.error(`[electron/child:${name}] Process exited:`, { code, signal });
    }
    processes.delete(name);
  });

  processes.set(name, child);
  return child;
}

function startServers(session = {}) {
  const { expectServers } = require('./ipc.js');
  const list = Array.isArray(serverList) ? serverList : [serverList];
  expectServers(list.map((item) => item.name || 'app'));
  return list.map((item) => startServerProcess(item, session));
}

if (process.env[SERVER_CHILD_FLAG] === '1') {
  const origListen = http.Server.prototype.listen;
  http.Server.prototype.listen = function listen() {
    const port = process.env.PORT === undefined ? 0 : Number(process.env.PORT);
    const host = process.env.SWITCH_BIND_HOST || '127.0.0.1';
    this.once('listening', () => {
      const addr = this.address();
      const info = {
        type: SERVER_READY_MESSAGE,
        name: process.env.SWITCH_SERVER_NAME || 'app',
        port: typeof addr === 'object' && addr ? addr.port : port,
        host: typeof addr === 'object' && addr ? addr.address : host,
      };
      console.log(`[electron/child:${info.name}] http://${info.host}:${info.port}`);
      if (typeof process.send === 'function') process.send(info);
    });
    return origListen.call(this, Number.isFinite(port) ? port : 0, host);
  };

  const appRoot = process.env[APP_ROOT_ENV];
  const entry = process.env.SWITCH_SERVER_ENTRY || 'server.js';
  require(path.join(appRoot, entry));
} else {
  const { app } = require('electron');
  app.on('before-quit', () => stopServerProcess());
  module.exports = { startServerProcess, startServers, stopServerProcess };
}
