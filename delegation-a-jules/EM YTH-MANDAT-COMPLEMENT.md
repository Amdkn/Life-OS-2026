# Mandat directeur — complément explicite de l'utilisateur

Ce programme n'est pas une collection de cron jobs. C'est une gouvernance E-Myth persistante : Amadou vision/arbitrage ; Astra directeur général par exception ; gatekeeper directeur des opérations ; GLM managers de prompts ; sessions Jules techniciens réutilisables.

## Conditions de libération bloquantes

- Un prompt manager ne peut être envoyé à Jules avant validation du gatekeeper indépendant. Le gatekeeper vérifie scope, dépendances, droits, sources, tests et idempotence. Le maker n'approuve pas son propre prompt. Le suivi après livraison ne remplace pas cette validation préalable.
- Sessions Jules COMPLETED = ressources candidates à réutiliser via sendMessage, pas des jobs à recréer ni des livraisons automatiquement validées.
- La respiration scriptée prend le relais entre contrôles ; les crons surveillent les événements, reprises et santé, pas une obligation de gaspiller un appel LLM chaque minute.
- Les55 PRD en24h et moins de25% quota Astra sont objectifs ; mesure et mécanisme d'arrêt requis, aucune garantie fabriquée. Effet quota de sendMessage non observable dans API consultée.
- Résumés de vidéos Gemini à recevoir. Les quatre franchises mentionnées par l'utilisateur (ABC, RILCOT, Alikaly, Marina) sont contexte d'orientation Pôle1, pas autorisation de déployer ni exigences produit suffisantes.

## Observations directes

CLI gateway/status signale aucun processus, mais les fichiers cron/ticker_heartbeat et ticker_last_success sont actualisés : le ticker tourne via un autre hôte. Ne pas ajouter de watchdog redondant ni redémarrer aveuglément.

La session sessions/7587937436525114170 a accepté une continuation [POLE0-EVIDENCE-011-V1], relue dans activities/userMessaged. Aucune nouvelle session n'a été créée par cet essai. Cela démontre le canal interactif sur session terminée ; pas le comptage tarifaire.

Les annonces Gemini de création OKF/DOX sont un rapport fourni par l'utilisateur, pas des écritures vérifiées par ce programme.
