# Spécifications Fonctionnelles : V0.1.2 (PARA Business) 🧿

## S-PARA-01 : Store Isolé LD01
**User Story** : En tant que système, je veux que les données PARA soient stockées dans une base IndexedDB dédiée (LD01), afin d'éviter toute collision avec les autres frameworks.
### Acceptance Criteria
- [ ] Création du store `para` dans l'IndexedDB `aspace-ld01`.
- [ ] Schéma : `id`, `name`, `type` (project/area), `status` (active/waiting/archived), `priority`, `metadata`.

## S-PARA-02 : CRUD Projets & Areas
**User Story** : En tant qu'utilisateur, je veux créer et éditer mes Projets et mes Domaines de responsabilité.
### Acceptance Criteria
- [ ] Interface de liste avec icônes distinctes pour Projets vs Areas.
- [ ] Formulaire d'édition (Modal ou Page dédiée).
- [ ] Bouton "Archiver" avec confirmation.

## S-PARA-03 : Deep Linking PARA
**User Story** : En tant que Power User, je veux accéder directement à une Area spécifique via une URL.
### Acceptance Criteria
- [ ] Support de `aspace://app/para?view=area&id=[uuid]`.
- [ ] Ouverture automatique de l'App PARA sur le bon contexte.
