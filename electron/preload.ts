const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Database
  getDatabasePath: () => ipcRenderer.invoke('get-database-path'),
  getUserDataPath: () => ipcRenderer.invoke('get-user-data-path'),
  
  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // Window controls
  minimizeToTray: () => ipcRenderer.invoke('minimize-to-tray'),
  
  // External links
  openExternal: (url: string) => ipcRenderer.invoke('open-external', url),
  
  // Menu actions
  onMenuAction: (callback: (action: string) => void) => {
    ipcRenderer.on('menu-action', (_: any, action: string) => callback(action));
  },
  
  // Online status
  onOnlineStatusChanged: (callback: (isOnline: boolean) => void) => {
    ipcRenderer.on('online-status-changed', (_: any, isOnline: boolean) => callback(isOnline));
  },
  
  // Platform info
  platform: process.platform,
  isElectron: true,
});
