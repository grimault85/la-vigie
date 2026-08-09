# Produire l'application La Vigie (Mac & Windows)

L'application est une app Electron. Chaque installateur se compile **sur le système
d'exploitation qu'il cible** : le `.exe` sur Windows, le `.dmg` sur Mac. C'est une
contrainte normale d'Electron (pas de compilation croisée fiable).

## 0. Prérequis (une fois)

- Installer **Node.js 18 ou plus** : https://nodejs.org
- Récupérer le projet, puis dans un terminal, à la racine :

```bash
npm install
```

## 1. Tester en local (sur n'importe quel poste)

```bash
npm start
```

Compile l'interface et ouvre l'application dans une vraie fenêtre. Pratique pour vérifier
avant de produire un installateur.

## 2. Installateur Windows (.exe)

Sur une machine **Windows** :

```bash
npm run dist:win
```

Le fichier est généré dans `release/` :
`La Vigie Setup 1.9.0.exe`

C'est l'installateur à distribuer. À l'installation, l'utilisateur peut choisir le dossier,
et un raccourci « La Vigie » est créé.

> **Note signature** : l'exe n'est pas signé. Au premier lancement, Windows SmartScreen
> affiche un avertissement (Informations complémentaires → Exécuter quand même). Pour le
> supprimer, il faut un certificat de signature de code (~200-400 €/an).

## 3. Application Mac (.dmg)

Sur un **Mac** :

```bash
npm run dist:mac
```

Le fichier est généré dans `release/` :
`La Vigie-1.9.0.dmg` (ou `.dmg` pour Intel/Apple Silicon selon la machine).

L'utilisateur ouvre le .dmg et glisse **La Vigie** dans Applications.

> **Note signature (important sur Mac)** : sans identifiant Apple, macOS Gatekeeper bloque
> l'ouverture (« développeur non identifié »). Deux options :
> - **Contournement gratuit** : au premier lancement, clic droit sur l'app → Ouvrir →
>   Ouvrir. À faire une seule fois.
> - **Distribution propre** : adhérer à l'Apple Developer Program (~99 €/an), signer avec
>   un « Developer ID » et notariser l'app. Plus aucun avertissement pour le client.

## 4. Où sont stockées les données du client ?

Electron mémorise automatiquement les données (mois, exercices) dans l'espace applicatif
du système, par utilisateur. Elles **persistent** entre les ouvertures et survivent aux
mises à jour de l'app. Rien à gérer côté client.

- Windows : `%APPDATA%\La Vigie`
- Mac : `~/Library/Application Support/La Vigie`

## 5. Icônes

Elles sont dans `build/` : `icon.png` (Mac/Linux, 1024×1024) et `icon.ico` (Windows).
Pour changer le visuel, remplacer ces deux fichiers puis relancer la commande de build.

---

## Compilation automatique (GitHub Actions)

Le dépôt contient un workflow `.github/workflows/build.yml` qui compile
l'application **sur de vraies machines Windows et macOS**, dans le cloud GitHub.
C'est le seul moyen d'obtenir un vrai `.dmg` macOS et des binaires Apple Silicon.

### Lancer une compilation

**Manuellement** — onglet *Actions* du dépôt → *Compiler La Vigie* → *Run workflow*.
Les fichiers d'installation sont ensuite téléchargeables en bas de la page
d'exécution, section *Artifacts* (conservés 30 jours).

**Par version** — pousser une étiquette :

```bash
git tag v1.9.0
git push origin v1.9.0
```

Une *Release* est alors créée automatiquement avec l'installateur Windows
(`.exe`) et les fichiers macOS (`.dmg` Intel et Apple Silicon).

### Ce qui est produit

| Plateforme | Fichier | Remarque |
|---|---|---|
| Windows | `La Vigie Setup X.Y.Z.exe` | installateur classique |
| macOS Intel | `La Vigie-X.Y.Z.dmg` | glisser-déposer vers Applications |
| macOS Apple Silicon | `La Vigie-X.Y.Z-arm64.dmg` | natif M1/M2/M3/M4 |

### Limite : la signature

Sans certificat de développeur, les applications restent **non signées** :
- Windows : avertissement SmartScreen au premier lancement
  (*Informations complémentaires* → *Exécuter quand même*).
- macOS : clic droit sur l'app → *Ouvrir* au premier lancement.

Pour supprimer ces avertissements il faut un certificat de signature
(Windows ~200-400 €/an, Apple Developer ~99 €/an), à ajouter en secrets du dépôt.
