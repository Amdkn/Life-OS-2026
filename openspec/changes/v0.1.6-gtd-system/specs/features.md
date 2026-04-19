# Spécifications Fonctionnelles : V0.1.6 — Système GTD 🧿

## S-GTD-01 : Inbox Universelle (Capture)
**User Story** : En tant qu'utilisateur, je veux capturer toute pensée ou entropie en un clic afin de libérer mon esprit.
### Acceptance Criteria
- [ ] Champ de capture rapide (Overlay) accessible via raccourci ou bouton flottant.
- [ ] Stockage immédiat dans `aspace-ld06` (Inbox).

## S-GTD-02 : Overview Processing (Trinity Integration)
**User Story** : En tant qu'organisateur, je veux voir l'état de mon inbox dans le Dashboard "Focus" du Command Center.
### Acceptance Criteria
- [ ] Carte "Inbox Count" dans la vue Focus du Command Center.
- [ ] Liste des 5 derniers éléments capturés.
- [ ] Bouton "Clarify" ouvrant l'App GTD complète.

## S-GTD-03 : Routage des Listes (Projects/Next Actions)
**User Story** : En tant qu'exécuteur, je veux filtrer mes actions par contexte.
### Acceptance Criteria
- [ ] Page de détail pour les listes : "Next Actions", "Waiting For", "Someday".
- [ ] Routage `aspace://app/gtd?list=next`.
