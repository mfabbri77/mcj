# Mission Control Junior
## Specifica di scaffolding, ambiente e orchestrazione per Google Antigravity CLI (AGY)

**Destinatario:** agente AGY incaricato del bootstrap e della manutenzione del progetto
**Lingua di lavoro con l'utente:** italiano
**Prodotto:** web app statica HTML/CSS/JavaScript
**Toolchain:** Vite, moduli ES, npm
**Deploy:** GitHub Pages tramite GitHub Actions
**Utente principale del percorso:** ragazzo di 12 anni appassionato di astronomia, affiancato da un adulto

---

## 1. Mandato

Predisporre un repository didattico e tecnicamente solido per **Mission Control Junior**, una web app che pianifica semplici sessioni di osservazione astronomica.

Il sistema deve permettere di:

1. scegliere luogo, data, ora, durata e strumento di osservazione;
2. calcolare fase e illuminazione della Luna;
3. calcolare altezza e azimut di Sole, Luna e pianeti principali;
4. classificare gli oggetti come candidati o non candidati all'osservazione, spiegandone il motivo;
5. creare una missione ordinata;
6. salvare un diario locale;
7. visualizzare in una fase successiva una mappa del cielo semplificata;
8. pubblicare una build statica su GitHub Pages.

Il progetto deve essere comprensibile, verificabile e modificabile dal ragazzo. Non ottimizzare per la quantità di codice prodotta; ottimizzare per apprendimento, correttezza e cicli brevi di verifica.

## 2. Vincoli non negoziabili

- Usare HTML semantico, CSS e JavaScript moderno senza framework UI.
- Usare moduli ES e Vite per sviluppo e build.
- Non introdurre backend nella versione iniziale.
- Non introdurre autenticazione.
- Non usare servizi astronomici remoti per i calcoli principali.
- Non richiedere chiavi API o segreti.
- Non inviare posizione o diario a server esterni.
- Eseguire i calcoli astronomici tramite un adapter applicativo attorno ad Astronomy Engine.
- Separare calcolo, stato, persistenza e rendering.
- Non inserire logica astronomica direttamente nei gestori DOM.
- Usare dipendenze con licenza compatibile e provenienza documentata.
- Aggiungere una dipendenza solo dopo averne motivato necessità, costo e alternativa.
- Richiedere approvazione umana prima di operazioni distruttive, installazioni di sistema, pubblicazione o modifiche fuori dal workspace.
- Non dichiarare completata una funzione senza test, build e verifica manuale descritta.
- Non generare o presentare dati astronomici numerici come testo non calcolato.
- Non esporre dati personali, coordinate precise o credenziali nel repository.

## 3. Decisioni tecnologiche

### 3.1 Dipendenze applicative

| Libreria | Ruolo | Motivazione | Stato |
|---|---|---|---|
| `astronomy-engine` | Effemeridi e calcoli astronomici | Supporta browser e JavaScript; calcola posizioni, fasi, eventi, sorgere e tramontare; è progettata per accuratezza e testabilità | Obbligatoria |
| `d3` | Rendering e interazione della mappa | Fornisce selezioni, scale, proiezioni, zoom e supporto SVG/Canvas senza imporre un framework applicativo | Obbligatoria dalla fase mappa; installabile subito |
| `idb-keyval` | Persistenza locale | Wrapper minimale Promise-based per IndexedDB; evita un layer dati eccessivo | Obbligatoria dalla fase diario |

### 3.2 Dipendenze di sviluppo

| Strumento | Ruolo |
|---|---|
| `vite` | server di sviluppo e build statica |
| `vitest` | test unitari e di integrazione leggera |
| `@vitest/coverage-v8` | report di copertura |
| `eslint`, `@eslint/js`, `globals` | analisi statica JavaScript |
| `prettier` | formattazione deterministica |
| `@playwright/test` | smoke test end-to-end su browser |

### 3.3 Librerie da non adottare come base senza una spike

**D3-Celestial** può essere utile come riferimento o prototipo per una mappa stellare, ma non deve diventare automaticamente il renderer principale. Prima di adottarla verificare:

- compatibilità con l'attuale toolchain D3;
- manutenzione recente;
- dimensione dei cataloghi;
- licenze dei dati inclusi;
- accessibilità e controllo dell'interazione;
- possibilità di isolare il renderer dal resto dell'app.

La scelta predefinita è un renderer proprietario piccolo basato su D3 e su un catalogo locale curato di stelle luminose e costellazioni, con provenienza e licenza esplicite.

### 3.4 Gestione di data e ora

Per l'MVP usare `Date` e `Intl` del browser. Salvare sempre:

- istante in formato ISO UTC;
- coordinate dell'osservatore;
- fuso orario IANA usato per la presentazione;
- data e ora locali mostrate all'utente.

Non aggiungere una libreria temporale finché non emerge un requisito concreto non gestibile in modo affidabile con le API native.

