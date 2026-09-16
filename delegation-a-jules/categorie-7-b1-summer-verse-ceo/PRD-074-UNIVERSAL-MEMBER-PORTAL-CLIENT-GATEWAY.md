# PRD-074: Universal Member Portal & Client Gateway

## Correctif de délégation (audit 2026-09-12)

Contrat commun : [../CONTRAT-COMMUN.md](../CONTRAT-COMMUN.md) (créé par le parent).
Dimension fonctionnelle : 7D (C7-9).

- **Dépendances PRD réelles** : PRD-071 (branding et modules par franchise) ; PRD-073 (factures parents ABC) ; consommateur : PRD-075 (vue exécutive).
- **Write_scope (chemins concrets)** : `src/apps/franchise/portal/UniversalMemberPortal.tsx` et composants du dossier (dossiers à créer), thème/logos dans `src/apps/franchise/portal/themes/`. Ne pas réécrire `src/types/profile.ts` ni `src/stores/auth.store.ts` — consommer le profil existant.
- **Critères positifs** : les 3 profils (parents ABC, adhérents RILCOT, clients Marina) rendent chacun leur liste de fonctionnalités depuis les types PRD-071 ; bascule de thème/logo déterministe par franchise ; `npm run lint` + `npm run build` à 0 erreur.
- **Critères négatifs** : pas de données parents/adhérents/clients fictives préremplies — état vide ou erreur explicite tant que les données réelles ne sont branchées ; pas de signature/achat/demande d'intervention exécutée côté navigateur sans backend (PRD-073) ; pas de copie du code des 4 codebases historiques.
- **Sécurité & isolation** : isolation stricte des données par franchise et par profil (un parent ABC ne voit jamais RILCOT) ; aucune donnée sensible (présences, factures) dans `VITE_*` ou le localStorage — persistance serveur (PRD-011/PRD-073), cache navigateur lecture seule.
- **Idempotence & persistance** : la configuration de branding est déclarative (objet franchise), pas un état mutable navigateur ; les demandes d'intervention clients sont idempotentes côté service.
- **Reprise / rollback non destructif** : app isolée enregistrée via `src/apps/agent-portal/register.ts` ou montage dédié ; rollback = retrait du dossier portal sans impact sur les apps existantes.

## Objectif
Remplacer les espaces clients eclates par un portail unifie avec branding dynamique par franchise.

## Specifications
- Creer src/apps/franchise/portal/UniversalMemberPortal.tsx.
- Support multi-profils :
  - Parents (ABC) : presences, alertes, factures.
  - Adherents (RILCOT) : votes, documents partages, agenda communaute.
  - Clients (Marina) : demandes d intervention, validation de fin de chantier.
- Bascule de theme et logo dynamique selon le contexte de franchise.
- Valider avec npm run lint (tsc --noEmit) et npm run build.