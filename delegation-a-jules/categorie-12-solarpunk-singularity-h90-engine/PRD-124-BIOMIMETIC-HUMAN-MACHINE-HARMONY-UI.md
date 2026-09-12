# PRD-124: Biomimetic Dashboard & Human-Machine Homeostasis UI

## Correctif de délégation (audit Astra / Hermes 2026-09-12)

Contrat commun : [../CONTRAT-COMMUN.md](../CONTRAT-COMMUN.md) (créé par le parent).
Dimension fonctionnelle : 7D (C10-12) / Élévation Civilisationnelle & H90 Legacy. **PRD de spécification rigoureuse et implémentation modulaire**.

- **Dépendances PRD réelles** : Socle de la série Série 120 ; dépendances croisées explicitées. Conforme aux 12 principes opératoires Astra (A01-A12).
- **Write_scope (chemins concrets)** : `src/types/biomimetic-ui.ts` (création/mise à jour), `src/components/biomimetic/HomeostasisDashboard.tsx` (création).
- **Critères positifs** : Typage TypeScript strict (`tsc --noEmit` à 0 erreur), conformité locale-first déterministe, gestion des erreurs avec circuit-breakers, zéro mock en production.
- **Critères négatifs** : Aucun token gaspillé en requêtes redondantes, interdiction des boucles d'attente passives, respect absolu du goulot d'étranglement LD01 Book et du veto F5 (signature humaine non usurpée).
- **Sécurité & isolation** : Cloisonnement strict des I/O, validation des entrées/sorties par schémas, persistance append-only vérifiée.
- **Idempotence & persistance** : Toute action doit être rejouable sans corruption d'état, persistance SQLite WAL ou IndexedDB documentée.
- **Reprise / rollback non destructif** : Composants modulaires isolés évitant tout effet de bord sur le boot de l'application ou l'UI existante.

## Objectif
Composants d'interface biomimétique reflétant l'équilibre homéostatique de l'opérateur (énergie mentale, sommeil, focus).

## Spécifications
- Créer `src/types/biomimetic-ui.ts` avec les interfaces et types TypeScript fondamentaux.
- Implémenter le service ou composant dans `src/components/biomimetic/HomeostasisDashboard.tsx` avec logique déterministe.
- Valider la chaîne de build avec `npm run lint` et `npm run build` (0 erreur).