## 4. Fase preliminare: ispezione e autorizzazioni

Prima di creare o modificare file:

1. leggere `AGENTS.md`, `GEMINI.md`, README e configurazioni esistenti;
2. eseguire solo comandi di ispezione non distruttivi;
3. rilevare versioni di AGY, Git, Node.js, npm e GitHub CLI;
4. verificare se la cartella è già un repository Git;
5. verificare se esistono modifiche non committate;
6. sintetizzare lo stato corrente;
7. proporre il piano di bootstrap;
8. attendere approvazione prima di installare dipendenze o sovrascrivere file esistenti.

Comandi di ispezione suggeriti:

```bash
agy --version
node --version
npm --version
git --version
git status --short --branch
gh --version
```

Non aggiornare AGY, Node.js, npm, Git o GitHub CLI senza richiesta esplicita.

## 5. Scaffolding iniziale

Quando il workspace è vuoto e il piano è approvato, creare il progetto con il template Vanilla di Vite.

```bash
npm create vite@latest mission-control-junior -- --template vanilla
cd mission-control-junior
npm install
npm install astronomy-engine d3 idb-keyval
npm install --save-dev vitest @vitest/coverage-v8 eslint @eslint/js globals prettier @playwright/test
```

L'installazione del browser Playwright può essere eseguita dopo approvazione, perché scarica binari aggiuntivi:

```bash
npx playwright install chromium
```

Se il repository esiste già nella cartella corrente, non creare una cartella annidata senza motivazione. Applicare lo scaffolding alla radice con una procedura equivalente e conservativa.

## 6. Script npm richiesti

Configurare almeno questi script in `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "check": "npm run format:check && npm run lint && npm run test && npm run build"
  }
}
```

Non inserire `test:e2e` nella catena `check` iniziale se l'ambiente non ha ancora installato Chromium. In CI aggiungerlo quando lo smoke test è stabile.

## 7. Struttura del repository

Creare una struttura coerente con la seguente. I nomi possono essere adattati solo con motivazione documentata.

```text
mission-control-junior/
├── .agents/
│   ├── agents/
│   │   ├── mission-director/
│   │   │   └── agent.md
│   │   ├── research-web/
│   │   │   └── agent.md
│   │   ├── astronomy-validator/
│   │   │   └── agent.md
│   │   ├── frontend-engineer/
│   │   │   └── agent.md
│   │   ├── qa-accessibility/
│   │   │   └── agent.md
│   │   └── learning-coach/
│   │       └── agent.md
│   ├── rules/
│   │   ├── engineering.md
│   │   ├── astronomy.md
│   │   ├── pedagogy.md
│   │   └── privacy-safety.md
│   ├── skills/
│   │   ├── plan-feature.md
│   │   ├── research-source.md
│   │   ├── verify-feature.md
│   │   └── release-pages.md
│   └── hooks.json
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy-pages.yml
├── docs/
│   ├── adr/
│   ├── research/
│   ├── learning-journal/
│   ├── architecture.md
│   └── data-sources.md
├── public/
│   ├── icons/
│   └── data/
├── src/
│   ├── app/
│   │   ├── create-app.js
│   │   ├── state.js
│   │   └── actions.js
│   ├── astronomy/
│   │   ├── astronomy-engine-adapter.js
│   │   ├── coordinates.js
│   │   ├── moon.js
│   │   ├── solar-light.js
│   │   ├── visibility.js
│   │   └── targets.js
│   ├── data/
│   │   ├── instruments.js
│   │   └── observing-tips.js
│   ├── storage/
│   │   ├── observation-store.js
│   │   └── transfer.js
│   ├── ui/
│   │   ├── components/
│   │   ├── render.js
│   │   ├── form-controller.js
│   │   └── sky-map/
│   │       ├── projection.js
│   │       ├── renderer.js
│   │       └── interaction.js
│   ├── utils/
│   │   ├── assertions.js
│   │   ├── format.js
│   │   └── result.js
│   ├── main.js
│   └── styles.css
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── fixtures/
├── AGENTS.md
├── README.md
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── playwright.config.js
├── vite.config.js
└── vitest.config.js
```

Non creare moduli vuoti solo per rispettare la struttura. Creare inizialmente soltanto i file necessari e aggiungere gli altri quando nasce il relativo comportamento.

## 8. Confini architetturali

### 8.1 Layer astronomico

`src/astronomy/` è l'unico layer autorizzato a importare direttamente `astronomy-engine`.

Esporre funzioni applicative con oggetti JavaScript semplici. Non propagare tipi o dettagli interni della libreria verso UI e storage.

Esempi di API applicative:

```js
getMoonSummary({ instant, observer })
getBodyHorizontalPosition({ body, instant, observer })
getTwilightSummary({ instant, observer })
getCandidateTargets({ instant, observer, instrument, durationMinutes })
```

Ogni funzione deve:

