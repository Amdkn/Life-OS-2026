# Délégation Jules — catégories 0 à 9

Lire [l'audit](AUDIT-ET-ORCHESTRATION.md), puis le [contrat commun](CONTRAT-COMMUN.md). Les correctifs explicites priment sur les formulations historiques incompatibles.

## Inventaire

| Catégorie | Domaine |
|---|---|
| 0 | 12WY et focus SNW |
| 1 | Agent Portal et blackboard |
| 2 | Business Bridge, CLI et MCP |
| 3 | Distillation PARA |
| 4 | Six frameworks Life OS |
| 5 | Convergence et API Jules |
| 6 | Factory A3 |
| 7 | Franchises B1 |
| 8 | Conseil B2 |
| 9 | Matrice B3 |

L'identifiant historique PRD-001 est porté par `categorie-0-12wy-snw/PRD-12WY-SQLITE-GLASSMORPHISM.md` ; ne pas le renommer ni créer un doublon.

## Validation et bundles

Depuis la racine du dépôt :

```bash
python delegation-a-jules/scripts/validate_briefs.py --self-test
python delegation-a-jules/scripts/validate_briefs.py
python delegation-a-jules/scripts/test_dispatch_batches.py
python delegation-a-jules/scripts/dispatch_batches.py
npm run lint
npm run build
```

Le générateur prépare les dix bundles complets et leur manifeste dans `lots/`. Il ne crée aucune session sans l'option explicite `--submit`. Le validateur prouve la structure documentaire, pas l'implémentation des PRD. `lint` vérifie TypeScript ; ce n'est pas une suite de tests métier.

## Admission

Trois catégories actives au maximum ; une tranche testable par session avec scope exclusif. Le contexte contient tous les PRD de la catégorie, mais une dépendance absente ne se remplace pas par un mock en production. Une catégorie bloquée ne doit pas retenir indéfiniment un slot.

La session PRD-003 existante doit être réconciliée avant tout nouveau mandat catégorie 0. Le dispatcher initial est volontairement limité aux tranches racines ; l'admission générale et les reçus d'intégration sont spécifiés dans PRD-056. Aucun merge, push main ou déploiement automatique.
