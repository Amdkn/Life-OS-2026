# PRD-015 — Agent Portal : Nexus Relation Diagram & Skill Tree Dynamique


## Correctif de délégation (audit 2026-09-12)

> Cadre général : `../CONTRAT-COMMUN.md` (arborescence `delegation-a-jules/`, à créer par le parent). En cas de conflit, le présent correctif prime sur le corps initial du PRD, qui reste préservé.

**Dépendances PRD :** PRD-011 (nœuds vivants issus du store/blackboard) ; PRD-014 (exécution de tâches mettant à jour les compétences) ; PRD-003/PRD-032 pour la sémantique des frameworks (Ikigai, Wheel, 12WY, PARA, GTD, DEAL).

**Périmètre d'écriture (write_scope) :**
- Existant (touché) : `src/apps/agent-portal/components/SkillsView.tsx`, `src/apps/agent-portal/components/RelationDiagram.tsx` (vérifiés).
- Proposé (à créer, jamais présumé existant) : aucun nouveau fichier obligatoire — modifications dans les fichiers existants uniquement

**Critères d'acceptation positifs :** graphe relationnel navigable sans plantage de rendu SVG/Canvas ; compétences validées vs en cours issues du store ; mise à jour réactive à l'exécution des tâches.

**Critères d'acceptation négatifs (doivent rester vrais) :** « Observatoire Amy » non retrouvé dans le repo au 2026-09-12 — A SOURCER avant d'intégrer un pont vers un panneau inexistant ; aucune compétence ou nœud inventé pour remplir le graphe ; aucun framework réduit à Business.

**Sécurité / isolation / idempotence / persistance :** rendu SVG/Canvas borné (limites de nœuds) pour éviter les boucles de rendu React ; le graphe ne reçoit jamais de payload arbitraire depuis un agent sans validation.

**Commandes :** `npm run lint` (exegese : `lint` = `tsc --noEmit`, verification de types — **pas un test**) et `npm run build` (`vite build`) sont obligatoires avant toute livraison. Aucun runner de test n'est declare dans `package.json` au 2026-09-12 (pas de script `test`, pas de jest/vitest) : ne presenter ni l'un ni l'autre comme des tests fonctionnels, et ne pas inventer un script de test comme deja existant.

**Reprise et rollback non destructifs :** revert des deux composants ; données de store intactes ; le graphe figé initial reste le fallback.

## 1. Valeur et Remplacement
- **Obstacle :** L'arbre de compétences (`SkillsView.tsx`) et le diagramme de relation (`RelationDiagram.tsx`) sont figés.
- **Remplacement :** Câbler le graphe sémantique dynamique reliant les 6 Frameworks (Ikigai, Wheel, 12WY, PARA, GTD, DEAL) aux compétences réelles de l'Armada.

## 2. Périmètre et Données
- Rendu interactif du Mindmap Canvas avec les nœuds vivants issus du store.
- Matrice des compétences validées vs compétences en cours d'acquisition.
- Intégration du pont vers le panneau de commande de l'Observatoire Amy.

## 3. Acceptation Fonctionnelle
- Navigation fluide dans le graphe relationnel sans plantage de rendu SVG/Canvas.
- Mise à jour réactive des compétences lors de l'exécution de tâches.
- Tests fonctionnels exécutés : `npm run lint` et `npm run build` à 0 erreur.
