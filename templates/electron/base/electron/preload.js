const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('switchApp', {
  ping: () => 'pong'
});
