const { app, BrowserWindow } = require('electron');
const path = require('node:path');

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadURL(`http://localhost:${port}`);
}

app.whenReady().then(() => {
  require('../server.js');
  setTimeout(createWindow, 350);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