- validare gli ingressi;
- dichiarare unità e convenzioni;
- restituire dati serializzabili;
- non accedere al DOM;
- non leggere geolocalizzazione o storage;
- essere testabile in modo deterministico.

### 8.2 Stato applicativo

Lo stato deve avere una singola forma documentata. Esempio iniziale:

```js
{
  observer: {
    latitudeDeg: 41.9,
    longitudeDeg: 12.5,
    elevationM: 20,
    timezone: "Europe/Rome",
    source: "manual"
  },
  planInput: {
    instantUtc: "2026-08-18T19:30:00.000Z",
    durationMinutes: 45,
    instrument: "binoculars"
  },
  mission: null,
  status: "idle",
  errors: []
}
```

Non conservare oggetti `Date` nello storage. Convertirli ai confini del sistema.

### 8.3 UI

La UI deve:

- ricevere dati già calcolati;
- trasformarli in elementi semantici;
- mostrare la ragione delle classificazioni;
- usare progressive enhancement;
- funzionare senza mouse;
- rispettare `prefers-reduced-motion`;
- non usare il colore come unico segnale;
- mantenere il layout utilizzabile su schermi piccoli.

### 8.4 Persistenza

`src/storage/` è l'unico layer che importa `idb-keyval`.

L'MVP deve supportare:

- creazione, lettura, modifica ed eliminazione di osservazioni;
- schema versionato;
- export JSON esplicito;
- import JSON validato;
- cancellazione completa dei dati locali.

Non sincronizzare dati online.

### 8.5 Mappa del cielo

Il renderer deve essere separato in:

- trasformazione coordinate → coordinate di schermo;
- disegno;
- interazione;
- selezione dell'oggetto;
- accessibilità alternativa testuale.

D3 deve essere usato come toolkit, non come contenitore dello stato applicativo.

Per un catalogo iniziale limitarsi a:

- stelle sufficientemente luminose;
- linee essenziali delle costellazioni;
- nomi approvati;
- provenienza, versione e licenza documentate in `docs/data-sources.md`.

## 9. Modello dei dati

### 9.1 Osservatore

```ts
Observer = {
  latitudeDeg: number,   // [-90, 90]
  longitudeDeg: number,  // [-180, 180]
  elevationM: number,
  timezone: string,
  source: "manual" | "geolocation"
}
```

### 9.2 Input di pianificazione

```ts
PlanInput = {
  instantUtc: string,
  durationMinutes: number,
  instrument: "eyes" | "binoculars" | "small-telescope"
}
```

### 9.3 Obiettivo astronomico

```ts
TargetAssessment = {
  id: string,
  body: string,
  altitudeDeg: number,
  azimuthDeg: number,
  directionLabel: string,
  aboveHorizon: boolean,
  candidate: boolean,
  confidence: "high" | "medium" | "low",
  reasons: string[],
  warnings: string[],
  calculatedAtUtc: string
}
```

Non includere una magnitudine quando la libreria o il modello di visibilità non la forniscono in modo affidabile. Non inventare una precisione superiore a quella disponibile.

### 9.4 Osservazione

```ts
ObservationEntry = {
  id: string,
  schemaVersion: number,
  createdAtUtc: string,
  observedAtUtc: string,
  locationLabel: string,
  approximateObserver: {
    latitudeDeg: number,
    longitudeDeg: number
  },
  instrument: string,
  targetIds: string[],
  skyQuality: number | null,
  notes: string,
  drawingData: string | null
}
```

Valutare un arrotondamento delle coordinate esportate per ridurre la precisione della posizione. Il valore predefinito pubblico non deve identificare un'abitazione.

## 10. Regole di valutazione della visibilità

La funzione `candidate` non deve equivalere semplicemente a `altitudeDeg > 0`.

Per l'MVP usare criteri espliciti e prudenti, ad esempio:

- oggetto sopra l'orizzonte geometrico;
- altezza minima configurabile, inizialmente 10° o 15°;
- Sole sufficientemente sotto l'orizzonte per il tipo di oggetto;
- durata sufficiente prima del tramonto dell'oggetto;
- suggerimento coerente con lo strumento;
- avvisi separati per Luna molto luminosa, oggetto basso o crepuscolo.

Queste soglie sono decisioni di prodotto, non leggi astronomiche. Documentarle in una Architecture Decision Record e mostrare sempre le ragioni all'utente.

## 11. Casi limite obbligatori

Aggiungere test e gestione esplicita per:

- latitudine fuori intervallo;
- longitudine fuori intervallo;
- data non valida;
- fuso orario assente o non supportato;
- passaggio all'ora legale;
- osservatore vicino ai poli;
- Sole che non sorge o non tramonta nel giorno considerato;
- oggetto esattamente vicino all'orizzonte;
- evento astronomico che ricade nel giorno locale precedente o successivo;
- permesso di geolocalizzazione negato;
- API di geolocalizzazione non disponibile;
- IndexedDB non disponibile o quota esaurita;
- catalogo locale non caricato;
- JavaScript disabilitato;
- utilizzo offline dopo il primo caricamento;
- base path di GitHub Pages diverso da `/`.

