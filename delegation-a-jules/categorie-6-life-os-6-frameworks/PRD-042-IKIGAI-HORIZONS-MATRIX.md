# PRD-042: Ikigai & Horizons Temporels (Vaisseau Orville)

## Objectif
Afficher et manipuler la matrice Ikigai (Passion, Mission, Vocation, Profession) ainsi que les 5 Horizons temporels (H1 à H90) documentés dans la doctrine Orville.

## Spécifications
- Créer src/apps/frameworks/ikigai/IkigaiMatrixView.tsx.
- Connecter les horizons H1 (1 An), H3 (3 Ans), H10 (10 Ans), H25 (25 Ans), H90 (Solarpunk / Kardashev).
- Stocker les fiches d\'alignement dans IndexedDB via le store unifié.
- Valider avec 
pm run build et 	sc --noEmit.
