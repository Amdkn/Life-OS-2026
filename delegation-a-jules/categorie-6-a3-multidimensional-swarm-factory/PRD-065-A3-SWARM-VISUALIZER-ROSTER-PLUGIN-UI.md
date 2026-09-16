# PRD-065: A3 Swarm Visualizer & Roster Plugin UI

## Objectif
Créer le composant visuel de supervision des agents A3 dans Agent Portal.

## Spécifications
- Créer src/apps/portal/components/A3SwarmRosterView.tsx.
- Afficher les cartes d'agents A3 avec indicateurs visuels :
  - Rôle et Vaisseau/Escouade d'appartenance.
  - Statut live (Idle, Active, Executing MCP, Blocked).
  - Jauge de budget tokens et temps de calcul consommés.
  - Bouton de consultation des reçus d'exécution (ProofReceiptModal.tsx).
- Validation obligatoire : `npm run lint` (= `tsc --noEmit` ; lint ne lance aucun test — aucun script `test` n'existe dans `package.json`, ne pas en inventer) puis `npm run build`.

## Correctif de délégation (audit 2026-09-12)

> Contrat commun : [`../CONTRAT-COMMUN.md`](../CONTRAT-COMMUN.md) (cree par le parent — lecture obligatoire avant toute execution).
### Dependances PRD
- Lit : PRD-061 (registre competences), PRD-064 (telemetrie crons), PRD-052 (recus `action_receipts`). Consomme PRD-041 pour vaisseaux/escouades.

### Donnees reelles (bloquant)
- Statuts (Idle / Active / Executing MCP / Blocked) proviennent de l'etat reel du service (PRD-063/064). Service injoignable = banniere d'erreur explicite et statut `Unknown` — **jamais de statut simule ni de demo**. Jauge de budget tokens : valeurs mesurees ou « non mesure ».

### Criteres d'acceptation
- Positifs : lint+build ; chaque carte agent rend role + vaisseau/escouade depuis le registre ; `ProofReceiptModal.tsx` affiche un recu reel du Blackboard ; etats vide / erreur / chargement tous rendus.
- Negatifs : pas de statut invente ; pas de secret ; pas d'ecriture directe SQLite depuis React (lecture via service).

### Reprise
- Ajoutitif (`src/apps/portal/components/A3SwarmRosterView.tsx`, `ProofReceiptModal.tsx`) ; suppression = retour arriere propre, non destructif.
