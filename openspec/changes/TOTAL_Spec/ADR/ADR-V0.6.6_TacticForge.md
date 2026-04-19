# ADR-V0.6.6 — La Forge Tactique (M'Benga's Console)

## 1. Contexte & Problème
La tactique est la micro-unité d'exécution du trimestre. Séparer une tactique par semaine est la base. Le prompt texte pur omettait totalement la gestion de la semaine cible.

## 2. Décisions (UI Temporelle Rapide)

### 2.1 Pas de Dropdown, des Grids.
Pour la sélection de la semaine, une série de 12 petits carrés actionnables (boutons) remplace un sélecteur déroulant lourd, ce qui permet la sélection d'un clic visuel. On appelle cela le `WeekGridSelector`.

### 2.2 Flag GTD Fantôme (Préparation V0.7)
Un boolean state `autoSendToGTD = false` est mappé sur un Toggle UI visuel. Il va être enregistré dans le payload local de la modale, mais à la validation, l'A3 doit laisser un `// TODO: API GTD V0.7` dans le controlleur d'envoi.

## 3. Conséquences & Isolation
*   Garde l'interface de création claire et ancrée dans le trimestre.
*   Prépare l'architecture conceptuelle où une "Tactique" (chapitre d'un livre) engendre des "Actions" (Écrire 500 mots, se relire).

## 4. Étapes DDD (A3)
*   **Étape A** : Coder `<TacticForgeModal />` avec un `WeekGridSelector`.
*   **Étape B** : Ajouter le toggle decoratif `Send to GTD`.
*   **Étape C** : Câbler la modale dans `TacticsBoard` ou `TwelveWeekApp` pour purger le dernier `window.prompt`.
