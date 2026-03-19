const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // renderer → main
  quitApp:    ()       => ipcRenderer.send('quit-app'),
  openMenu:   ()       => ipcRenderer.send('open-menu'),
  themeReady: (id)     => ipcRenderer.send('theme-ready', id),

  // main → renderer
  onThemeChange:  (cb) => ipcRenderer.on('theme-change',  (_, id)  => cb(id)),
  onTimerRestart: (cb) => ipcRenderer.on('timer-restart', ()       => cb()),
});
