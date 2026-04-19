# ADR-V0.8.7 — Le Pont Exécutif (Webhooks)

## 1. Contexte & Problème
Pour le moment, l'A'Space OS "regarde" la vie du Commandant. DEAL enregistre que des choses sont automatisées, mais ne les lance pas. Il faut que l'UI se dote d'un mécanisme de déclenchement d'actions réelles.

## 2. Décisions (Restful Trigger)

### 2.1 Stockage Sécurisé de l'Instruction
Ajout de la clé `webhookUrl?: string` dans l'interface `Muse`. Cette URL pointera par exemple vers une instance de *n8n* ou un webhook *Make* (`https://n8n.my-server.lan/webhook/...`).

### 2.2 Architecture Non-Bloquante de Déclenchement
Un composant `<ExecutionTrigger muse={muse} />` est créé et monté sur la carte de la Muse.
Ce composant gèrera :
1. Un état interne `isExecuting` (Loader visuel).
2. Un appel asynchrone `fetch(muse.webhookUrl, { method: 'POST' })` englobé dans un bloc `try/catch`.
3. Une lecture du Status HTTP retourné. Si 200/201 -> Succès visuel (Couleur verte momentanée). Si erreur (Timeout, 500) -> Passage en erreur (Couleur Rouge momentanée) et proposition silencieuse de passer la Muse au statut `failing`.

## 3. Conséquences & Isolation
*   Les appels API (HTTP) ne doivent **jamais** être logés dans un store Zustand (fw-deal.store). Zustand ne gère que les Data d'état de l'OS. Le store n'est pas un orchestrateur axios persistant. L'appel doit rester purement composant / événementiel.
*   Cela garde l'OS réactif sans encombrer l'Idempotence Router de logs HTTP éphémères.

## 4. Étapes DDD (A3)
*   **Étape A** : Mise à jour du composant d'édition pour configurer l'URL.
*   **Étape B** : Création du composant `<ExecutionTrigger>` encapsulant le bouton 'RUN PROTOCOL' et la logique `fetch()`.
