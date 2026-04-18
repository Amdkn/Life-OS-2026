# Design : V0.1.1 — Architectural Overview 🧿

## Architecture du Dashboard Trinity
Le DashboardPage bascule entre 3 sous-composants basés sur un état local ou global :
- `StandardView` (L'actuel DashboardPage.tsx)
- `FocusView` (Extraction simplifiée de LD06 / GTD)
- `StrategyView` (Extraction simplifiée de LD01/LD05 / PARA/12WY)

Le HeaderMenu pilote cet état.

## Système de Deep Linking
Un hook central `useDeepLink` écouchera les événements ou les changements d'URL simulés pour :
1. Parser l'URI `aspace://`.
2. Router vers `openApp(id)` ou `setCommandCenterPage(page)`.

## Physique des Fenêtres
Le `WindowFrame.tsx` sera enrichi d'une logique de `boundary check` dans son gestionnaire de mouvement (Framer Motion ou event handlers natifs).
- Constrainte : `y >= 0`.
- Constrainte : `x` entre `-width + 50` et `viewportWidth - 50`.

## Éléments Visuels (Copper-Glass)
Mise à jour de `src/lib/glass-tokens.ts` pour inclure les nouveaux effets métalliques et de flou organique.
Utilisation de gradients `radial-gradient` pour simuler l'éclosion du scarabée lors des transitions.

> [!NOTE]
> Les schémas IndexedDB LD01-08 sont hors périmètre de ce PRD. Ils feront l'objet d'ADRs dédiés par l'A2 lors de l'exécution.
