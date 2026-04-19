# PRD-V0.3.3 — Fleet Gateway & Routing

> **SDD** : SDD-V0.3 · **TVR** : ✅T · ✅V (contrôle coûts IA = souveraineté) · ✅R (template connecteur)

## User Stories

### US-24 : Connecteurs IA (Phase A)
> En tant qu'utilisateur, je configure 3 connecteurs (OpenRouter, Ollama Pro, OpenClaw) avec test de connexion.

- [ ] Champ endpoint + clé API masquée (••••) avec toggle reveal
- [ ] Bouton "Test Connection" → fetch + status indicator (●vert/●rouge)
- [ ] 3 connecteurs par défaut pré-configurés
- [ ] Clés API stockées dans localStorage chiffré (pas envoyées vers l'extérieur)

### US-25 : Table de Routage des Modèles (Phase B)
> En tant qu'utilisateur, j'assigne des modèles IA par strate d'agent avec visibilité des coûts.

- [ ] 4 strates : A3-background, A2-logic, A1-chat, A0-strategic
- [ ] Dropdown modèles par strate avec badge free/paid
- [ ] Modèles par défaut : A3=minimax-free, A2=glm-flash, A1=mistral-small, A0=codex
- [ ] Vue coût global : quels agents pèsent sur le crédit

## Anti-Patterns
| ❌ | ✅ |
|----|-----|
| Modèles hardcodés dans le code React | Stockés dans Zustand, modifiables par UI |
| Clés API en clair dans le state | Masquées dans l'UI, chiffrées localement |
