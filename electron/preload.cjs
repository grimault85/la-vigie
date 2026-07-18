const { contextBridge } = require("electron");

// Espace minimal exposé au rendu, en toute sécurité (context isolation).
contextBridge.exposeInMainWorld("laVigie", {
  version: process.versions.electron,
  platform: process.platform,
});
