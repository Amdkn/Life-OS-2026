# ADR-FWK-018 — Structure d'Exécution V0.1.8 (Agent Portal) 🧿

**Statut**: PROPOSED
**Date**: 2026-03-16
**Proposé par**: Antigravity (A2 Architecte)
**Validé par**: Rick (A1) / Amadeus (A0)

## Contexte
Hub de communication et monitoring des agents Méta (A1/A2/A3).

## Décision : Cycle d'Exécution en 7 Phases (V0.1.8)

### Phase 1 & 2 : Nettoyage & Dette Technique
1. Étape 1 : Audit des logs d'agents polluant le terminal Antigravity.
2. Étape 2 : Suppression des pipelines d'exécution échoués.
3. Étape 3 : Correction des permissions d'exécution de scripts PowerShell.
4. Étape 4 : Nettoyage du registre des versions ADR/PRD.

### Phase 3 : Renforcement des Fondations (Agent Registry)
1. Étape 1 : Création du Store global `agents.store.ts`.
2. Étape 2 : API de logging sécurisée (Websocket ou polling local vers Gemini CLI).
3. Étape 3 : Schéma des "Active Missions".
4. Étape 4 : Isolation du domaine Méta (non public).

### Phase 4 : Renforcement des Fondations (Monitor Logic)
1. Étape 1 : Hook `useAgentMonitor` (Surveillance temps réel).
2. Étape 2 : Système d'alerte Veto (Priority override).
3. Étape 3 : Persistence de l'historique des productions architecturales.
4. Étape 4 : Sécurisation du tunnel "Mission Injector".

### Phase 5 : Nouvelles Features (Scarabée Viz)
1. Étape 1 : Composant `A0_Scarab` (Visualisation riche de l'identité système).
2. Étape 2 : Panel de suivi des missions Conductor.
3. Étape 3 : Console de logs filtrée (Beauty Logs).
4. Étape 4 : Injecteur de missions (Champ de saisie contextuel).

### Phase 6 : Nouvelles Features (Crew View)
1. Étape 1 : Pages de détail par Vaisseau (Orville, SNW, etc.).
2. Étape 2 : Deep Linking `aspace://app/agents?ship=discovery`.
3. Étape 3 : Aura lumineuse systémique réagissant au volume de calcul.
4. Étape 4 : Intégration dans l'AI Panel latérale du Command Center.

### Phase 7 : Audit, Tests & Conformité
1. Étape 1 : Test de latence des logs agents (<100ms).
2. Étape 2 : Audit de sécurité de l'injecteur de mission (No code injection).
3. Étape 3 : Test de résilience lors de la déconnexion de Gemini CLI.
4. Étape 4 : Veto Beth : Activation forcée de la barrière de sécurité si Agent A3 dérive.
