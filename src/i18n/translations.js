/**
 * Dizionario completo per la gestione bilingue dell'applicazione (Italiano / Francese).
 * Tutte le traduzioni dell'interfaccia sono centralizzate qui!
 */
export const TRANSLATIONS = {
  it: {
    appTitle: 'Mission Control Junior',
    labelDate: "Scegli la data dell'osservazione:",
    labelTime: 'Ora osservazione (fuso del dispositivo):',
    labelDuration: 'Durata sessione:',
    labelInstrument: 'Strumento di osservazione:',
    labelLat: 'Latitudine (-90° a +90°):',
    labelLon: 'Longitudine (-180° a +180°):',
    btnReset: 'Ripristina Valori di Default',
    languageSelectorLabel: 'Seleziona lingua',
    timeZoneNote:
      "L'ora usa il fuso orario del dispositivo: per coordinate lontane, verifica che coincida con quello del luogo.",

    optEyes: '👀 Occhio nudo',
    optBinoculars: '🔭 Binocolo',
    optSmallTelescope: '🔬 Piccolo telescopio',
    durationOptions: {
      15: '15 minuti',
      30: '30 minuti',
      45: '45 minuti',
      60: '60 minuti (1 ora)',
      90: '90 minuti (1 ora e mezza)',
      120: '120 minuti (2 ore)',
    },

    summaryDate: 'Data:',
    summaryTime: 'Ora osservazione:',
    summaryDuration: 'Durata sessione:',
    summaryInstrument: 'Strumento:',
    summaryCoordinates: 'Coordinate:',
    unitMinutes: 'minuti',

    headerPlan: "🚀 Piano della Serata d'Osservazione",
    targetsAboveHorizonCount: "bersagli sopra l'orizzonte",
    emptyPlan:
      "🌌 Nessuno tra Luna e pianeti sale sopra l'orizzonte durante la sessione. Prova ad aumentare la durata o a cambiare orario!",

    sessionMaxAltitudeLabel: 'Altezza massima stimata (sessione):',
    nextTransitAltitudeLabel: 'Altezza alla prossima culminazione:',
    atTimeLabel: 'alle',
    directionLabel: 'Direzione:',
    compassLabel: 'compasso',
    risesAtLabel: 'Prossimo sorgere:',
    setsAtLabel: 'Prossimo tramonto:',
    eventUnavailable: 'non trovato entro 48 ore',
    phaseLabel: 'Fase:',
    illuminatedLabel: 'illuminata',
    moonDiagramNote: 'Schema della fase; l’orientamento nel cielo può cambiare.',
    indicationLabel: 'Indicazione:',
    instrumentAffinityLabel: 'Affinità strumento:',
    inSky: '(in cielo)',
    arriving: '(in arrivo)',

    solarWarning:
      "☀️ Attenzione: il Sole è sopra l'orizzonte durante almeno una parte della sessione. Non guardarlo mai direttamente senza filtri solari certificati e la supervisione di un adulto competente.",
    permanentSolarSafety:
      'Sicurezza solare: non osservare mai il Sole senza un filtro solare certificato montato correttamente e la supervisione di un adulto competente.',

    errors: {
      invalidDate: 'Seleziona una data reale per la missione.',
      invalidTime: 'Seleziona un orario valido per la missione.',
      invalidDuration: 'Seleziona una durata valida per la missione.',
      invalidLatitude: 'La latitudine deve essere compresa tra -90° e +90°.',
      invalidLongitude: 'La longitudine deve essere compresa tra -180° e +180°.',
      calculation: 'Non è stato possibile calcolare il piano. Controlla i dati e riprova.',
      storage: 'Il diario non è disponibile in questo browser. La nota non è stata modificata.',
    },

    logbookTitle: '📓 Diario di Bordo della Missione',
    privacyNote: '🔒 I tuoi appunti restano nel database locale di questo browser e dispositivo.',
    noteLabel: 'Nota della missione',
    placeholderNote: 'Scrivi qui i tuoi appunti o quello che hai osservato durante la missione...',
    btnSaveNote: '💾 Salva Nota nel Diario',
    btnDeleteNote: '🗑️ Elimina',
    confirmDeleteNote: 'Vuoi eliminare definitivamente questa nota?',
    noteSaved: 'Nota salvata nel browser.',
    noteDeleted: 'Nota eliminata.',
    emptyLogbook:
      'Nessuna nota salvata nel diario. Scrivi un appunto qui sopra e salva la tua prima prova!',

    directions: {
      N: 'Nord',
      NE: 'Nord-Est',
      E: 'Est',
      SE: 'Sud-Est',
      S: 'Sud',
      SW: 'Sud-Ovest',
      W: 'Ovest',
      NW: 'Nord-Ovest',
    },

    planets: {
      Moon: 'Luna',
      Mercury: 'Mercurio',
      Venus: 'Venere',
      Mars: 'Marte',
      Jupiter: 'Giove',
      Saturn: 'Saturno',
      Uranus: 'Urano',
      Neptune: 'Nettuno',
    },

    moonPhases: {
      new: 'Luna nuova',
      waxingCrescent: 'Crescente iniziale',
      firstQuarter: 'Primo quarto',
      waxingGibbous: 'Gibbosa crescente',
      full: 'Luna piena',
      waningGibbous: 'Gibbosa calante',
      thirdQuarter: 'Ultimo quarto',
      waningCrescent: 'Calante finale',
    },

    indications: {
      setsDuring:
        '⏳ Tramonta durante la sessione (alle {time}) — Osserva subito nei primi minuti!',
      risesDuring: '🌅 Sorge durante la sessione (alle {time}) — Sarà visibile verso la fine',
      rising: '📈 In salita a {dir} (visibile per tutta la sessione)',
      descending: '📉 In discesa a {dir} (visibile per tutta la sessione)',
      stable: '🌟 Stabile nel cielo a {dir} (visibile per tutta la sessione)',
    },

    instrumentAffinity: {
      Moon: {
        eyes: '🟢 Perfetto! (Luminosa e facile da vedere a occhio nudo)',
        binoculars: '🌟 Spettacolare! (Vedi mari lunari e grandi crateri)',
        'small-telescope': '🔭 Spettacolare! (Vedi dettagli nitidi di crateri e montagne)',
      },
      Venus: {
        eyes: '🟢 Perfetto! (Luminosissima come stella del mattino/sera)',
        binoculars: '🟡 Buono (Aiuta a individuarla; la fase richiede un telescopio)',
        'small-telescope': '🌟 Eccellente (La fase del pianeta diventa riconoscibile)',
      },
      Jupiter: {
        eyes: '🟢 Ottimo! (Molto luminoso a occhio nudo)',
        binoculars: '🌟 Spettacolare! (Vedi Giove ed i 4 satelliti Galileiani)',
        'small-telescope':
          '🔭 Spettacolare! (Puoi distinguere i satelliti e le principali bande atmosferiche)',
      },
      Mars: {
        eyes: '🟢 Buono (Riconoscibile per il forte colore rosso)',
        binoculars: '🟡 Discreto (Punto rosso nitido)',
        'small-telescope':
          '🌟 Buono (I dettagli dipendono da distanza, seeing e diametro dello strumento)',
      },
      Saturn: {
        eyes: '🟡 Discreto (Sembra una stella dorata)',
        binoculars:
          '🟡 Discreto (Può apparire allungato; per separare gli anelli serve un telescopio)',
        'small-telescope': '🔭 Spettacolare! (Gli anelli di Saturno sono ben definiti)',
      },
      Mercury: {
        eyes: "🟡 Difficile (Piccolo e molto vicino all'orizzonte)",
        binoculars: '🟠 Solo a Sole tramontato (Non puntare mai vicino al Sole)',
        'small-telescope': '🟠 Solo a Sole tramontato (La fase può essere riconoscibile)',
      },
      Uranus: {
        eyes: '🔴 Quasi impossibile (Troppo debole a occhio nudo)',
        binoculars: '🟡 Necessario (Si vede come un debole puntino azzurro)',
        'small-telescope': '🟢 Consigliato! (Distingui il dischetto verde-azzurro)',
      },
      Neptune: {
        eyes: '🔴 Impossibile a occhio nudo (Invisibile senza strumento)',
        binoculars: '🔴 Molto difficile (Servono cielo nerissimo e mappa stellare)',
        'small-telescope':
          '🟡 Necessario (Servono anche cielo scuro e una mappa per identificarlo)',
      },
    },
  },

  fr: {
    appTitle: 'Mission Control Junior',
    labelDate: "Choisissez la date d'observation :",
    labelTime: "Heure d'observation (fuseau de l'appareil) :",
    labelDuration: 'Durée de la session :',
    labelInstrument: "Instrument d'observation :",
    labelLat: 'Latitude (-90° à +90°) :',
    labelLon: 'Longitude (-180° à +180°) :',
    btnReset: 'Réinitialiser les valeurs par défaut',
    languageSelectorLabel: 'Choisir la langue',
    timeZoneNote:
      "L'heure utilise le fuseau de l'appareil : pour des coordonnées éloignées, vérifiez qu'il correspond au lieu.",

    optEyes: "👀 À l'œil nu",
    optBinoculars: '🔭 Jumelles',
    optSmallTelescope: '🔬 Petit télescope',
    durationOptions: {
      15: '15 minutes',
      30: '30 minutes',
      45: '45 minutes',
      60: '60 minutes (1 heure)',
      90: '90 minutes (1 heure et demie)',
      120: '120 minutes (2 heures)',
    },

    summaryDate: 'Date :',
    summaryTime: "Heure d'observation :",
    summaryDuration: 'Durée de la session :',
    summaryInstrument: 'Instrument :',
    summaryCoordinates: 'Coordonnées :',
    unitMinutes: 'minutes',

    headerPlan: "🚀 Plan de la soirée d'observation",
    targetsAboveHorizonCount: "cibles au-dessus de l'horizon",
    emptyPlan:
      "🌌 Ni la Lune ni les planètes ne passent au-dessus de l'horizon pendant la session. Essayez d'augmenter la durée ou de changer d'heure !",

    sessionMaxAltitudeLabel: 'Altitude maximale estimée (session) :',
    nextTransitAltitudeLabel: 'Altitude à la prochaine culmination :',
    atTimeLabel: 'à',
    directionLabel: 'Direction :',
    compassLabel: 'boussole',
    risesAtLabel: 'Prochain lever :',
    setsAtLabel: 'Prochain coucher :',
    eventUnavailable: 'non trouvé sous 48 heures',
    phaseLabel: 'Phase :',
    illuminatedLabel: 'illuminée',
    moonDiagramNote: "Schéma de la phase ; l'orientation dans le ciel peut changer.",
    indicationLabel: 'Indication :',
    instrumentAffinityLabel: 'Affinité instrument :',
    inSky: '(dans le ciel)',
    arriving: '(en approche)',

    solarWarning:
      "☀️ Attention : le Soleil est au-dessus de l'horizon pendant au moins une partie de la session. Ne le regardez jamais directement sans filtre solaire certifié et la supervision d'un adulte compétent.",
    permanentSolarSafety:
      "Sécurité solaire : ne jamais observer le Soleil sans filtre solaire certifié correctement installé et la supervision d'un adulte compétent.",

    errors: {
      invalidDate: 'Choisissez une date réelle pour la mission.',
      invalidTime: 'Choisissez une heure valide pour la mission.',
      invalidDuration: 'Choisissez une durée valide pour la mission.',
      invalidLatitude: 'La latitude doit être comprise entre -90° et +90°.',
      invalidLongitude: 'La longitude doit être comprise entre -180° et +180°.',
      calculation: 'Impossible de calculer le plan. Vérifiez les données et réessayez.',
      storage: "Le journal n'est pas disponible dans ce navigateur. La note n'a pas été modifiée.",
    },

    logbookTitle: '📓 Journal de Bord de la Mission',
    privacyNote: '🔒 Vos notes restent dans la base locale de ce navigateur et de cet appareil.',
    noteLabel: 'Note de mission',
    placeholderNote: 'Écrivez ici vos notes ou ce que vous avez observé pendant la mission...',
    btnSaveNote: '💾 Enregistrer la note dans le journal',
    btnDeleteNote: '🗑️ Supprimer',
    confirmDeleteNote: 'Supprimer définitivement cette note ?',
    noteSaved: 'Note enregistrée dans le navigateur.',
    noteDeleted: 'Note supprimée.',
    emptyLogbook:
      'Aucune note enregistrée dans le journal. Écrivez une note ci-dessus et enregistrez votre premier essai !',

    directions: {
      N: 'Nord',
      NE: 'Nord-Est',
      E: 'Est',
      SE: 'Sud-Est',
      S: 'Sud',
      SW: 'Sud-Ouest',
      W: 'Ouest',
      NW: 'Nord-Ouest',
    },

    planets: {
      Moon: 'Lune',
      Mercury: 'Mercure',
      Venus: 'Vénus',
      Mars: 'Mars',
      Jupiter: 'Jupiter',
      Saturn: 'Saturne',
      Uranus: 'Uranus',
      Neptune: 'Neptune',
    },

    moonPhases: {
      new: 'Nouvelle Lune',
      waxingCrescent: 'Premier croissant',
      firstQuarter: 'Premier quartier',
      waxingGibbous: 'Gibbeuse croissante',
      full: 'Pleine Lune',
      waningGibbous: 'Gibbeuse décroissante',
      thirdQuarter: 'Dernier quartier',
      waningCrescent: 'Dernier croissant',
    },

    indications: {
      setsDuring:
        '⏳ Se couche pendant la session (à {time}) — Observez immédiatement dans les premières minutes !',
      risesDuring: '🌅 Se lève pendant la session (à {time}) — Sera visible vers la fin',
      rising: '📈 En hausse à {dir} (visible pendant toute la session)',
      descending: '📉 En baisse à {dir} (visible pendant toute la session)',
      stable: '🌟 Stable dans le ciel à {dir} (visible pendant toute la session)',
    },

    instrumentAffinity: {
      Moon: {
        eyes: "🟢 Parfait ! (Brillante et facile à voir à l'œil nu)",
        binoculars: '🌟 Spectaculaire ! (Voir les mers lunaires et les grands cratères)',
        'small-telescope': '🔭 Spectaculaire ! (Voir les détails nets des cratères et montagnes)',
      },
      Venus: {
        eyes: '🟢 Parfait ! (Très brillante comme étoile du matin/soir)',
        binoculars: '🟡 Bon (Facile à repérer ; la phase nécessite un télescope)',
        'small-telescope': '🌟 Excellent (La phase de la planète devient reconnaissable)',
      },
      Jupiter: {
        eyes: "🟢 Très bon ! (Très brillant à l'œil nu)",
        binoculars: '🌟 Spectaculaire ! (Voir Jupiter et ses 4 satellites galiléens)',
        'small-telescope':
          '🔭 Spectaculaire ! (Satellites et principales bandes atmosphériques observables)',
      },
      Mars: {
        eyes: '🟢 Bon (Reconnaissable à sa couleur rouge vif)',
        binoculars: '🟡 Correct (Point rouge très net)',
        'small-telescope':
          '🌟 Bon (Les détails dépendent de la distance, du seeing et du diamètre)',
      },
      Saturn: {
        eyes: '🟡 Correct (Ressemble à une étoile dorée)',
        binoculars: '🟡 Correct (Peut sembler allongé ; un télescope sépare les anneaux)',
        'small-telescope': '🔭 Spectaculaire ! (Les anneaux de Saturne sont bien définis)',
      },
      Mercury: {
        eyes: "🟡 Difficile (Petit et très proche de l'horizon)",
        binoculars: '🟠 Uniquement après le coucher du Soleil (Ne jamais viser près du Soleil)',
        'small-telescope':
          '🟠 Uniquement après le coucher du Soleil (Phase parfois reconnaissable)',
      },
      Uranus: {
        eyes: "🔴 Presque impossible (Trop faible à l'œil nu)",
        binoculars: '🟡 Nécessaire (Apparaît comme un faible point bleu-vert)',
        'small-telescope': '🟢 Recommandé ! (Distinguer le petit disque vert-bleu)',
      },
      Neptune: {
        eyes: "🔴 Impossible à l'œil nu (Invisible sans instrument)",
        binoculars: '🔴 Très difficile (Nécessite un ciel très noir et une carte céleste)',
        'small-telescope': '🟡 Nécessaire (Un ciel sombre et une carte restent indispensables)',
      },
    },
  },
};
