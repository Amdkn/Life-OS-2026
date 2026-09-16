# Categorie 7 : B1 Summer-Verse CEO (Direction, Holding & Franchises Reproductibles)

Ce dossier d architecture represente le sommet de gouvernance B1 (Amadou Kone / Summer / Jerry).
Il resout definitivement la dispersion historique entre projets en unifiant les 4 franchises phares sous un noyau de franchise industrielle reproductible :
1. 02 ABC Child Care BOS (Normes d Etat, portail parents, encaissements)
2. 03 RILCOT Members Space OS (Cooperative, espace adherents, cotisations)
3. 04 Alikaly Bana Holding to LLC (Architecture inter-societes, tresorerie holding, baux)
4. 05 Marina Cleaning BOS & SOP (Checklists terrain, dispatch equipes, suivi qualite)

Contrat commun de délégation : [../CONTRAT-COMMUN.md](../CONTRAT-COMMUN.md) (créé par le parent).
Dimension fonctionnelle : 7D (cartographie C7-9). Ordre d'exécution imposé : PRD-071 d'abord (socle), puis PRD-072/073/074, enfin PRD-075 (agrégateur).

---

## 1. Cartographie des 5 PRDs de la Categorie 7

| PRD | Titre & Jalon | Description & Livrables |
| :--- | :--- | :--- |
| PRD-071 | Franchise Core Engine & Dynamic Instance Model | Modele de donnees unifie FranchiseInstance instanciant a chaud les 4 projets a partir du meme socle. |
| PRD-072 | B1 Handoff Queue & Decision Charter (B1->B2->B3) | Matrice de passage deterministe reliant la vision B1 aux DoD des managers B2 et aux JTBD des A3. |
| PRD-073 | Holding Treasury & Multi-Tenant Billing Engine | Moteur de facturation Stripe/ACH et grand livre de tresorerie inter-societes pour la holding Alikaly. Backend (src/server/treasury/) — jamais React. |
| PRD-074 | Universal Member Portal & Client Gateway | Architecture de portail self-service unifiee pour parents, adherents, clients et prestataires. |
| PRD-075 | B1 Summer-Verse CEO Command Cockpit | Tableau de bord supreme dans Agent Portal pour piloter les 4 franchises en 1 coup d oeil. |

Chaque PRD porte un `## Correctif de délégation (audit 2026-09-12)` prioritaire : dépendances réelles, write_scope, critères positifs et négatifs, sécurité/idempotence/persistance, rollback non destructif.