# PRD-014 — Agent Portal : ScoreCard Transversal & Télémétrie A0-A2

## 1. Valeur et Remplacement
- **Obstacle :** Déconnexion entre la ScoreCard Kanban et l'état réel des agents A0 (Amadeus), A1 (Beth+Morty) et A2 (Orville, Discovery, Enterprise).
- **Remplacement :** Rendre la télémétrie de flotte réactive dans `ScoreCard.tsx` et `AgentStats.tsx` avec les métriques réelles de progression.

## 2. Périmètre et Données
- Relier chaque tâche Kanban à son agent assigné (couche A1/A2).
- Intégrer les jauges de charge réelle, de statut (online/idle/busy) et d'historique de log d'agent.
- Éliminer les faux placeholders "Awaiting V0.7 Neural Link" dans les vues de détail.

## 3. Acceptation Fonctionnelle
- Attribution et transition réelles des tâches entre états Kanban avec notification d'agent.
- Télémétrie de l'Armada synchronisée sur le panneau latéral droit.
- Tests fonctionnels exécutés : `npm run lint` et `npm run build` à 0 erreur.
