const { contextBridge, ipcRenderer } = require('electron');

// Expose safe APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  startFocus: (config) => ipcRenderer.send('start-focus', config),
  stopFocus: () => ipcRenderer.send('stop-focus')
});
