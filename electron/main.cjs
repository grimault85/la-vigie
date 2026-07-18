const { app, BrowserWindow, Menu, shell, dialog } = require("electron");
const path = require("path");

const isMac = process.platform === "darwin";

function createWindow() {
  const win = new BrowserWindow({
    width: 1240,
    height: 840,
    minWidth: 980,
    minHeight: 640,
    title: "La Vigie",
    backgroundColor: "#F8F6F2",
    show: false,
    icon: path.join(__dirname, "..", "build", "icon.png"),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  win.loadFile(path.join(__dirname, "..", "dist", "index.html"));
  win.once("ready-to-show", () => win.show());

  // Les liens http s'ouvrent dans le navigateur par défaut, pas dans l'app
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http")) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });
}

const menuTemplate = [
  ...(isMac ? [{ role: "appMenu" }] : []),
  {
    label: "Fichier",
    submenu: [isMac ? { role: "close", label: "Fermer" } : { role: "quit", label: "Quitter" }],
  },
  {
    label: "Édition",
    submenu: [
      { role: "undo", label: "Annuler" },
      { role: "redo", label: "Rétablir" },
      { type: "separator" },
      { role: "cut", label: "Couper" },
      { role: "copy", label: "Copier" },
      { role: "paste", label: "Coller" },
      { role: "selectAll", label: "Tout sélectionner" },
    ],
  },
  {
    label: "Affichage",
    submenu: [
      { role: "reload", label: "Recharger" },
      { role: "resetZoom", label: "Zoom normal" },
      { role: "zoomIn", label: "Zoom avant" },
      { role: "zoomOut", label: "Zoom arrière" },
      { type: "separator" },
      { role: "togglefullscreen", label: "Plein écran" },
    ],
  },
  {
    label: "Aide",
    submenu: [
      {
        label: "À propos de La Vigie",
        click: () => {
          dialog.showMessageBox({
            type: "info",
            title: "La Vigie",
            message: "La Vigie",
            detail:
              "Pilotage financier — compte de résultat, santé & taux de remplissage.\n\nVersion " +
              app.getVersion(),
            buttons: ["Fermer"],
          });
        },
      },
    ],
  },
];

app.whenReady().then(() => {
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (!isMac) app.quit();
});
