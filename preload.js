const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('shell', {
    open: () => ipcRenderer.on('shell:open'),
})