## 12. Configurazione AGY nel repository

AGY scopre gli agenti di workspace in:

```text
.agents/agents/<nome-agente>/agent.md
```

Le skill di workspace risiedono in:

```text
.agents/skills/*.md
```

Le regole di progetto risiedono in:

```text
.agents/rules/*.md
```

Mantenere inoltre un `AGENTS.md` alla radice come contratto sintetico del repository.

### 12.1 `AGENTS.md`

Il file deve contenere almeno:

```markdown
# Mission Control Junior — regole operative

## Obiettivo
Costruire una web app astronomica didattica, verificabile e priva di backend.

## Metodo
1. Esplora prima di modificare.
2. Proponi un piano piccolo e verificabile.
3. Chiedi approvazione per modifiche non banali.
4. Implementa una sola responsabilità alla volta.
5. Esegui test, lint e build.
6. Mostra il diff e spiega il risultato in italiano semplice.

## Vincoli
- Calcoli astronomici solo nel layer `src/astronomy/`.
- Accesso a `astronomy-engine` solo tramite adapter.
- Nessun segreto, backend o servizio remoto.
- Nessun dato numerico astronomico inventato dal modello.
- Nessuna dipendenza nuova senza motivazione e verifica licenza.
- Nessuna operazione distruttiva senza approvazione.
- Nessun deploy senza approvazione esplicita.

## Didattica
- Il ragazzo è il direttore di missione.
- Spiega termini nuovi al primo uso.
- Chiedi al ragazzo di prevedere il risultato prima di eseguire.
- Concludi ogni funzione con un breve teach-back.
```

## 13. Agenti personalizzati

Ogni `agent.md` deve usare frontmatter YAML con almeno `name` e `description`.

### 13.1 `mission-director`

Percorso:

```text
.agents/agents/mission-director/agent.md
```

Contenuto:

```markdown
---
name: mission-director
description: Coordina il progetto, scompone le funzioni e assegna verifiche indipendenti.
---

Sei il coordinatore di Mission Control Junior.

Responsabilità:
- leggere AGENTS.md e le regole applicabili;
- trasformare richieste ampie in incrementi piccoli;
- distinguere ricerca, decisione, implementazione e verifica;
- delegare compiti indipendenti ai subagenti appropriati;
- evitare modifiche concorrenti agli stessi file;
- chiedere approvazione prima di implementazioni non banali;
- sintetizzare output, rischi, prove e decisioni aperte;
- terminare con una domanda di teach-back per il ragazzo.

Non svolgere direttamente ricerche specialistiche o validazioni scientifiche quando è disponibile l'agente dedicato.
```

### 13.2 `research-web`

```markdown
---
name: research-web
description: Cerca fonti ufficiali e primarie, registra evidenze, licenze e limiti.
---

Esegui ricerca web tracciabile.

Ordine delle fonti:
1. documentazione ufficiale;
2. repository o pubblicazione primaria;
3. standard e istituzioni scientifiche;
4. fonti secondarie autorevoli.

Per ogni risultato registra:
- domanda di ricerca;
- fonte e URL;
- data di consultazione;
- fatto supportato;
- eventuale versione;
- licenza, quando rilevante;
- limite o incertezza;
- conseguenza progettuale.

Non modificare codice salvo incarico esplicito. Non presentare inferenze come fatti.
```

### 13.3 `astronomy-validator`

```markdown
---
name: astronomy-validator
description: Verifica formule, unità, coordinate, tempi e interpretazioni astronomiche.
---

Controlla la correttezza scientifica senza assumere che il codice o il testo siano corretti.

Verifica almeno:
- istante, scala temporale e fuso;
- coordinate e convenzioni;
- gradi contro radianti;
- altezza e azimut;
- distinzione tra sopra l'orizzonte e osservabile;
- limiti dei modelli di visibilità;
- confronto con casi noti o fonti indipendenti.

Restituisci: esito, evidenze, errori, livello di gravità, test richiesti e formulazione didattica corretta.
Non modificare UI o copy non scientifico.
```

### 13.4 `frontend-engineer`

```markdown
---
name: frontend-engineer
description: Implementa UI accessibile e moduli JavaScript mantenendo i confini architetturali.
---

Implementa soltanto un piano approvato.

Regole:
- HTML semantico;
- JavaScript modulare e testabile;
- CSS mobile-first;
- nessuna logica astronomica nel DOM;
- nessun accesso diretto a storage fuori dal relativo adapter;
- gestione esplicita di loading, empty, success ed error;
- tastiera, focus visibile, etichette e contrasto;
- rispetto di reduced motion;
- diff piccolo e motivato.

Dopo le modifiche esegui i controlli concordati e riporta i risultati reali.
```

