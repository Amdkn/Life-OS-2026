# Spécifications Fonctionnelles : V0.1.1 🧿

## S-SHELL-01 : Contraintes Viewport (Tâche Zéro)
**User Story** : En tant que Commanditaire, je veux que les fenêtres ne puissent jamais sortir du haut de l'écran, afin que je ne perde jamais l'accès aux boutons de contrôle (Close, Minimize).
### Acceptance Criteria
- [ ] Le `WindowFrame` détecte sa position lors du `drag`.
- [ ] Une butée physique est appliquée en `y=0` (ou sous la TopBar).
- [ ] Les limites latérales empêchent la fenêtre de disparaître à 100% (min 50px visibles).
- [ ] TVR : ✅ Teachable | ✅ Valuable | ✅ Repeatable

## S-DASH-01 : Trinity Header Menu
**User Story** : En tant qu'utilisateur, je veux naviguer entre 3 vues distinctes du Dashboard via un menu interne, afin d'accéder rapidement au focus ou à la stratégie.
### Acceptance Criteria
- [ ] Un composant Header Menu est ajouté à droite du fil d'ariane dans DashboardPage.
- [ ] 3 Onglets : "Standard", "Focus" (GTD), "Strategy" (12WY).
- [ ] Le changement de vue est instantané (Zustand state).
- [ ] TV on : ✅ Teachable | ✅ Valuable | ✅ Repeatable

## S-CORE-01 : Deep Linking V1
**User Story** : En tant qu'orchestrateur, je veux utiliser des liens `aspace://` pour naviguer entre les apps et les vues internes.
### Acceptance Criteria
- [ ] Schéma `aspace://app/[id]` supporté pour ouvrir une fenêtre.
- [ ] Schéma `aspace://view/[page]` supporté pour changer la page du Command Center.
- [ ] TV on : ✅ Teachable | ✅ Valuable | ✅ Repeatable

## S-STYLE-01 : Archaeo-Futurist Foundation
**User Story** : En tant que créateur, je veux que l'OS utilise les codes visuels Cuivre/Laiton et Verre sablé, pour refléter l'identité Solarpunk.
### Acceptance Criteria
- [ ] Palette CSS injectée : `--copper: #b87333`, `--brass: #e1b382`.
- [ ] Bordures des fenêtres mises à jour vers un style métallique.
- [ ] Animation d'éclosion lors du changement de page Dashboard.
- [ ] TV on : ✅ Teachable | ✅ Valuable | ✅ Repeatable
