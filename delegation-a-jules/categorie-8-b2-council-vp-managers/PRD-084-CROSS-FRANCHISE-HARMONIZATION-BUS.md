# PRD-084: Cross-Franchise Harmonization Bus

## Correctif de délégation (audit 2026-09-12)

Contrat commun : [../CONTRAT-COMMUN.md](../CONTRAT-COMMUN.md) (créé par le parent).
Dimension fonctionnelle : 7D (C7-9).

- **Dépendances PRD réelles** : PRD-071 (IDs et modules des 4 franchises — le bus s'adresse à ces instances) ; PRD-081 (attribution des innovations au VP propriétaire) ; consommateur : PRD-075 (notification cockpit). À lancer après intégration de PRD-071, pas avant.
- **Write_scope (chemins concrets)** : `src/services/franchise/cross-franchise-bus.ts` (dossier à créer), types du bus dans `src/services/franchise/bus-types.ts`. Interdiction de modifier les modules des 4 franchises.
- **Critères positifs** : une innovation validée sur une franchise génère une **proposition d'adoption** pour les autres (statut proposé/adopté/refusé) ; les 3 règles déclarées (facture ABC→Marina/RILCOT, checklists Marina→ABC/RILCOT, baux Alikaly→toutes entités) sont des règles de données, pas du code copié-collé ; `npm run lint` + `npm run build` à 0 erreur.
- **Critères négatifs** : le bus ne **copie jamais** un module d'une franchise à une autre en auto-mutation — il propose, un VP B2 adopte ; pas de boucle de re-proposition (déduplication par empreinte de contenu) ; pas de synchronisation de secrets ou de clés entre franchises ; pas de données client réelles transportées entre franchises.
- **Sécurité & isolation** : cloisonnement strict — une proposition transporte la description technique, pas les données de la franchise source ; conformité : les checklists/factures transportées sont des templates, jamais des documents nominatifs.
- **Idempotence & persistance** : empreinte (hash) du module innovant comme clé d'idempotence — la même innovation validée deux fois produit une seule proposition ; propositions persistées côté blackboard SQLite service (schéma PRD-011, consommation PRD-052).
- **Reprise / rollback non destructif** : bus additif sans écriture dans les franchises ; rollback = retrait du service, propositions conservées ou supprimées sans effet de bord ailleurs.

## Objectif
Mettre en place le bus d harmonisation inter-projets permettant de retroceder automatiquement les briques innovantes developpees pour un projet vers les 3 autres.

## Specifications
- Creer src/services/franchise/cross-franchise-bus.ts.
- Regles de synchronisation :
  - Module facture valide sur ABC Child Care -> Notification et proposition d adoption sur Marina Cleaning et RILCOT.
  - Checklists terrain validees sur Marina Cleaning -> Export des templates vers ABC et RILCOT.
  - Baux et fiscalite d Alikaly Bana -> Standardisation des contrats pour l ensemble des entites.
- Valider avec npm run lint (tsc --noEmit) et npm run build.