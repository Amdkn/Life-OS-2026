# PRD-052: Moteur Blackboard SQLite Partagé

## Objectif
Remplacer les états mémoires volatils par une base SQLite locale déterministe (Blackboard) gérant le cycle de vie des intentions, des verrous (locks) et des preuves d\'exécution.

## Spécifications
- Schéma SQLite : tables lackboard_items, gent_locks, essel_states, ction_receipts.
- Driver d\'accès local-first (IndexedDB sous le capot dans le browser, relayé vers le bridge SQLite local).
- Gestion des verrous de concurrence pour empêcher deux agents de travailler sur le même fichier.
- Valider avec 
pm run build et 	sc --noEmit.
