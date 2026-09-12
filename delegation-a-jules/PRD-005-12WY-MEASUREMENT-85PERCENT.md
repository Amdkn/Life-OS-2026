# PRD-005 : 12WY Discipline 4 — Measurement & Scorecard 85% Rule

## 1. Objectif Produit & Valeur Réelle
Dans la doctrine 12WY, la mesure hebdomadaire objective est le seul juge de paix :
- La **Règle des 85%** : Atteindre 85% d'exécution des tactiques hebdomadaires garantit mathématiquement l'atteinte des objectifs de fin de cycle.
- Découplage strict entre **Lead Indicators** (efforts d'Amadou Kone) et **Lag Indicators** (résultats business / cashflow).

## 2. Spécifications Fonctionnelles & UI Stitch
1. **Composant `MeasurementScorecard.tsx`** :
   - Jauge circulaire ou linéaire en SVG Glassmorphism indiquant le % d'exécution hebdomadaire.
   - Indicateur de seuil critique : Vert si >= 85%, Jaune si 70-84%, Rouge si < 70%.
2. **Graphique de Tendance 12 Semaines** :
   - Histogramme montrant la régularité sur les semaines écoulées (W1 à W12).
   - Historique persistant dans IndexedDB (`ld01/metrics`).