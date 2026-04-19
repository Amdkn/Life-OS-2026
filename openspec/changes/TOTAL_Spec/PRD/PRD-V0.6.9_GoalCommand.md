# PRD: V0.6.9 Goal Central Command (La Salle Tactique)

## 1. En-tête (TVR)
*   **Faisabilité (T)** : Modérée-Complexe. Réclame l'importation de read-states de `fw-para` et un espace creux assumé pour le futur GTD.
*   **Valeur (V)** : L'interface ultime de productivité trimestrielle. Le pont entre la stratégie (Trimestre) et la matière (Tâche / Code / Asset).
*   **Réutilisabilité (R)** : Le composant servira de plaque tournante.

## 2. User Stories (Phase C)

*   **US-98 [Ouverture Salle Tactique]** : "En cliquant sur un Goal Trimestriel de mon 12WY, la maestria se révèle : une `<GoalCommandCard>` monumentale s'ouvre."
*   **US-99 [NexusPARA & Forge (Read-Only)]** : "Une zone latérale (ou supérieure) nommée 'Execution Bridge' utilise Zustand pour trouver et afficher les "Cards" en miniature des Projets PARA liés (`projectId`). Elle affiche aussi des icônes pour les éventuelles 'Ressources' (The Forge) que PARA stocke dans ce projet."
*   **US-100 [Tactics Board]** : "Au centre, je dispose de mon échiquier d'exécution : la liste de mes Tactiques (`WyTactics`) liées à ce Goal, triées par `week` (1 à 12)."
*   **US-101 [GTD Placeholder]** : "Une section fantôme grisée nommée *Immediate Actions (GTD Inbox)* est présente visuellement. Elle affiche fièrement 'AWAITING V0.7 NEURAL LINK', préparant mon cerveau à l'itération suivante de l'A'Space OS."

## 3. Garde-Fous (Anti-Patterns)
| Anti-Pattern ❌ | Décision Architectural ✅ |
| :--- | :--- |
| Pouvoir éditer un projet PARA depuis le 12WY | Le 12WY n'a autorité QUE pour observer (Read-Only) les systèmes PARA. Si le Commandant veut agir sur le projet, il y a un bouton *['Go to PARA Project']* sur la miniature de la Card qui ferme la Modale et change l'URL/Tab vers `apps/para`. |

## 4. Fichiers Impactés
*   `apps/twelve-week/components/GoalCommandCard.tsx` (NOUVEAU - Hub d'exécution)
*   `apps/twelve-week/pages/GoalTable.tsx` (Lien de déclenchement)
