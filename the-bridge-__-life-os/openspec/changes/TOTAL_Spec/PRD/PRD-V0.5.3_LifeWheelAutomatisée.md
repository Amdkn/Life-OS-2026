# PRD: V0.5.3 Life Wheel Automatisée (Le Compas de Vérité)

## 1. En-tête (TVR)
*   **Faisabilité (T)** : Complexe côté logique (Calculs ratios). Simple côté UI (SVG/CSS).
*   **Valeur (V)** : Massive. C'est le passage d'un tracker manuel à un OS véritablement autonome et télémétrique.
*   **Réutilisabilité (R)** : L'algorithme de calcul des ratios pourra évaluer d'autres entités.

## 2. User Stories (Phase C - Télémétrie)

*   **US-71 [Le Calcul de la Réalité]** : "En tant qu'Architecte Data, je veux que la fonction `calculateGlobalScore` de la Life Wheel interroge les stores PARA/GTD pour chaque domaine. Le score 'Réel' d'un domaine est calculé sur un ratio basique (ex: nb de projets complétés / total projets + santé GTD actions), supprimant la saisie manuelle de l'utilisateur."
*   **US-72 [Double Calque Radar]** : "En tant que Watcher, dans l'onglet analytique de la Life Wheel, je veux que le graphique de type radar (réalisé en CSS pur polar/barres ou SVG sans bibliothèque lourde) affiche DEUX éléments : Un polygone/jauge de mon 'Ambition' (Ce que je vise, défini via V0.5.1), et un polygone/jauge de ma 'Réalité' calculée, montrant visuellement l'écart."
*   **US-73 [Sync Découplé]** : "Le score réel doit être recalculé uniquement lors de l'accès à la Life Wheel ou avec un throttle, pour éviter de sur-solliciter le rendu."

## 3. Garde-Fous (Anti-Patterns)
| Anti-Pattern ❌ | Décision Architectural ✅ |
| :--- | :--- |
| `calculateGlobalScore` sur chaque action PARA | Ne calculer le Radar que lorsque l'App Life Wheel est montée. |
| Utiliser `chart.js` ou `Recharts` | Obligation d'utiliser du pure CSS / SVG inline pour respecter la frugalité A'Space. |

## 4. Fichiers Impactés
*   `stores/fw-wheel.store.ts` (Nouvelle logique `calculateExecutionScore`)
*   `apps/life-wheel/components/WheelRadar.tsx` (SVG/CSS UI)
*   `apps/life-wheel/pages/Dashboard.tsx`
