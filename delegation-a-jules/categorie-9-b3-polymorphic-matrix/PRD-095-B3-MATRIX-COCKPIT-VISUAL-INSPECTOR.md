# PRD-095: B3 Polymorphic Matrix Cockpit & Visual Inspector UI

## Correctif de délégation (audit 2026-09-12)

Contrat commun : [../CONTRAT-COMMUN.md](../CONTRAT-COMMUN.md) (créé par le parent).
Dimension fonctionnelle : 7D (C7-9). Terminal UI de la catégorie — visualise, n'invente pas.

- **Dépendances PRD réelles** : PRD-091 (matrice, IntelligenceLevel × DeterminismLevel — le cockpit rend ces types, il ne les redéfinit pas) ; PRD-092 (états Idle/Running/Gated des hooks et crons) ; PRD-093 (consommation token et déclencheurs des bras cognitifs) ; PRD-094 (essaims actifs à visualiser) ; intégration shell Life OS : `src/components/Desktop.tsx` et `AppDrawer.tsx` existants — consommer le mécanisme d'enregistrement existant, pas en créer un second.
- **Write_scope (chemins concrets)** : `src/components/b3-matrix/B3MatrixCockpit.tsx` et composants du dossier `src/components/b3-matrix/` (création — le dossier src/components existe) ; point d'enregistrement dans la navigation existante (édition minimale de `register.ts`/`AppDrawer.tsx`).
- **Critères positifs** : grille 2D interactive (X = degré d'intelligence, Y = degré de déterminisme) rendant les workers B3 actifs avec badges d'état ; drawer d'inspection par incarnation (source, logs, consommation token mesurée, déclencheurs) ; curseur d'arbitrage forçant une tâche vers le mode déterministe (CLI/Hook) pour économiser les tokens — ce forçage passe par PRD-091 (profil surchargé), pas une bifurcation privée du cockpit ; `npm run lint` + `npm run build` à 0 erreur.
- **Critères négatifs** : aucune incarnation fictive affichée quand aucune n'est active — grille vide + « matrice inoccupée » ; pas de télémétrie simulée ; pas de secret dans les logs rendus ; le curseur n'autorise jamais à contourner le verrou déterministe de PRD-091 (une tâche 100% déterministe reste interdite au LLM) ; pas de recréation des identités (PRD-041) ou des compétences (PRD-061).
- **Sécurité & isolation** : le drawer affiche les logs tronqués côté service (pas le contenu des I/O sensibles) ; le forçage d'arbitrage est journalisé (audit décision humaine).
- **Idempotence & persistance** : le cockpit est une projection lecture seule des états PRD-092/094 ; les décisions d'arbitrage persistées côté blackboard SQLite service (schéma PRD-011, consommation PRD-052).
- **Reprise / rollback non destructif** : retrait du composant et de son entrée de navigation ; aucune modification des stores existants.

## Objectif
Developper la vue visuelle interactive dans Life OS permettant a l operateur (Amadou Kone) et aux coordinateurs B2 de visualiser la matrice polymorphe B3, l etat de chaque incarnation (Skill, Agent, Hook, Cron, MCP, Plugin, CLI, API) et d arbitrer le curseur Intelligence vs Determinisme.

## Specifications
- Creer src/components/b3-matrix/B3MatrixCockpit.tsx :
  - Grille bidimensionnelle interactive (Axe X : Degre d Intelligence, Axe Y : Degre de Determinisme).
  - Visualisation des workers B3 actifs repartis sur la matrice avec badges d etat (Idle, Running, Gated, Complete).
  - Drawer d inspection detaille pour chaque incarnation (code source, logs, consommation token, declencheurs).
  - Curseur d arbitrage : permet de forcer une tâche vers un mode 100% deterministe (CLI/Hook) pour economiser le quota de tokens.
- Integration dans le shell et la navigation de Life OS (src/components/Desktop.tsx / AppDrawer.tsx existants).
- Valider la compilation Vite + TypeScript sans aucune erreur : npm run lint (tsc --noEmit) et npm run build.