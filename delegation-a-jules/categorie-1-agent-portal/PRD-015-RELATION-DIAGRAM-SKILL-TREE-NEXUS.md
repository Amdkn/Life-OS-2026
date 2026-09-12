# PRD-015 — Agent Portal : Nexus Relation Diagram & Skill Tree Dynamique

## 1. Valeur et Remplacement
- **Obstacle :** L'arbre de compétences (`SkillsView.tsx`) et le diagramme de relation (`RelationDiagram.tsx`) sont figés.
- **Remplacement :** Câbler le graphe sémantique dynamique reliant les 6 Frameworks (Ikigai, Wheel, 12WY, PARA, GTD, DEAL) aux compétences réelles de l'Armada.

## 2. Périmètre et Données
- Rendu interactif du Mindmap Canvas avec les nœuds vivants issus du store.
- Matrice des compétences validées vs compétences en cours d'acquisition.
- Intégration du pont vers le panneau de commande de l'Observatoire Amy.

## 3. Acceptation Fonctionnelle
- Navigation fluide dans le graphe relationnel sans plantage de rendu SVG/Canvas.
- Mise à jour réactive des compétences lors de l'exécution de tâches.
- Tests fonctionnels exécutés : `npm run lint` et `npm run build` à 0 erreur.
