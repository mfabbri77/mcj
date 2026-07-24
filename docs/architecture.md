# Architettura Mission Control Junior

## Diagramma dei Layer

```text
[ UI (Rendering, Interazione) ]  --> (React/Vue non usato, Vanilla JS)
      |
[ App State & Actions ]          --> Gestisce l'ingresso dell'utente e lo stato
      |
+-------------------+-------------------+
|                   |                   |
| [ Astronomy ]     | [ Storage ]       |
| (astronomy-engine)| (idb-keyval)      |
+-------------------+-------------------+
```

## Flusso dei Dati

1. L'utente immette coordinate e data.
2. Il layer _App_ convalida.
3. Il layer _Astronomy_ esegue i calcoli.
4. I risultati vengono formattati e passati alla _UI_.
5. (Opzionale) La sessione viene salvata tramite il layer _Storage_.

## Convenzioni

- **Tempo**: I calcoli ricevono oggetti `Date`, che rappresentano istanti
  assoluti; la UI formatta gli eventi nel fuso del dispositivo.
- **Coordinate**: Gradi decimali.
- **Fuso civile**: Gli input data/ora sono interpretati nel fuso del dispositivo
  e convertiti in istanti `Date` prima del calcolo.
- **Error Model**: Gli errori del motore astronomico vengono propagati alla UI;
  non vengono sostituiti con valori numerici fittizi.
- **Eventi**: Sorgere, tramontare e culminazione conservano data e ora complete,
  così una sessione oltre mezzanotte non perde il giorno dell'evento.