### 13.5 `qa-accessibility`

```markdown
---
name: qa-accessibility
description: Esegue review indipendente di test, regressioni, accessibilità e comportamento su GitHub Pages.
---

Esegui una verifica indipendente dall'implementatore.

Controlla:
- requisiti e criteri di accettazione;
- casi limite;
- test unitari e smoke test;
- navigazione da tastiera;
- focus e nomi accessibili;
- layout mobile;
- errori di rete o storage;
- caricamento sotto base path GitHub Pages;
- console del browser;
- assenza di dati personali e segreti.

Prima produci un rapporto ordinato per gravità. Correggi solo dopo approvazione.
```

### 13.6 `learning-coach`

```markdown
---
name: learning-coach
description: Trasforma il lavoro tecnico in comprensione verificabile per un ragazzo di 12 anni.
---

Non riscrivere il lavoro degli altri agenti.

Produci:
- spiegazione breve del problema;
- mappa input → trasformazione → output;
- massimo cinque termini nuovi, definiti;
- tre domande di comprensione;
- un piccolo esperimento manuale;
- una domanda finale: “Come lo spiegheresti con parole tue?”.

Non semplificare al punto da introdurre errori scientifici.
```

## 14. Skill AGY

Le skill sono workflow richiamabili come comandi slash. Ogni file deve avere frontmatter con `name` e `description`.

### 14.1 `plan-feature.md`

```markdown
---
name: plan-feature
description: Esplora una richiesta e produce un piano approvabile senza modificare codice.
---

1. Leggi requisiti, AGENTS.md e file pertinenti.
2. Riassumi comportamento attuale.
3. Definisci il comportamento atteso in criteri osservabili.
4. Elenca file da modificare e responsabilità.
5. Identifica ricerca e validazione scientifica necessarie.
6. Definisci test normali, limite ed errore.
7. Stima rischi e strategia di rollback.
8. Non modificare file.
9. Chiedi approvazione del piano.
```

### 14.2 `research-source.md`

```markdown
---
name: research-source
description: Produce una nota di ricerca con fonti primarie, limiti e conseguenze progettuali.
---

Crea `docs/research/YYYY-MM-DD-<tema>.md` con:
- domanda;
- conclusione provvisoria;
- fonti primarie;
- citazioni o riferimenti precisi;
- versioni e licenze;
- fatti confermati;
- punti incerti;
- decisione proposta;
- verifica futura.

Non cambiare codice.
```

### 14.3 `verify-feature.md`

```markdown
---
name: verify-feature
description: Verifica una funzione con controlli automatici, manuali, scientifici e accessibili.
---

1. Leggi criteri di accettazione e diff.
2. Esegui format check, lint, test e build.
3. Esegui i test mirati della funzione.
4. Verifica almeno un caso normale, uno limite e uno di errore.
5. Richiedi review astronomy-validator quando sono coinvolti dati astronomici.
6. Richiedi review qa-accessibility per UI o deploy.
7. Riporta comandi, risultati e problemi non risolti.
8. Non dichiarare successo se un controllo non è stato eseguito.
```

### 14.4 `release-pages.md`

```markdown
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
```

## 15. Protocollo di orchestrazione

Usare questo flusso per ogni funzione non banale.

### Fase A — Esplorazione

`mission-director`:

- legge lo stato corrente;
- identifica dipendenze e file pertinenti;
- chiarisce il comportamento osservabile;
- non modifica codice.

### Fase B — Ricerca e validazione anticipata

Avviare in parallelo solo task indipendenti:

- `research-web` per API, licenze o fonti;
- `astronomy-validator` per correttezza scientifica;
- `qa-accessibility` per rischi e casi limite.

Non avviare due agenti che modificano gli stessi file.

### Fase C — Piano

`mission-director` integra i rapporti in un piano con:

- obiettivo;
- non-obiettivi;
- file;
- API interne;
- test;
- rischi;
- rollback;
- criterio di completamento.

Richiedere approvazione umana.

### Fase D — Implementazione

`frontend-engineer` implementa soltanto il piano approvato.

L'agente deve restituire:

- file modificati;
- scelta effettuata;
- controlli eseguiti;
- risultato reale;
- eventuali scostamenti dal piano.

### Fase E — Verifica indipendente

- `astronomy-validator` verifica le parti scientifiche.
- `qa-accessibility` verifica comportamento, regressioni e accessibilità.
- L'implementatore non certifica da solo il proprio lavoro.

### Fase F — Comprensione

`learning-coach` prepara un teach-back breve. Il ragazzo deve spiegare il flusso prima della chiusura della scheda.

### Contratto di output dei subagenti

Ogni subagente deve restituire:

```text
Obiettivo ricevuto:
Attività svolte:
Evidenze:
Risultato:
Rischi o limiti:
File modificati: nessuno | elenco
Prossimo passo raccomandato:
```

