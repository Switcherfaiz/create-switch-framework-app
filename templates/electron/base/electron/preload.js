const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('switchApp', {
  isElectron: true,
  runtime: {
    host: process.env.SWITCH_WINDOW_HOST || '127.0.0.1',
    port: process.env.SWITCH_WINDOW_PORT ? Number(process.env.SWITCH_WINDOW_PORT) : null,
  },
  windowControls: {
    minimize: () => ipcRenderer.send('window:minimize'),
    maximize: () => ipcRenderer.send('window:maximize'),
    close: () => ipcRenderer.send('window:close'),
    isMaximized: () => ipcRenderer.invoke('window:is-maximized'),
  },
});
