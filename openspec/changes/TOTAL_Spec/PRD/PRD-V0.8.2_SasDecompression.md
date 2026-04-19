# PRD: V0.8.2 Le Sas de Décompression (Dal's Intake)

## 1. En-tête (TVR)
*   **Faisabilité (T)** : Moyenne. Impose un crosstalk (une application PARA qui appelle une fonction d'un autre store).
*   **Valeur (V)** : Majeure. C'est la boucle vertueuse de recyclage (Upcycling). L'échec d'un projet n'est pas vu comme une défaite, mais comme du carburant pour DEAL.
*   **Réutilisabilité (R)** : Interopérabilité logicielle avancée.

## 2. User Stories (Phase B)

*   **US-117 [Action d'Absorption]** : "En tant que Chantier Naval (DEAL), je dispose d'une action formelle `absorbProjectAsFriction(projectId, title)`. Cette action crée un item au stade `define` avec un badge signalant sa provenance."
*   **US-118 [PARA Dumpsite]** : "Dans l'interface 'Archives' de PARA, lorsque j'observe un projet Archivé, le bouton 'Transfer to DEAL' exécute concrètement `absorbProjectAsFriction` et notifie le commandant de la réussite du transfert."

## 3. Garde-Fous (Anti-Patterns)
| Anti-Pattern ❌ | Décision Architectural ✅ |
| :--- | :--- |
| Suppression du Projet PARA | Lors de l'absorption, PARA garde son archive intacte ! DEAL crée simplement une 'Friction' pointant vers cette archive via la clé `projectId`. |

## 4. Fichiers Impactés
*   `src/stores/fw-deal.store.ts`
*   `src/apps/para/pages/Archives.tsx` (ou le composant affichant l'archive du projet)
