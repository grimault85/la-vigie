# La Vigie

**Application de bureau de pilotage financier** (Mac & Windows) pour l'hôtel-restaurant
*Le Noirmoutier*. Le gérant importe sa balance et sa caisse, et visualise l'état de son
entreprise : compte de résultat HT, ratios de santé, comparatif d'une année sur l'autre,
taux de remplissage, suivi annuel.

> Outil calibré spécifiquement pour cet établissement (plan comptable, familles de caisse,
> comptes d'hébergement).

## Architecture

- **Interface** : React (Vite), compilée en un fichier HTML autonome (`dist/index.html`)
  où tout est embarqué — aucune dépendance à installer au runtime.
- **Application native** : Electron enveloppe ce fichier dans une vraie fenêtre Mac/Windows
  (icône, menu, mises à jour possibles). Empaquetage via electron-builder.
- **Données** : mémorisées automatiquement en local par Electron (persistantes entre les
  ouvertures et les mises à jour), sans fichier à gérer.

## Développement

Prérequis : Node.js 18+.

```bash
npm install        # installe les dépendances (dont Electron)
npm run dev        # interface seule dans le navigateur (http://localhost:5173)
npm start          # build + lance l'application de bureau (Electron)
```

## Produire les installateurs

Voir **BUILD-DESKTOP.md** pour la marche à suivre détaillée (Windows, Mac, signature).

```bash
npm run dist:win   # sur Windows → release/La Vigie Setup x.y.z.exe
npm run dist:mac   # sur Mac     → release/La Vigie-x.y.z.dmg
```

Chaque installateur se compile **sur le système qu'il cible** (Windows pour le .exe,
Mac pour le .dmg).

## Structure

```
src/App.jsx          tout le logiciel (logique + interface + exports)
src/main.jsx         point d'entrée React
index.html           gabarit + favicon (logo)
vite.config.js       build single-file
electron/main.cjs    processus principal Electron (fenêtre, menu)
electron/preload.cjs  pont sécurisé (context isolation)
build/               icônes (icon.png pour Mac/Linux, icon.ico pour Windows)
```
