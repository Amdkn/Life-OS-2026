# PRD: V0.5.2 Le Pont d'Irrigation (Ikigai ↔ PARA)

## 1. En-tête (TVR)
*   **Faisabilité (T)** : Moyenne. Requiert un sélecteur Zustand cross-store, similairement aux ponts PARA-GTD.
*   **Valeur (V)** : Majeure. C'est l'essence du système : lier l'Idée (Ikigai) à l'Action (PARA).
*   **Réutilisabilité (R)** : La mécanique d'affichage accordéon Bottom-Up servira de modèle pour les autres frameworks.

## 2. User Stories (Phase B - L'Alignement)

*   **US-68 [Alignement Top-Down]** : "En tant que Commandant de Projet (Dans la CARTE PARA), je veux un bouton 'Align to Vision' qui me permette de choisir l'une de mes "Ikigai Visions" ou "Wheel Ambitions" existantes (depuis un simple menu), afin de donner un sens existentiel à mon projet exécutif."
*   **US-69 [Lecture Bottom-Up]** : "En tant que Watcher consultant mon Ikigai (Ikigai UI), je clique sur une vue détaillée d'une Vision. L'UI doit alors se déployer (accordéon) pour afficher la liste des projets actifs de PARA qui sont liés à cette Vision exacte."
*   **US-70 [Design Glassmorphism]** : "L'accordéon affichant les projets liés dans l'Ikigai se présente avec une UI translucide, très épurée, soulignant la relation hiérarchique sans surcharger la carte de Vision."

## 3. Garde-Fous (Anti-Patterns)
| Anti-Pattern ❌ | Décision Architectural ✅ |
| :--- | :--- |
| Dupliquer les données du projet | Le composant Ikigai lit simplement `useParaStore(s => s.projects.filter(p => p.ikigaiVisionId === id))` |
| Charger tous les projets au Boot Ikigai | Le Store Ikigai ne connaît pas le Store PARA. Seuls les Composants visuels importent les deux `useStore`. |

## 4. Fichiers Impactés
*   `stores/fw-para.store.ts` (Extension type Project)
*   `apps/para/components/ProjectCommandCard.tsx` (Boutons Alignment)
*   `apps/ikigai/components/IkigaiDetailPanel.tsx` (ou similaire, affichage accordéon)
