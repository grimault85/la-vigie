# La Vigie

**Logiciel de pilotage financier** pour l'hôtel-restaurant *Le Noirmoutier*.
Le gérant importe sa balance et sa caisse, et visualise l'état de son entreprise :
compte de résultat HT, ratios de santé, taux de remplissage, suivi annuel.

> Outil **calibré spécifiquement** pour cet établissement (plan comptable, familles
> de caisse, comptes d'hébergement). Il n'est pas conçu comme un produit multi-clients.

## Fonctionnement

- **Import balance (PDF ou Excel)** — lecture automatique des comptes de classe 6 & 7,
  regroupement selon le Plan Comptable Général, détection du mois. Contrôle de cohérence
  avec le total « comptes de résultat » de la balance.
- **Import caisse (Jalia, .xlsx)** — ventilation du CA HT en Restauration / Bar / Hôtel /
  Petit déjeuner / Événements.
- **Compte de résultat** en cascade jusqu'au résultat net après IS, toutes lignes éditables.
- **Santé** — score /100 et ratios (coût matières, masse salariale, coût principal, loyers,
  marge d'EBE), sur le mois, un mois enregistré, ou une période cumulée, avec courbe d'évolution.
- **Remplissage hôtel** — taux d'occupation mensuel et lissé annuel, ADR, RevPAR.
- **Suivi annuel** — un mois par colonne, exercices archivables (lecture seule),
  mémorisation automatique locale.
- **Exports** — bilan mensuel en **PDF** et en **Excel** à la charte, tableau annuel en Excel.

## Développement

Prérequis : Node.js 18+.

```bash
npm install
npm run dev        # serveur de dev (http://localhost:5173)
npm run build      # génère dist/index.html — fichier HTML autonome unique
```

Le build produit **un seul fichier** `dist/index.html` (React, pdf.js, jsPDF, xlsx et
le logo sont embarqués). Il fonctionne hors ligne, en double-clic.

## Installateur Windows

L'installateur `.exe` empaquette le fichier HTML et crée les raccourcis (bureau + menu
Démarrer), avec lancement en mode application (Edge/Chrome) et profil dédié pour la
mémorisation. Il se compile avec [NSIS](https://nsis.sourceforge.io/).

```bash
npm run build
cp dist/index.html installer/app.html
cd installer
makensis installer.nsi          # produit Installer-Diagnostic-Sante.exe
```

> L'exe n'est pas signé : au premier lancement, Windows SmartScreen demande une
> confirmation (Informations complémentaires → Exécuter quand même).

## Passage macOS (à venir)

Le cœur (React) est portable tel quel. Le portage `.app` (fenêtre native, icône Dock)
se fera via un emballage type Tauri/Electron, à compiler sur un Mac.

## Structure

```
src/App.jsx          tout le logiciel (logique + interface + exports)
src/main.jsx         point d'entrée React
index.html           gabarit + favicon (logo)
vite.config.js       build single-file
installer/           script NSIS + icône
```
