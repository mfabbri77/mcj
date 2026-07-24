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
