# PRD: V0.7.3 OmniCapture (La Modale de Chaos)

## 1. En-tête (TVR)
*   **Faisabilité (T)** : Moyenne. Requiert un EventListener global sur `window` pour tracker un raccourci clavier.
*   **Valeur (V)** : Ultime. C'est l'essence du GTD ("Mind Like Water"). Pouvoir vider son cerveau en 1 seconde sans perdre le focus sur son travail actuel.
*   **Réutilisabilité (R)** : Modèle de modale globale persistante.

## 2. User Stories (Phase C)

*   **US-108 [Commandement Global]** : "En appuyant sur `Ctrl+Space` (ou `Cmd+K`) n'importe où dans le vaisseau (que je sois dans l'Ikigai, PARA ou 12WY), une modale translucide `<OmniCaptureModal>` s'ouvre au centre de mon écran avec un focus immédiat sur un champ texte."
*   **US-109 [Fire & Forget]** : "Je tape mon idée ('Acheter le Warp Core') et j'appuie sur `Entrée`. La modale disparaît immédiatement et un toast 'Captured' s'affiche. La tâche est injectée dans le store GTD avec le statut `inbox`."
*   **US-110 [Bouton UI de secours]** : "Pour une utilisation sans clavier, il existe un bouton global 'Capture' dans le header de l'OS (à côté de Command Center) qui déclenche cette même modale."

## 3. Garde-Fous (Anti-Patterns)
| Anti-Pattern ❌ | Décision Architectural ✅ |
| :--- | :--- |
| Naviguer vers l'App GTD pour capturer | Interdiction de changer de route. La modale s'ouvre en superposition (Overlay `z-[999]`) sur la vue courante. |
| Demander le Projet ou Goal à la capture | "Capture" = Chaos. On ne classe pas ici. Le seul champ est le texte de l'idée. |

## 4. Fichiers Impactés
*   `src/components/OmniCaptureModal.tsx` (NOUVEAU - Racine UI de l'OS)
*   `src/App.tsx` (ou le layout global pour enregistrer le raccourci et injecter la modale)
