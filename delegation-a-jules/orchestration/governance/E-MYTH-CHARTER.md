# E-MYTH-CHARTER — gouvernance pôle 0 (fondations) et pôle 1 (delivery)

> Portée : programme de délégation `delegation-a-jules/`. Prime sur les habitudes,
> s'applique dans le cadre du [CONTRAT-COMMUN](../../CONTRAT-COMMUN.md) et du
> [mandat complémentaire](../../EM%20YTH-MANDAT-COMPLEMENT.md).

## 1. Vision — la valeur produite, pas l'activité

La vision se mesure en **valeur produite** : une tranche `integrated` (PR relue,
tests rejoués, intégrée sur branche de revue), un socle utilisable, une PR
acceptable. Une session ouverte, un cron qui tourne, un rapport écrit ne sont
pas de la valeur. Le plafond de 15 sessions concurrentes est un plafond, pas un
objectif de remplissage : zéro tâche de remplissage, zéro appel LLM à vide.

**Objectifs affichés NON garantis** : les 55 PRD en 24h et un quota Astra
inférieur à 25 % sont des objectifs avec mesure et mécanisme d'arrêt — jamais
des garanties fabriquées. Le quota exact n'est pas observable : l'effet de
`sendMessage` sur le comptage tarifaire n'est pas observable dans l'API
consultée ; le compte réel reste `UNKNOWN`.

## 2. Deux pôles

- **Pôle 0 — fondations** : les 55 PRD des catégories 0 à 9 (registre
  `work-items.json`). Trois catégories actives au maximum, tranches testables
  avec scope exclusif, prérequis intégrés avant consommation.
- **Pôle 1 — delivery** : sites web utilisables, agents avec consommateur réel,
  vidéos livrées. Statut actuel : `WAITING_USER_INPUT` — voir
  [POLE1-HANDOVER.md](POLE1-HANDOVER.md). Les quatre franchises (ABC, RILCOT,
  Alikaly, Marina) sont du contexte d'orientation, pas des exigences produit ni
  une autorisation de déployer. Aucun codage Pôle 1 avant validation des
  fondations nécessaires.

## 3. Rôles (E-Myth, une gouvernance persistante — pas une collection de crons)

| Rôle | Titre | Autorité |
|---|---|---|
| Amadou (`amdkn`) | vision / arbitrage | actes irréversibles uniquement : CA racine, push divergent, virement, suppression de données, promotion machine→humain |
| Astra | directeur général **par exception** | débloque, arbitre les conflits, arrête à l'horizon ; n'agit que sur exception documentée |
| Gatekeeper | directeur des opérations | valide chaque prompt **avant envoi** et contrôle **après livraison** ; le suivi après livraison ne remplace jamais la validation préalable ; le maker n'approuve pas son propre prompt |
| Managers GLM (a, b, c) | managers de prompts | gèrent files, sessions et briefs de tranche ; ne codent pas |
| Sessions Jules | techniciens réutilisables | session COMPLETED = candidate à réutilisation via `sendMessage`, jamais recréée, jamais validée automatiquement |

Chaîne : maker ≠ reviewer ≠ integrated. Le gatekeeper contrôle les workers
indépendamment de la chaîne de production. Seul Astra traite les exceptions ;
l'opérationnel courant reste scripté.

## 4. Les horloges — distinctes, jamais des démons concurrents

Cadences **scripts event-driven, sans LLM vide** : les crons surveillent les
événements, reprises et santé ; la respiration scriptée prend le relais entre
contrôles. Aucun appel LLM chaque minute.

| Horloge | Cadence | Portée |
|---|---|---|
| Surveillance workers | 1 → 5 → 15 min, régression sur erreur | santé, reprises, événements |
| Prompts | 10 min | uniquement si un nouveau besoin réel est détecté |
| Inventaire | 15 min | sessions, tranches, états |
| Astra | 5 → 15 → 30 → 60 min après 4 contrôles utiles | exceptions, arbitrage, arrêt |

**Horloge temporelle métier : UTC** (source V3) ; fenêtres et constantes UTC
ISO-8601, timezone d'affichage explicite. Ne pas ajouter de watchdog redondant :
le ticker existant tourne via un autre hôte (observation directe : fichiers
`cron/ticker_heartbeat` et `ticker_last_success` actualisés alors que le CLI
gateway/status local ne signale aucun processus).

## 5. Budget et horizon

- **Horizon initial : 24h**, puis arrêt propre et revue. Queue vide = zéro
  création ; restart n'annule pas un stop opérateur.
- **Budget OpenRouter local configurable** : prix de référence courant demandé à
  l'API parent — **input 0.15 USD/M, output 0.50 USD/M**. Le prix réel reste à
  confirmer à l'API (mesuré ≠ supposé) ; aucune dépense hors budget configuré.
- **Notifications compactes uniquement** : états changés, erreurs, PR
  réellement publiées. Pas de rapport d'activité de remplissage.

## 6. Interdits permanents

Merge, push sur main, release, déploiement de production, suppression de
données, opération financière, promotion machine→humain (seule porte :
Amadou). Le maker n'approuve jamais son propre prompt ou livrable. Aucune
lecture de `.env`, aucun secret dans un prompt, aucun corpus privé transmis —
une source absente est `BLOCKED_SOURCE`, pas une autorisation d'exfiltration.

## 7. Ce que ce manifeste ne crée pas

Aucun service ne démarre par sa seule présence ici. Les cadences sont des
spécifications pour les scripts de l'orchestration ; les crons existants ne
sont ni redondés ni redémarrés à l'aveugle (ticker sur autre hôte). Les
annonces Gemini de création OKF/DOX sont un rapport fourni par l'utilisateur,
pas des écritures vérifiées par ce programme.