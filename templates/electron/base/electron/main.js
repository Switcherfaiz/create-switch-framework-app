const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const { registerWindowIpc, onServerReady } = require('./ipc.js');
const { startServers } = require('./child.js');
const { createLocalSession } = require('./session.js');

const DEFAULT_WINDOW_BOUNDS = { width: 1200, height: 800 };

let mainWindow;
let splashWindow;
let isBootstrapping = false;
let localSession = null;

async function attachLocalAuthCookie(win, host, port, token) {
  if (!token || !win) return;
  const url = `http://${host}:${port}/`;
  try {
    await win.webContents.session.cookies.set({
      url,
      name: 'switch-local-auth',
      value: token,
      httpOnly: true,
      path: '/',
    });
  } catch (err) {
    console.error('[electron] Failed to set local auth cookie:', err);
  }
}

function createSplashWindow() {
  const splash = new BrowserWindow({
    ...DEFAULT_WINDOW_BOUNDS,
    center: true,
    frame: false,
    backgroundColor: '#f5f5f5',
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  splash.loadFile(path.join(__dirname, 'splash.html'));
  splash.once('ready-to-show', () => splash.show());
  splash.on('closed', () => {
    splashWindow = null;
    if (!mainWindow) app.quit();
  });

  return splash;
}

function createMainWindow(bounds, { host, port, token }) {
  return new Promise((resolve) => {
    process.env.SWITCH_WINDOW_HOST = host;
    process.env.SWITCH_WINDOW_PORT = String(port);

    mainWindow = new BrowserWindow({
      ...bounds,
      frame: false,
      backgroundColor: '#f5f5f5',
      show: false,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: false,
        contextIsolation: true,
      },
    });

    registerWindowIpc(mainWindow);

    mainWindow.on('closed', () => {
      mainWindow = null;
    });

    const appUrl = `http://${host}:${port}/`;

    mainWindow.webContents.on('did-fail-load', (_event, _code, description) => {
      console.error('[electron] Page failed to load:', description);
      setTimeout(() => {
        if (!mainWindow?.isDestroyed()) mainWindow.loadURL(appUrl);
      }, 750);
    });

    mainWindow.once('ready-to-show', () => resolve(mainWindow));

    attachLocalAuthCookie(mainWindow, host, port, token).then(() => {
      mainWindow.loadURL(appUrl);
    });
  });
}

async function openMainWindow(ports) {
  if (!splashWindow || splashWindow.isDestroyed()) return;

  const appServer = ports.app || Object.values(ports)[0];
  if (!appServer?.port) {
    throw new Error('App server did not report a port');
  }

  const host = appServer.host || '127.0.0.1';
  const bounds = splashWindow.getBounds();
  await createMainWindow(bounds, {
    host,
    port: appServer.port,
    token: localSession?.token,
  });

  if (splashWindow && !splashWindow.isDestroyed()) {
    splashWindow.close();
  }

  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.show();
  }
}

function bootstrap() {
  if (isBootstrapping) return;
  isBootstrapping = true;

  localSession = createLocalSession();
  splashWindow = createSplashWindow();
  startServers(localSession);

  onServerReady((ports) => {
    openMainWindow(ports)
      .catch((err) => {
        console.error('[electron] Failed to open main window:', err);
        if (splashWindow && !splashWindow.isDestroyed()) splashWindow.close();
        if (!mainWindow) app.quit();
      })
      .finally(() => {
        isBootstrapping = false;
      });
  });
}

app.whenReady().then(() => {
  bootstrap();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) bootstrap();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
