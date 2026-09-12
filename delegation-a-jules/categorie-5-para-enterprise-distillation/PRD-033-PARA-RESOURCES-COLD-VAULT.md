# PRD-033 — Coffre de Ressources Découplé (Resources Vault & SOPs)

## 1. Valeur et Remplacement
- **Origine V2 :** `03_Resources_Berman` et les SOPs opérationnelles (Marina SOPs, Ownerbooks OMK).
- **Obstacle dans Life OS :** L'onglet **RESOURCES** est vide (0 items).
- **Remplacement :** Créer la bibliothèque de ressources classifiées par type (`book`, `tool`, `template`, `sop`, `contact`) avec liaison bidirectionnelle vers les Projets Picard.

## 2. Périmètre et Implémentation
- Modélisation de l'entité `Resource` enrichie :
  - Type, URL/Path, Domaine Life Wheel, Projets associés.
- Intégration des ressources canoniques :
  - SOPs de nettoyage Marina Cleaning.
  - Ownerbook OMK Services.
  - Manifeste Summers's Verse.
  - Spécifications Plane & Linear.

## 3. Acceptation Fonctionnelle
- Recherche et filtrage dynamique dans `ResourceCard.tsx`.
- Injection d'une nouvelle ressource avec liaison immédiate à un projet.
- Tests fonctionnels exécutés : `npm run lint` et `npm run build` à 0 erreur.
