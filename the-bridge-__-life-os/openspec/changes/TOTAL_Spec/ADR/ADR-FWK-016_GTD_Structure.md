# ADR-FWK-016 — Structure d'Exécution V0.1.6 (GTD System) 🧿

**Statut**: PROPOSED
**Date**: 2026-03-16
**Proposé par**: Antigravity (A2 Architecte)
**Validé par**: Rick (A1) / Amadeus (A0)

## Contexte
Mise en place du workflow GTD (LD06) : Capture, Clarification et Organisation.

## Décision : Cycle d'Exécution en 7 Phases (V0.1.6)

### Phase 1 & 2 : Nettoyage & Dette Technique
1. Étape 1 : Audit des sources de capture (Notes mobiles, fichiers texte).
2. Étape 2 : Suppression du store `temp_inbox`.
3. Étape 3 : Standardisation des formats de date ISO pour les rappels.
4. Étape 4 : Correction des doublons dans l'Inbox actuelle.

### Phase 3 : Renforcement des Fondations (LD06 DB)
1. Étape 1 : Création de `aspace-ld06` (Stores: `inbox`, `actions`, `contexts`).
2. Étape 2 : Implémentation du moteur de recherche Full-Text dans l'Inbox.
3. Étape 3 : Middleware de transformation (Inbox Item → PARA Project/Action).
4. Étape 4 : Isolation LD06.

### Phase 4 : Renforcement des Fondations (Focus Logic)
1. Étape 1 : Hook `useInbox` (Gestion de la file de capture).
2. Étape 2 : Logique de filtrage par Contexte (Lieu, Energie, Temps).
3. Étape 3 : Système de notifications GTD (Reminders persistence).
4. Étape 4 : Protection contre le dépassement de mémoire (Inbox limit).

### Phase 5 : Nouvelles Features (Capture Overlay)
1. Étape 1 : Composant `QuickCapture` (Champ global persistant).
2. Étape 2 : Vue "Focus Dashboard" ( Trinity integration CC).
3. Étape 3 : Interface de clarification (Swipe-to-process).
4. Étape 4 : Compteur de badge dynamique sur l'icône Dock GTD.

### Phase 6 : Nouvelles Features (Complex Lists)
1. Étape 1 : Navigation par listes contextuelles (Next, Waiting, Someday).
2. Étape 2 : Routage `aspace://app/gtd?view=inbox`.
3. Étape 3 : Styles de cartes GTD avec indicateurs d'entropie (Couleurs dégradées).
4. Étape 4 : Intégration du Header Menu Strategie.

### Phase 7 : Audit, Tests & Conformité
1. Étape 1 : Test de capture "Zéro Latence" (Écriture optimiste).
2. Étape 2 : Audit de transfert : Vérifier qu'un item déplacé vers PARA quitte bien LD06.
3. Étape 3 : Test de charge sur la recherche Inbox (1000 items).
4. Étape 4 : Veto Beth : Empêcher la capture si session de Méditation active.
