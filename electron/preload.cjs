const { contextBridge, ipcRenderer } = require("electron");

// Espace minimal exposé au rendu, en toute sécurité (context isolation).
contextBridge.exposeInMainWorld("laVigie", {
  // Version de l'application (ex. "1.9.6") — à ne pas confondre avec celle d'Electron.
  getVersion: () => ipcRenderer.invoke("app-version"),
  electronVersion: process.versions.electron,
  platform: process.platform,
});
