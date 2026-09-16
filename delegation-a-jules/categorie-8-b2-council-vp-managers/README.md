# Categorie 8 : Conseil des 8 VP Managers B2 (Orchestration Quotidienne, Uplink Spock & Liberation DEAL)

Ce dossier d architecture modelise la couche meso fondamentale B2 (Les 8 VP Managers de Domaines).
Il assure l articulation quotidienne des projets Picard, l uplink hebdomadaire vers les Areas Spock dans les cycles 12WY, et la liberation DEAL du domaine LD01 (Business et Carriere).

Contrat commun de délégation : [../CONTRAT-COMMUN.md](../CONTRAT-COMMUN.md) (créé par le parent).
Dimension fonctionnelle : 7D (cartographie C7-9). Ordre d'exécution imposé : PRD-081 d'abord (socle types/config), puis PRD-082/083/084, enfin PRD-085 (cockpit). Ne pas recréer le contrat roster (PRD-041, cat 4) ni la compilation de compétences (PRD-061, cat 6).

---

## 1. Cartographie des 5 PRDs de la Categorie 8

| PRD | Titre & Jalon | Description & Livrables |
| :--- | :--- | :--- |
| PRD-081 | B2 Council Engine & 8 VP Managers Roster | Modele TypeScript et consensus des 8 VP (Superman, Martian Manhunter, Flash, Batman, Cyborg, Wonder Woman, Green Lantern, Aquaman). |
| PRD-082 | B2 DoD & JTBD Translation Pipeline | Pipeline deterministe convertissant les Rocks B1 en Definition of Done (DoD) et Jobs JTBD pour les A3. |
| PRD-083 | Weekly Uplink Engine (Picard to Spock Areas & 12WY) | Consolidation hebdomadaire : elevation des livrables Picard vers Spock et calcul du score 12WY (> 85%). Cadence cron côté service (PRD-092), jamais setInterval React. |
| PRD-084 | Cross-Franchise Harmonization Bus | Bus d harmonisation inter-projets partageant les innovations validees d une franchise vers les 3 autres. Proposition d'adoption, jamais d'auto-mutation. |
| PRD-085 | DEAL Liberation Engine & B2 Command Cockpit | Tableau de bord B2 dans Agent Portal visualisant les 8 jauges de domaines et le taux de liberation DEAL LD01. |

Chaque PRD porte un `## Correctif de délégation (audit 2026-09-12)` prioritaire : dépendances réelles, write_scope, critères positifs et négatifs, sécurité/idempotence/persistance, rollback non destructif.