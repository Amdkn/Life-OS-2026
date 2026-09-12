# PRD-003 — Historique distinct du plan actif

## Valeur et remplacement
Obstacle : faux engagements préremplis. Remplacer les sept objectifs codés en dur et les alias inventés par un import explicite, traçable et idempotent des cartes historiques de `vue.html`.

## Périmètre et données
Réutiliser `src/apps/twelve-week/components/GoalCommandCard.tsx`, `GoalForgeModal.tsx` et le store 12WY existant. Ne pas recréer les cartes.
Ne pas inventer OBJ-01..07. Préserver tout identifiant réellement disponible dans la source ; pour une carte sans identifiant, créer un identifiant technique d'import stable explicitement non canonique, lié à son repère de source. Ne pas confondre les IDs de référence des actions hebdomadaires avec ceux des cartes.
Importer en espace historique séparé du plan actif, sans duplication au second import. Conserver titre, provenance, statut et liens proposés. Une sélection utilisateur explicite seule crée un engagement courant ; elle n'est pas une certification humaine du canon.
L'ancien sprint qui exigeait huit jauges vertes reste une citation historique, jamais une condition de succès. Pour une revue courante : faits sourcés, besoins, maintenir/avancer/reporter ; santé inconnue ne bloque pas mécaniquement l'économie et ne devient pas verte.
Conserver la contradiction W4/W13. Dates de cycle choisies explicitement ; aucune activation ou antidatation automatique de septembre 2026. W1-W12 et buffer W13 sont relatifs au cycle sélectionné. Filtrer LD01-LD08 sans réduire Life OS à Business.

## Acceptation fonctionnelle
Importer deux fois sans doublon ; aucun objectif actif à l'import seul. Sélectionner un objectif, recharger et retrouver le même engagement. Historique intact après édition du plan. Tester conflit calendrier, source manquante et filtres vides ; aucun statut ratifié créé par le code.

## Contrat de livraison
Bénéficiaire : Amadou, utilisateur de Life OS. Priorité : engagement Life OS courant, jamais un plancher de workers. Aucun lancement Jules, push, merge, déploiement ou signature humaine autorisé par ce document seul.
Les données historiques restent historiques ; les propositions restent proposées. Inconnu = null / A SOURCER, jamais une jauge verte fabriquée. Aucun secret ni corpus privé supplémentaire à publier.
Avant modification, lire les implémentations citées et leurs consommateurs. Livrer une PR bornée avec fichiers changés, résultat utilisateur avant/après, commandes et sorties réelles, risques et retour arrière. Exécuter `npm run lint` et `npm run build` ; ces commandes ne remplacent pas les tests fonctionnels ci-dessous. Aucun test applicatif n'a été exécuté lors de la rédaction de ce brief.
