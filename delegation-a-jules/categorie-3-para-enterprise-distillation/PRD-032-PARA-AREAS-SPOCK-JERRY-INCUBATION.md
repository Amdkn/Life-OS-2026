# PRD-032 — Intégration des Domaines d'Action (Areas Spock & Jerry Pulse)

## 1. Valeur et Remplacement
- **Origine V2 :** `02_Areas_Spock` (J01 Jerry Prime LD01, J02 Jerry Bio LD03/04, J03 Jerry Nexus LD02/06, J04 Jerry Solarpunk LD05/07/08).
- **Obstacle dans Life OS :** L'onglet **AREAS** (`AreasView` / `DomainCard.tsx`) n'a pas de liens vivants vers les capitaines B1 Jerry et leurs standards (FIP Standard, E-Myth, Vitality).
- **Remplacement :** Relier chaque Area de Life OS à son escadre Jerry canonique et afficher les métriques de responsabilité et de veille.

## 2. Périmètre et Implémentation
- Structuration des 8 Areas dans `fw-para.store.ts` :
  - Business (J01 Prime / E-Myth SYSTEMIZE).
  - Finance & Habitat (J03 Nexus / FIP Standard).
  - Health & Cognition (J02 Bio / Vitalité & Nutrition).
  - Relations, Creativity, Impact (J04 Solarpunk / Sunday Uplink).
- Affichage des projets rattachés par pilier dans `DomainCard.tsx`.

## 3. Acceptation Fonctionnelle
- Filtrage interactif par Area et par domaine sans carte orpheline.
- Tests fonctionnels exécutés : `npm run lint` et `npm run build` à 0 erreur.
