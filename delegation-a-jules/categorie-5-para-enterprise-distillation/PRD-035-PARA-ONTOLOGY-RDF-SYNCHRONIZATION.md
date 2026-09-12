# PRD-035 — Synchronisation Bidirectionnelle PARA <=> Ontologie RDF Graham

## 1. Valeur et Remplacement
- **Origine V3 :** `70_Onthologies/sujets/01_Projects_Picard.ttl` (938 documents) et `02_Areas_Spock.ttl` (263 documents).
- **Obstacle dans Life OS :** L'interface UI de Life OS ignore les triplets RDF de l'ontologie de Graham et vice versa.
- **Remplacement :** Mettre en place la passerelle d'export/sync entre le store `fw-para.store.ts` et le graphe RDF (`aspace:Document`, `aspace:covers`, `aspace:partOf`).

## 2. Périmètre et Implémentation
- Exportateur JSON-LD / Turtle des projets et areas actifs.
- Vérification de cohérence avec `onto_gate.py`.
- Intégration de la télémétrie de synchronisation dans le header PARA.

## 3. Acceptation Fonctionnelle
- Export propre de l'état PARA au format Turtle validé par Graham.
- Zéro régression TypeScript (`npm run build` à 0 erreur).
