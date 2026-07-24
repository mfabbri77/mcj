---
name: release-pages
description: Prepara e verifica una release su GitHub Pages senza pubblicare senza approvazione.
---

1. Verifica repository, branch e working tree.
2. Esegui `npm ci` in ambiente pulito quando possibile.
3. Esegui tutti i controlli di release.
4. Verifica base path e asset relativi.
5. Verifica il workflow Pages contro la documentazione ufficiale corrente.
6. Controlla assenza di segreti e dati personali.
7. Prepara un riepilogo della release.
8. Chiedi approvazione esplicita prima di push, merge o deploy.
