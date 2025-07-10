# Architecture-logiciel

## Cahier des charges
[Cliquez-ici!](https://docs.google.com/document/d/1gdwkdThpkCi1ZXG9QqkaEaIxPizKNNRiBywSvALS1no/edit?tab=t.0)

## Lancement du projet

### Prérequis
- Node.js
- npm

### Installation
```bash
npm install
```

### Lancer uniquement le serveur WebSocket (Node.js)
```bash
npm run start:node
```

### Lancer uniquement l'UI navigateur (Webpack)
```bash
npm run start:browser
```

### Lancer les deux en même temps
```bash
npm run dev
```

- Le serveur WebSocket écoute sur ws://localhost:8080
- L'UI est accessible sur http://localhost:9000 (par défaut)
