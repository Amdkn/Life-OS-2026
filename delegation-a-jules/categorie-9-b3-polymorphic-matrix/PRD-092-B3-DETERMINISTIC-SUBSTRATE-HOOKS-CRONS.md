# PRD-092: B3 Deterministic Substrate (Hooks 5D, Crons 4D & CLI Runners)

## Correctif de délégation (audit 2026-09-12)

Contrat commun : [../CONTRAT-COMMUN.md](../CONTRAT-COMMUN.md) (créé par le parent).
Dimension fonctionnelle : 7D (C7-9). Substrat déterministe — consommé par PRD-093/094 et par les cadences de PRD-083.

- **Dépendances PRD réelles** : PRD-091 (matrice et descripteurs — les hooks/crons/CLI s'enregistrent comme incarnations, ils n'ont pas leur propre définition de rôle). Consommateurs : PRD-093 (pipeline de validation des outputs cognitifs), PRD-094 (composition d'essaims), PRD-083 (cadence hebdo via B3CronScheduler).
- **Typos réparées** : «rot rate» (corruption du texte initial) reformulé en «dégradation silencieuse / sortie corrompue» — sens supposé, à valider par le parent.
- **Write_scope (chemins concrets)** : `src/services/b3-deterministic-runtime.ts` (création), registres et schedulers dans `src/services/b3-runtime/` si besoin de découpage. Le runtime est un composant **service Node** (crons natifs, CLI, I/O disque) — pas un module React.
- **Critères positifs** : B3HookRegistry enregistre des intercepteurs synchrones pré/post-exécution et peut bloquer une exécution (retour refusé) ; B3CronScheduler gère les cadences déclarées (15m, 60s, quotidienne, weekly) avec horloge monotone et tolérance de dérive ; B3CliRunner exécute des scripts locaux sans appel réseau ; tout output d'un worker B3 cognitif passe par un hook de validation avant écriture disque ou publication API ; `npm run lint` + `npm run build` à 0 erreur.
- **Critères négatifs** : aucun cron en setInterval React (côté navigateur = mort à la fermeture d'onglet) ; pas de boucle infinie possible (budget d'itérations par hook) ; aucun hook ne contourne la règle d'arrêt B1/B2 (PRD-072/082) ; pas de fuite de données — un hook ne logue jamais le contenu des secrets.
- **Sécurité & isolation** : pipeline de sécurité : les hooks sont de niveau propriétaire (l'ordre d'enregistrement est déterministe) ; le CLI runner opère dans un répertoire de travail borné du repo, sans accès réseau ; pas d'élévation de privilège.
- **Idempotence & persistance** : crons idempotents (un déclenchement manqué est rattrapé une fois, pas N fois) ; l'état des crons/hooks persiste côté blackboard SQLite service (schéma PRD-011, consommation PRD-052).
- **Reprise / rollback non destructif** : désenregistrement d'un hook/cron = retrait de son fichier d'enregistrement, jamais d'édition du runtime en place ; rollback sans perte des traces d'exécution.

## Objectif
Standardiser l incarnation des agents B3 en composants deterministes a 100% sans cout de token (Niveau Substrat / 4D / 5D) : Hooks pre/post-execution, crons d ordonnancement et utilitaires CLI locaux.

## Specifications
- Definir l architecture dans src/services/b3-deterministic-runtime.ts :
  - B3HookRegistry : Enregistrement des intercepteurs synchrones pour empecher la degradation silencieuse, les fuites de donnees, les boucles infinies ou les depassements de budget.
  - B3CronScheduler : Gestionnaire d impulsions temporelles deterministes (cadence 15m, 60s, quotidienne, weekly) — composant service Node, jamais React.
  - B3CliRunner : Executeur natif de scripts locaux et d outils OS sans latence reseau ni appel cloud.
- Interface d integration :
  - Pipeline de securite : tout output d un worker B3 cognitif passe imperativement par un B3Hook de validation avant ecriture sur disque ou publication API.
- Typage strict sans warning, validation npm run lint (tsc --noEmit) + npm run build.