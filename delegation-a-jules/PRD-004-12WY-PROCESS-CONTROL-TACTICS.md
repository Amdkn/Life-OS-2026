# PRD-004 : 12WY Discipline 3 — Process Control & Tactiques Déterministes

## 1. Objectif Produit & Valeur Réelle
Le Process Control garantit que les actions de chaque journée sont exécutées sans négociation ni fatigue décisionnelle.
Chaque tactique est liée à un objectif de planning et dispose d'un statut binaire clair (Pending / Completed / Failed).

## 2. Spécifications Fonctionnelles & UI Stitch
1. **Gestionnaire de Tactiques dans `src/apps/twelve-week/pages/TacticsPage.tsx`** :
   - Vue par semaine active (`activeWeek`).
   - Case à cocher déterministe avec micro-animation néon émeraude Framer Motion.
   - Découpage par statut et priorité de domaine (priorité absolue LD01 Book supervisant Saru LD02).
2. **Liaison PARA x GTD** :
   - Possibilité d'associer une tactique à un projet PARA actif (`projectId`).
   - Déclenchement rapide d'une tâche GTD depuis la carte tactique.