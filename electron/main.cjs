const { app, BrowserWindow, Menu, shell, dialog } = require("electron");
const path = require("path");
const { autoUpdater } = require("electron-updater");

const isMac = process.platform === "darwin";

/* ---------- Mise à jour automatique ----------
   L'application vérifie s'il existe une version plus récente publiée sur GitHub.
   Rien n'est téléchargé ni installé sans accord : une application qui redémarre
   d'elle-même ferait perdre une saisie comptable en cours. */
autoUpdater.autoDownload = false;              // on demande avant de télécharger
autoUpdater.autoInstallOnAppQuit = false;      // et avant d'installer
autoUpdater.logger = null;

let verifManuelle = false;                     // vrai si l'utilisateur a cliqué dans le menu

function verifierMisesAJour(manuelle = false) {
  verifManuelle = manuelle;
  autoUpdater.checkForUpdates().catch((err) => {
    if (manuelle) {
      dialog.showMessageBox({
        type: "warning",
        title: "Mise à jour",
        message: "Vérification impossible",
        detail:
          "Impossible de contacter le serveur des mises à jour.\n\n" +
          "Vérifiez votre connexion internet, puis réessayez.\n\n(" +
          (err && err.message ? err.message : "erreur inconnue") + ")",
        buttons: ["Fermer"],
      });
    }
  });
}

autoUpdater.on("update-available", async (info) => {
  const { response } = await dialog.showMessageBox({
    type: "info",
    title: "Mise à jour disponible",
    message: `La version ${info.version} est disponible`,
    detail:
      `Vous utilisez actuellement la version ${app.getVersion()}.\n\n` +
      "Souhaitez-vous la télécharger maintenant ? Vous pourrez choisir le moment " +
      "de l'installation — rien ne sera interrompu sans votre accord.",
    buttons: ["Télécharger", "Plus tard"],
    defaultId: 0,
    cancelId: 1,
  });
  if (response === 0) autoUpdater.downloadUpdate();
});

autoUpdater.on("update-not-available", () => {
  if (!verifManuelle) return;
  dialog.showMessageBox({
    type: "info",
    title: "Mise à jour",
    message: "Vous êtes à jour",
    detail: `La Vigie ${app.getVersion()} est la version la plus récente.`,
    buttons: ["Fermer"],
  });
});

autoUpdater.on("update-downloaded", async (info) => {
  const { response } = await dialog.showMessageBox({
    type: "info",
    title: "Mise à jour prête",
    message: `La version ${info.version} est prête à être installée`,
    detail:
      "L'installation ferme l'application quelques secondes, puis la rouvre.\n\n" +
      "Enregistrez votre travail en cours avant de continuer. Vos données " +
      "(exercices, budgets, suivi hôtel) sont conservées.",
    buttons: ["Installer et redémarrer", "À la prochaine fermeture"],
    defaultId: 1,
    cancelId: 1,
  });
  if (response === 0) autoUpdater.quitAndInstall();
  else autoUpdater.autoInstallOnAppQuit = true;
});

autoUpdater.on("error", (err) => {
  if (!verifManuelle) return;                  // silencieux si vérification automatique
  dialog.showMessageBox({
    type: "warning",
    title: "Mise à jour",
    message: "La mise à jour a échoué",
    detail: (err && err.message ? err.message : "Erreur inconnue") +
      "\n\nVous pouvez réessayer plus tard, ou télécharger la nouvelle version manuellement.",
    buttons: ["Fermer"],
  });
});

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
        label: "Rechercher les mises à jour…",
        click: () => verifierMisesAJour(true),
      },
      { type: "separator" },
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
  // Vérification discrète au démarrage : silencieuse s'il n'y a rien de neuf
  // ou si le poste est hors ligne. Différée pour ne pas ralentir l'ouverture.
  if (app.isPackaged) setTimeout(() => verifierMisesAJour(false), 4000);
});

app.on("window-all-closed", () => {
  if (!isMac) app.quit();
});
