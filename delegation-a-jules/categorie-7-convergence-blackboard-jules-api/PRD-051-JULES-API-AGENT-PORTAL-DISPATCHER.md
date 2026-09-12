# PRD-051: Client Jules API & Dispatcher dans Agent Portal

## Objectif
Permettre à l\'interface Agent Portal (Life OS / Agent OS) d\'interagir directement avec l\'API Jules (Google Labs) pour déléguer des tâches de code aux agents A1/A2 de façon autonome.

## Spécifications
- Créer src/services/jules/jules-api-client.ts avec typage strict des requêtes Jules API (createSession, listSessions, pprovePlan, sendMessage).
- Composant JulesDispatcherCard.tsx dans Agent Portal affichant les quotas quotidiens, l\'état des sessions et un bouton de déclenchement rapide par PRD.
- Support du mode AUTO_CREATE_PR pour automatiser l\'enchaînement sans blocage humain.
- Valider avec 
pm run build et 	sc --noEmit.
