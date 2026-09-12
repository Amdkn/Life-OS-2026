# PRD-065: A3 Swarm Visualizer & Roster Plugin UI

## Objectif
Créer le composant visuel de supervision des agents A3 dans Agent Portal.

## Spécifications
- Créer src/apps/portal/components/A3SwarmRosterView.tsx.
- Afficher les cartes d\'agents A3 avec indicateurs visuels :
  - Rôle et Vaisseau/Escouade d\'appartenance.
  - Statut live (Idle, Active, Executing MCP, Blocked).
  - Jauge de budget tokens et temps de calcul consommés.
  - Bouton de consultation des reçus d\'exécution (ProofReceiptModal.tsx).
- Valider avec 
pm run build et 	sc --noEmit.
