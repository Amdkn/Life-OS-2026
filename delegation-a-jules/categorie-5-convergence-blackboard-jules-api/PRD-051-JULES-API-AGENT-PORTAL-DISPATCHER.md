# PRD-051: Client Jules API & Dispatcher dans Agent Portal

## Objectif
Permettre à l'interface Agent Portal (Life OS / Agent OS) d'interagir directement avec l'API Jules (Google Labs) pour déléguer des tâches de code aux agents A1/A2 de façon autonome.

## Spécifications
- Créer src/services/jules/jules-api-client.ts avec typage strict des requêtes Jules API (createSession, listSessions, approvePlan, sendMessage).
- Composant JulesDispatcherCard.tsx dans Agent Portal affichant les quotas quotidiens, l'état des sessions et un bouton de déclenchement rapide par PRD.
- Support du mode AUTO_CREATE_PR pour automatiser l'enchaînement sans blocage humain.
- Validation obligatoire : `npm run lint` (= `tsc --noEmit` ; lint ne lance aucun test — aucun script `test` n'existe dans `package.json`, ne pas en inventer) puis `npm run build`.

## Correctif de délégation (audit 2026-09-12)

> Contrat commun : [`../CONTRAT-COMMUN.md`](../CONTRAT-COMMUN.md) (cree par le parent — lecture obligatoire avant toute execution).
### Dependances PRD
- PRD-051 est le **proprietaire du client Jules** : PRD-044, PRD-054 et PRD-055 consomment le dispatcher, jamais l'API directe.
- Le client requiert un **service local Node** qui detient la cle et proxifie l'API Jules.

### Securite (bloquant)
- **La cle API Jules ne doit JAMAIS figurer dans une variable `VITE_*` ni dans aucun code execute par le navigateur** (le bundle Vite expose tout ce qui est importe cote client). Tout appel passe par le service local ; le bundle ne transporte aucun secret.

### Quotas (mesure / suppose)
- Documentation officielle Jules (Pro) : 100 taches / 24 h glissantes, 15 taches concurrentes. L'API n'expose pas de compteur utilisateur prouve : si aucune reponse n'porte de champ de quota, l'UI affiche « quota inconnu » — **aucun chiffre de quota invente**.

### AUTO_CREATE_PR
- Pour les tâches de code couvertes par le mandat courant : `AUTO_CREATE_PR` et `requirePlanApproval: false` explicites, sans redemande humaine de convenance. Le mode reste désactivable. Nouvelle portée irréversible, merge ou déploiement : autorisation distincte ; la création d'une PR autorisée ne doit pas être reclassée arbitrairement en porte humaine.

### Idempotence
- Identité de job stable = repository/catégorie/tranche ; hash du brief enregistré comme version séparée. Une retouche de brief ne recrée jamais un job actif. Timeout après POST = UNCERTAIN, inventaire paginé et réconciliation avant toute nouvelle tentative ; le seul hash de prompt ne suffit pas.

### Criteres d'acceptation
- Positifs : lint+build ; `createSession`, `listSessions`, `approvePlan`, `sendMessage` typés strictement ; etats de session affiches depuis les reponses reelles de l'API.
- Negatifs : aucun secret cote navigateur ; pas de quota fictif ; pas de session double au rejeu ; API injoignable = UI vide/erreur explicite, jamais de donnees de demonstration.
