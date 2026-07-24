# Mission Control Junior

Una web app astronomica didattica, verificabile e priva di backend, per ragazzi.

## Scopo

Permettere la pianificazione di sessioni osservative amatoriali senza account. Le
coordinate non vengono inviate a servizi remoti e il diario resta nel database
locale del browser.

L'app mostra Luna e pianeti che passano geometricamente sopra l'orizzonte durante
la sessione. L'effettiva osservabilità dipende anche da cielo, meteo, inquinamento
luminoso e strumento.

## Prerequisiti

- Node.js >= 22.12
- npm

## Installazione

```bash
git clone <repository>
cd mission-control-junior
npm ci
```

## Comandi principali

- `npm run dev`: Avvia il server di sviluppo.
- `npm run build`: Compila per la produzione.
- `npm run test`: Esegue i test con Vitest.
- `npm run check`: Verifica formattazione, lint, test e build.

## Ora e coordinate

La data e l'ora sono interpretate nel fuso orario del dispositivo. Se si
inseriscono coordinate lontane, occorre verificare che il fuso del dispositivo
coincida con quello del luogo d'osservazione.

## Attenzione - Sicurezza Solare

**NON osservare MAI il Sole senza filtri solari certificati installati
correttamente e senza la supervisione di un adulto competente.**

## Pubblicazione su GitHub Pages

Il workflow `.github/workflows/deploy-pages.yml` verifica formattazione, lint,
test e build prima di pubblicare `dist`.

Nel repository GitHub:

1. aprire **Settings → Pages**;
2. scegliere **GitHub Actions** come sorgente;
3. inviare le modifiche al branch `main` oppure `master`.

La configurazione Vite calcola automaticamente il percorso base per i project
site (`/nome-repository/`) e mantiene `/` per i repository
`nomeutente.github.io`.

La pubblicazione automatica non viene eseguita durante lo sviluppo locale.

## Configurazione AGY

Se usi Google Antigravity (AGY) per lo sviluppo, consulta la configurazione suggerita in `02-istruzioni-agy-scaffolding-setup.md`.

## Licenze

Le dipendenze runtime sono `astronomy-engine` (MIT) e `idb-keyval`
(Apache-2.0). La licenza del progetto deve essere scelta dal proprietario del
repository.
