# PRD-013 — Agent Portal : Remplacement des Mocks du Cron Registry

## 1. Valeur et Remplacement
- **Obstacle :** La vue `CronsView.tsx` affiche un tableau statique fictif (`MOCK_CRONS`, 32 crons fantômes).
- **Remplacement :** Connecter `CronsView.tsx` aux véritables tâches planifiées et aux heartbeats déterministes de Life OS et ASpace OS V3.

## 2. Périmètre et Données
- Lecture dynamique de la table des jobs réels ou du store des automatisations.
- Prise en charge des fréquences réelles (Heartbeat 15m, Circadien 24h, Revue Hebdo W13).
- Interface d'activation/désactivation de crons réels avec retour visuel d'exécution.

## 3. Acceptation Fonctionnelle
- Remplacement intégral de `MOCK_CRONS`.
- Affichage exact du statut live des tâches et du dernier pulse.
- Tests fonctionnels exécutés : `npm run lint` et `npm run build` à 0 erreur.