## 16. Impostazioni globali AGY consigliate

Le impostazioni globali AGY non devono essere committate nel repository. Preparare per l'utente un frammento da integrare manualmente in:

```text
~/.gemini/antigravity-cli/settings.json
```

Configurazione prudente di partenza:

```json
{
  "enableTerminalSandbox": true,
  "toolPermission": "proceed-in-sandbox",
  "permissions": {
    "allow": [
      "command(git status)",
      "command(git diff)",
      "command(git log)",
      "command(npm run (lint|test|build|check|format:check))",
      "read_url(antigravity.google)",
      "read_url(github.com)",
      "read_url(vite.dev)",
      "read_url(d3js.org)",
      "read_url(vitest.dev)",
      "read_url(playwright.dev)"
    ],
    "deny": [
      "command(rm -rf)",
      "command(sudo)",
      "write_file(.git/)",
      "read_file(.env)",
      "write_file(.env)",
      "read_file(/ABSOLUTE_HOME/.ssh)",
      "write_file(/ABSOLUTE_HOME/.ssh)"
    ]
  }
}
```

Sostituire `/ABSOLUTE_HOME` con il percorso assoluto della home dell'utente prima di salvare la configurazione. Prima di proporre il frammento definitivo, verificare la sintassi contro la versione AGY installata. Le regole non esplicitamente consentite devono restare in modalità richiesta di approvazione. Non inserire una regola `ask` troppo generale che annulli le regole `allow`, perché la precedenza documentata è `deny` → `ask` → `allow`.

## 17. Hook AGY

Gli hook possono automatizzare verifiche, ma non devono produrre rumore o modifiche imprevedibili.

Creare `.agents/hooks.json` inizialmente disabilitato oppure minimale. La configurazione AGY è una mappa di hook nominati. Esempio opzionale:

```json
{
  "format-after-file-edit": {
    "enabled": false,
    "PostToolUse": [
      {
        "matcher": "write_to_file|replace_file_content|multi_replace_file_content",
        "hooks": [
          {
            "type": "command",
            "command": "npm run format",
            "timeout": 60
          }
        ]
      }
    ]
  }
}
```

Prima di abilitarlo:

- confermare i nomi degli strumenti nella versione AGY installata;
- misurare il costo di esecuzione;
- verificare che non modifichi file estranei;
- preferire una skill manuale quando l'automazione nasconde passaggi didattici.

## 18. Configurazione Vite per GitHub Pages

Il progetto deve funzionare sia in locale sia sotto il sottopercorso del repository GitHub Pages.

Usare una configurazione che derivi il nome del repository in GitHub Actions e gestisca il caso di un sito utente `<utente>.github.io`.

```js
import { defineConfig } from 'vite';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const isUserOrOrganizationSite = repositoryName.endsWith('.github.io');
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
  base:
    isGitHubActions && repositoryName && !isUserOrOrganizationSite
      ? `/${repositoryName}/`
      : '/',
});
```

Verificare che:

- nessun asset applicativo usi un URL assoluto hard-coded come `/assets/...`;
- i link interni funzionino con il base path;
- la build possa essere aperta tramite `npm run preview`;
- lo smoke test visiti il percorso corretto.

## 19. Continuous Integration

Creare `.github/workflows/ci.yml` con trigger su pull request e push ai branch di lavoro principali.

Obiettivi minimi:

1. checkout;
2. setup Node con cache npm;
3. `npm ci`;
4. `npm run format:check`;
5. `npm run lint`;
6. `npm run test`;
7. `npm run build`;
8. upload del report o degli artefatti solo se utile.

Usare una versione Node LTS corrente verificata al momento dello scaffolding. Pinning e versioni delle GitHub Actions devono essere confrontati con la documentazione ufficiale corrente; preferire commit SHA immutabili per una pipeline stabilizzata.

## 20. Deploy su GitHub Pages

Creare `.github/workflows/deploy-pages.yml` seguendo il workflow ufficiale Vite/GitHub Pages corrente.

Requisiti:

- trigger su push del branch di pubblicazione e `workflow_dispatch`;
- `permissions` minime: `contents: read`, `pages: write`, `id-token: write`;
- `concurrency` dedicata a Pages;
- build con `npm ci` e `npm run build`;
- upload della cartella `dist`;
- deploy tramite ambiente `github-pages`;
- nessun deploy da pull request non approvata;
- protezione dell'ambiente quando disponibile.

Al momento della creazione, verificare i major tag o SHA correnti delle action ufficiali. Non copiare ciecamente versioni obsolete da esempi non ufficiali.

## 21. Strategia di test

### 21.1 Test unitari

Coprire prioritariamente:

- validazione coordinate;
- conversioni e formattazione;
- adapter di Astronomy Engine;
- fase e illuminazione lunare;
- altezza e azimut;
- regole di classificazione;
- serializzazione e migrazione dello storage.

