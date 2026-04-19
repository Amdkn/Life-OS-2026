# Design : V0.1.2 — PARA Execution Engine 🧿

## Architecture des Données
L'App PARA utilise `para.store.ts` (Zustand) qui agit comme proxy vers la base LD01.
Aucun autre store n'a le droit de lire ou d'écrire dans LD01 directement.

## Composants UI
- `ParaDashboard` : Vue d'ensemble (Grille de cartes).
- `ProjectEditor` : Panneau latéral d'édition riche.
- `Breadcrumbs` : Navigation dynamique `PARA > Areas > [Area Name]`.

## Intégration Command Center
La page "Strategy" du Command Center importe `ParaOverview` qui affiche le nombre de projets actifs et les priorités sans permettre l'édition (Loi du Dualisme).
