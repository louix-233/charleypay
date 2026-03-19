"use strict";
const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("electronAPI", {
  // Database
  getDatabasePath: () => ipcRenderer.invoke("get-database-path"),
  getUserDataPath: () => ipcRenderer.invoke("get-user-data-path"),
  // App info
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),
  // Window controls
  minimizeToTray: () => ipcRenderer.invoke("minimize-to-tray"),
  // External links
  openExternal: (url) => ipcRenderer.invoke("open-external", url),
  // Menu actions
  onMenuAction: (callback) => {
    ipcRenderer.on("menu-action", (_, action) => callback(action));
  },
  // Online status
  onOnlineStatusChanged: (callback) => {
    ipcRenderer.on("online-status-changed", (_, isOnline) => callback(isOnline));
  },
  // Platform info
  platform: process.platform,
  isElectron: true
});