Usare fixture con istanti e località espliciti. Non usare `new Date()` non controllato nei test.

### 21.2 Test di integrazione

Verificare:

- form → stato → calcolo → rendering;
- fallback da geolocalizzazione a inserimento manuale;
- salvataggio e riapertura di un diario;
- import JSON valido e rifiuto di JSON non valido.

### 21.3 Test end-to-end

Smoke test Playwright iniziale:

1. apre la pagina;
2. inserisce coordinate, data, ora e strumento;
3. genera una missione;
4. verifica che compaiano Luna e almeno una sezione risultati;
5. salva una nota;
6. ricarica e verifica la persistenza;
7. controlla errori console.

Aggiungere test E2E solo per percorsi critici. Non duplicare ogni test unitario nel browser.

### 21.4 Confronto scientifico

Per alcune fixture stabili confrontare i risultati con:

- output documentato della libreria;
- effemeridi o fonti indipendenti autorevoli;
- tolleranze esplicite coerenti con il tipo di dato.

Documentare la fonte e la tolleranza. Evitare assert su valori arrotondati mostrati nella UI quando è possibile testare il valore numerico prima della formattazione.

## 22. Accessibilità e UX

Requisiti minimi:

- `lang="it"` nel documento;
- un solo titolo principale;
- etichette associate ai controlli;
- messaggi di errore collegati ai campi;
- focus gestito dopo calcolo o errore;
- target touch adeguati;
- ordine di tabulazione naturale;
- contrasto sufficiente;
- nessuna informazione affidata solo al colore;
- testo alternativo o tabella equivalente per la mappa;
- layout responsive;
- supporto `prefers-reduced-motion`;
- messaggi comprensibili a un ragazzo senza perdere accuratezza.

Per la bussola o l'orientamento mobile, non introdurre nella prima versione API sensori soggette a permessi e differenze tra browser. Valutarle come spike separata.

## 23. Privacy, sicurezza e licenze

- Non usare analytics nella prima versione.
- Non caricare font o script da CDN se possono essere inclusi nella build.
- Non inviare coordinate a terze parti.
- Non memorizzare coordinate precise nell'URL.
- Non includere dati di esempio riconducibili all'utente.
- Arrotondare o rimuovere coordinate negli export pubblicabili.
- Eseguire `npm audit` come informazione, non come modifica automatica indiscriminata.
- Non usare `npm audit fix --force` senza review.
- Registrare licenza e provenienza dei cataloghi astronomici.
- Conservare gli avvisi di licenza richiesti dalle dipendenze e dai dati.
- Aggiungere un avviso esplicito: non osservare il Sole senza filtri certificati e supervisione competente.

## 24. Documentazione richiesta

### `README.md`

Deve includere:

- scopo del progetto;
- screenshot o GIF solo dopo la prima UI stabile;
- prerequisiti;
- installazione;
- comandi npm;
- struttura essenziale;
- come eseguire i test;
- come pubblicare;
- privacy;
- sicurezza solare;
- licenze;
- riconoscimento del ruolo degli agenti senza attribuire loro responsabilità umana.

### `docs/architecture.md`

Deve descrivere:

- diagramma testuale dei layer;
- flusso dei dati;
- confini delle dipendenze;
- convenzioni di tempo e coordinate;
- error model;
- strategia GitHub Pages.

### Architecture Decision Records

Creare ADR solo per decisioni che hanno alternative reali, per esempio:

- Vite + vanilla JS;
- Astronomy Engine come motore;
- IndexedDB locale;
- soglie di visibilità;
- renderer D3 proprietario rispetto a D3-Celestial;
- strategia di base path GitHub Pages.

## 25. Backlog iniziale ordinato

### Epic 0 — Bootstrap

- scaffolding Vite;
- lint, format, test e build;
- AGENTS.md, agenti, regole e skill;
- CI;
- deploy Pages con pagina placeholder;
- documentazione minima.

### Epic 1 — Input osservatore

- inserimento manuale coordinate;
- validazione;
- geolocalizzazione opzionale;
- gestione permesso negato;
- fuso e formattazione.

### Epic 2 — Luna

- fase;
- illuminazione;
- posizione orizzontale;
- riassunto accessibile;
- test scientifici.

### Epic 3 — Pianeti

- posizioni;
- sopra/sotto orizzonte;
- classificazione prudente;
- ragioni e avvisi.

### Epic 4 — Missione

- ordinamento obiettivi;
- durata;
- strumento;
- schede informative;
- stato vuoto e casi senza candidati.

### Epic 5 — Diario

- CRUD locale;
- export/import;
- privacy;
- gestione errori storage.

### Epic 6 — Mappa

- catalogo curato;
- proiezione;
- rendering;
- zoom/pan;
- alternativa testuale;
- prestazioni mobile.

### Epic 7 — Hardening

- E2E;
- accessibilità;
- offline opzionale;
- performance budget;
- release 1.0.

## 26. Budget di qualità

Obiettivi iniziali, da affinare dopo misurazione:

- build senza warning applicativi rilevanti;
- zero errori console nel percorso principale;
- nessun segreto rilevato;
- test deterministici;
- first-party JavaScript ridotto e modulare;
- cataloghi caricati solo quando necessari;
- interazioni principali fluide su dispositivo mobile medio;
- nessun blocco della UI dovuto a calcoli ripetuti non necessari;
- accessibilità verificata almeno con tastiera e audit automatico, senza considerare l'audit automatico sufficiente.

Non fissare una percentuale di coverage come obiettivo isolato. Richiedere copertura elevata nei moduli di calcolo, validazione e storage; accettare copertura inferiore nel puro rendering quando compensata da test di integrazione mirati.

## 27. Disciplina Git

- Un incremento logico per commit.
- Messaggi imperativi e descrittivi.
- Nessun commit automatico senza richiesta.
- Nessun push o apertura di pull request senza approvazione.
- Prima di ogni modifica mostrare `git status`.
- Prima di ogni commit mostrare diff e controlli eseguiti.
- Non riscrivere la storia condivisa.
- Non usare `git reset --hard`, `git clean -fd` o force push senza autorizzazione esplicita e spiegazione del recupero.

## 28. Definition of Done dello scaffolding

Lo scaffolding è completato soltanto quando:

- [ ] `npm ci` completa in un clone pulito;
- [ ] `npm run check` passa;
- [ ] la pagina locale si apre con `npm run dev`;
- [ ] la build si apre con `npm run preview`;
- [ ] il progetto funziona sotto un base path non root;
- [ ] CI valida format, lint, test e build;
- [ ] il workflow Pages pubblica `dist` dopo approvazione;
- [ ] gli agenti di workspace compaiono in `/agents`;
- [ ] le skill sono disponibili come comandi slash;
- [ ] AGENTS.md e regole sono applicate;
- [ ] nessuna credenziale o coordinata personale è presente;
- [ ] dipendenze e licenze sono documentate;
- [ ] README permette a un nuovo collaboratore di avviare il progetto;
- [ ] il ragazzo sa spiegare che cosa fanno `dev`, `test`, `build` e `deploy`.

## 29. Prima richiesta da eseguire in AGY

Usare questo prompt iniziale dopo aver aperto AGY nella cartella destinata al progetto:

```text
Agisci come mission-director e applica AGENTS.md.

Obiettivo: preparare lo scaffolding di Mission Control Junior secondo
@02-istruzioni-agy-scaffolding-setup.md.

Prima di modificare file:
1. ispeziona il workspace e gli strumenti disponibili;
2. segnala conflitti con file o configurazioni esistenti;
3. verifica la documentazione ufficiale corrente di AGY, Vite, GitHub Pages,
   Astronomy Engine, D3, Vitest e Playwright;
4. proponi un piano incrementale con comandi, file, dipendenze, rischi e rollback;
5. indica quali operazioni richiedono approvazione;
6. non installare, non modificare e non pubblicare ancora nulla.

Restituisci il piano in italiano e concludi con le tre decisioni che devo prendere.
```

## 30. Fonti primarie

### Google Antigravity CLI

- Panoramica CLI: <https://antigravity.google/docs/cli/overview>
- Installazione e autenticazione: <https://antigravity.google/docs/cli/install>
- Uso e impostazioni: <https://antigravity.google/docs/cli/using>
- Agenti e subagenti: <https://antigravity.google/docs/cli/commands/agents>
- Plugin e skill: <https://antigravity.google/docs/cli/plugins>
- Permessi: <https://antigravity.google/docs/cli/permissions>
- Hook: <https://antigravity.google/docs/hooks>
- Regole e workflow: <https://antigravity.google/docs/rules-workflows>
- Buone pratiche: <https://antigravity.google/docs/cli/best-practices>

### Stack applicativo

- Astronomy Engine: <https://github.com/cosinekitty/astronomy>
- D3: <https://d3js.org/>
- idb-keyval: <https://github.com/jakearchibald/idb-keyval>
- Vite: <https://vite.dev/guide/>
- Deploy statico Vite: <https://vite.dev/guide/static-deploy.html>
- Vitest: <https://vitest.dev/guide/>
- Playwright CI: <https://playwright.dev/docs/ci-intro>
- GitHub Pages: <https://docs.github.com/pages>

---

## Principio operativo finale

AGY deve aumentare la capacità del ragazzo di progettare, verificare e comprendere. Non deve trasformare il progetto in una sequenza opaca di modifiche automatiche.

Ogni ciclo deve lasciare tre risultati:

1. un incremento funzionante;
2. prove verificabili della sua correttezza;
3. una spiegazione che il ragazzo è in grado di riformulare.
