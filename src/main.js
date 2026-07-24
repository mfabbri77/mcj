import './style.css';
import {
  getTodayDateString,
  formatDateLocalized,
  parseLocalDate,
  parseLocalDateTime,
} from './utils/format.js';
import { validateObserverCoordinates } from './astronomy/coordinates.js';
import { getEveningPlan, getSolarSafetyStatus } from './astronomy/plan.js';
import { createMoonSvg } from './ui/components/moon-renderer.js';
import { createPlanetSvg } from './ui/components/planet-renderer.js';
import { loadLogbookNotes, saveLogbookNote, deleteLogbookNote } from './storage/logbook.js';
import { TRANSLATIONS } from './i18n/translations.js';

const formMissione = document.getElementById('form-missione');
const inputData = document.getElementById('data-missione');
const inputOra = document.getElementById('ora-missione');
const inputDurata = document.getElementById('durata-missione');
const inputStrumento = document.getElementById('strumento-missione');
const inputLat = document.getElementById('latitudine');
const inputLon = document.getElementById('longitudine');
const btnReset = document.getElementById('btn-reset');
const msgStato = document.getElementById('msg-stato');
const selectLingua = document.getElementById('select-lingua');

// Elementi DOM Etichette Traducibili
const lblDate = document.getElementById('lbl-date');
const lblTime = document.getElementById('lbl-time');
const lblDuration = document.getElementById('lbl-duration');
const lblInstrument = document.getElementById('lbl-instrument');
const lblLat = document.getElementById('lbl-lat');
const lblLon = document.getElementById('lbl-lon');
const appTitle = document.getElementById('app-title');
const timeZoneNote = document.getElementById('timezone-note');
const permanentSolarSafety = document.getElementById('permanent-solar-safety');

// Elementi Diario
const logbookTitle = document.getElementById('logbook-title');
const privacyNote = document.getElementById('privacy-note');
const lblNote = document.getElementById('lbl-note');
const inputNotaDiario = document.getElementById('nota-diario');
const btnSalvaNota = document.getElementById('btn-salva-nota');
const listaNoteDiario = document.getElementById('lista-note-diario');
const logbookStatus = document.getElementById('logbook-status');

const LANG_STORAGE_KEY = 'mcj_preferred_lang_v1';
let currentLang = 'it';

function caricaLinguaPreferita() {
  try {
    const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
    if (savedLang && (savedLang === 'it' || savedLang === 'fr')) {
      return savedLang;
    }
  } catch (error) {
    console.error('Errore lettura lingua preferita:', error);
  }
  return 'it';
}

function salvaLinguaPreferita(lang) {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch (error) {
    console.error('Errore salvataggio lingua preferita:', error);
  }
}

function applicaTraduzioniUI(lang) {
  currentLang = lang;
  salvaLinguaPreferita(lang);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.it;
  document.documentElement.lang = lang;

  if (appTitle) appTitle.textContent = t.appTitle;
  if (lblDate) lblDate.textContent = t.labelDate;
  if (lblTime) lblTime.textContent = t.labelTime;
  if (lblDuration) lblDuration.textContent = t.labelDuration;
  if (lblInstrument) lblInstrument.textContent = t.labelInstrument;
  if (lblLat) lblLat.textContent = t.labelLat;
  if (lblLon) lblLon.textContent = t.labelLon;
  if (btnReset) btnReset.textContent = t.btnReset;
  if (timeZoneNote) timeZoneNote.textContent = t.timeZoneNote;
  if (permanentSolarSafety) {
    permanentSolarSafety.textContent = t.permanentSolarSafety;
  }
  if (selectLingua) {
    selectLingua.setAttribute('aria-label', t.languageSelectorLabel);
  }

  if (inputStrumento) {
    inputStrumento.options[0].text = t.optEyes;
    inputStrumento.options[1].text = t.optBinoculars;
    inputStrumento.options[2].text = t.optSmallTelescope;
  }
  if (inputDurata) {
    Array.from(inputDurata.options).forEach((option) => {
      option.text = t.durationOptions[option.value] ?? option.text;
    });
  }

  if (logbookTitle) logbookTitle.textContent = t.logbookTitle;
  if (privacyNote) privacyNote.textContent = t.privacyNote;
  if (lblNote) lblNote.textContent = t.noteLabel;
  if (inputNotaDiario) inputNotaDiario.placeholder = t.placeholderNote;
  if (btnSalvaNota) btnSalvaNota.textContent = t.btnSaveNote;

  if (selectLingua && selectLingua.value !== lang) {
    selectLingua.value = lang;
  }
}

function mostraErroreMissione(message) {
  msgStato.className = 'status-box error';
  msgStato.innerHTML = `<p>⚠️ ${escapeHtml(message)}</p>`;
}

function aggiornaStatoDiario(message = '', isError = false) {
  logbookStatus.textContent = message;
  logbookStatus.className = isError ? 'logbook-status error' : 'logbook-status';
}

function impostaValoriPredefiniti() {
  inputData.value = getTodayDateString();
  inputOra.value = '21:30';
  inputDurata.value = '45';
  inputStrumento.value = 'eyes';
  inputLat.value = '41.90';
  inputLon.value = '12.50';
}

function aggiornaScheda() {
  const dataScelta = inputData.value;
  const oraScelta = inputOra.value;
  const durataScelta = inputDurata.value;
  const strumentoScelto = inputStrumento.value;
  const latRaw = inputLat.value.trim();
  const lonRaw = inputLon.value.trim();

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.it;
  const dataFormattata = formatDateLocalized(dataScelta, currentLang);

  if (!parseLocalDate(dataScelta) || !dataFormattata) {
    mostraErroreMissione(t.errors.invalidDate);
    return;
  }

  if (!parseLocalDateTime(dataScelta, oraScelta)) {
    mostraErroreMissione(t.errors.invalidTime);
    return;
  }

  const durataMinuti = Number(durataScelta);
  if (!Number.isFinite(durataMinuti) || durataMinuti <= 0) {
    mostraErroreMissione(t.errors.invalidDuration);
    return;
  }

  if (latRaw === '' || !Number.isFinite(Number(latRaw))) {
    mostraErroreMissione(t.errors.invalidLatitude);
    return;
  }

  if (lonRaw === '' || !Number.isFinite(Number(lonRaw))) {
    mostraErroreMissione(t.errors.invalidLongitude);
    return;
  }

  const latScelta = Number(latRaw);
  const lonScelta = Number(lonRaw);

  const coordValidazione = validateObserverCoordinates(latScelta, lonScelta);
  if (!coordValidazione.valid) {
    mostraErroreMissione(t.errors[coordValidazione.errorCode] ?? t.errors.calculation);
    return;
  }

  let eveningPlan;
  let solarSafety;
  try {
    eveningPlan = getEveningPlan({
      dateString: dataScelta,
      timeString: oraScelta,
      durationMinutes: durataMinuti,
      latitudeDeg: latScelta,
      longitudeDeg: lonScelta,
      instrument: strumentoScelto,
      lang: currentLang,
    });
    solarSafety = getSolarSafetyStatus({
      dateString: dataScelta,
      timeString: oraScelta,
      durationMinutes: durataMinuti,
      latitudeDeg: latScelta,
      longitudeDeg: lonScelta,
    });
  } catch (error) {
    console.error('Errore generazione piano serata:', error);
    mostraErroreMissione(t.errors.calculation);
    return;
  }

  const etichettaStrumento =
    inputStrumento.options[inputStrumento.selectedIndex]?.text ?? strumentoScelto;

  let contenutoHtml = `
    <div class="summary-details">
      <p>📅 <strong>${t.summaryDate}</strong> ${dataFormattata}</p>
      <p>⏰ <strong>${t.summaryTime}</strong> ${oraScelta}</p>
      <p>⏳ <strong>${t.summaryDuration}</strong> ${durataMinuti} ${t.unitMinutes}</p>
      <p>🛠️ <strong>${t.summaryInstrument}</strong> ${etichettaStrumento}</p>
      <p>📍 <strong>${t.summaryCoordinates}</strong> Lat ${latScelta.toFixed(2)}°, Lon ${lonScelta.toFixed(2)}°</p>
    </div>
  `;

  if (eveningPlan && eveningPlan.length > 0) {
    contenutoHtml += `
      <div class="planets-section-header">
        ${t.headerPlan} <span>(${eveningPlan.length} ${t.targetsAboveHorizonCount})</span>
      </div>
    `;

    eveningPlan.forEach((target, index) => {
      let graphicSvg = '';
      try {
        if (target.type === 'moon') {
          graphicSvg = createMoonSvg(target.phaseAngleDeg, 90, target.name);
        } else {
          graphicSvg = createPlanetSvg(target.bodyName, 90, target.name);
        }
      } catch (error) {
        console.error(`Errore SVG per ${target.name}:`, error);
      }

      const statusLine = `<div class="astro-status-line ${target.badgeClass}">📌 <strong>${t.indicationLabel}</strong> ${target.statusBadge}</div>`;

      let detailHtml;
      if (target.type === 'moon') {
        detailHtml = `
          <div class="astro-sub-detail">${t.phaseLabel} <strong>${target.phaseName}</strong> (${target.illuminationPercent}% ${t.illuminatedLabel})</div>
          <div class="astro-sub-detail astro-diagram-note">${t.moonDiagramNote}</div>
          <div class="astro-sub-detail">📐 ${t.sessionMaxAltitudeLabel} <strong>${target.sessionMaxAltDeg}°</strong> ${t.atTimeLabel} <strong>${target.sessionMaxTimeStr}</strong></div>
          <div class="astro-sub-detail">👑 ${t.nextTransitAltitudeLabel} <strong>${target.transitAltitudeDeg}°</strong> ${t.atTimeLabel} <strong>${target.transitTimeStr}</strong></div>
          <div class="astro-sub-detail">🧭 ${t.directionLabel} <strong>${target.directionLabel}</strong> (${target.azimuthDeg}° ${t.compassLabel})</div>
          <div class="astro-sub-detail">🌅 ${t.risesAtLabel} <strong>${target.riseTimeStr}</strong></div>
          <div class="astro-sub-detail">🌇 ${t.setsAtLabel} <strong>${target.setTimeStr}</strong></div>
          <div class="astro-sub-detail">🎯 <strong>${t.instrumentAffinityLabel}</strong> ${target.instrumentAffinity}</div>
          ${statusLine}
        `;
      } else {
        detailHtml = `
          <div class="astro-sub-detail">📐 ${t.sessionMaxAltitudeLabel} <strong>${target.sessionMaxAltDeg}°</strong> ${t.atTimeLabel} <strong>${target.sessionMaxTimeStr}</strong></div>
          <div class="astro-sub-detail">👑 ${t.nextTransitAltitudeLabel} <strong>${target.transitAltitudeDeg}°</strong> ${t.atTimeLabel} <strong>${target.transitTimeStr}</strong></div>
          <div class="astro-sub-detail">🧭 ${t.directionLabel} <strong>${target.directionLabel}</strong> (${target.azimuthDeg}° ${t.compassLabel})</div>
          <div class="astro-sub-detail">🌅 ${t.risesAtLabel} <strong>${target.riseTimeStr}</strong></div>
          <div class="astro-sub-detail">🌇 ${t.setsAtLabel} <strong>${target.setTimeStr}</strong></div>
          <div class="astro-sub-detail">🎯 <strong>${t.instrumentAffinityLabel}</strong> ${target.instrumentAffinity}</div>
          ${statusLine}
        `;
      }

      contenutoHtml += `
        <div class="astro-card ${target.type}-card visible-target">
          <div class="target-step-number">#${index + 1}</div>
          <div class="astro-graphic-container">
            ${graphicSvg}
          </div>
          <div class="astro-info-text">
            <div class="astro-header-row">
              <div class="astro-main-name">${target.name}</div>
            </div>
            ${detailHtml}
          </div>
        </div>
      `;
    });
  } else {
    contenutoHtml += `
      <div class="empty-plan-notice" style="margin-top: 15px; padding: 14px; background: rgba(15, 23, 42, 0.8); border: 1px dashed #334155; border-radius: 8px; font-size: 0.9rem; color: #94a3b8;">
        ${t.emptyPlan}
      </div>
    `;
  }

  if (solarSafety?.sunAboveDuringSession) {
    contenutoHtml += `
      <div class="solar-warning">
        ${t.solarWarning}
      </div>
    `;
  }

  msgStato.className = 'status-box success';
  msgStato.innerHTML = contenutoHtml;
}

// Gestione del Diario di Bordo
async function renderizzaDiario() {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.it;
  let notes;
  try {
    notes = await loadLogbookNotes();
  } catch (error) {
    console.error('Errore caricamento diario:', error);
    aggiornaStatoDiario(t.errors.storage, true);
    listaNoteDiario.replaceChildren();
    return;
  }

  if (!notes || notes.length === 0) {
    listaNoteDiario.innerHTML = `<div class="empty-logbook">${t.emptyLogbook}</div>`;
    return;
  }

  let html = '';
  notes.forEach((note) => {
    html += `
      <div class="logbook-card" data-id="${escapeHtml(String(note.id))}">
        <div class="logbook-card-header">
          <span class="logbook-date">📅 ${escapeHtml(String(note.dateStr))}</span>
          <button type="button" class="btn-delete-note" data-id="${escapeHtml(String(note.id))}">${t.btnDeleteNote}</button>
        </div>
        <div class="logbook-text">${escapeHtml(String(note.text))}</div>
      </div>
    `;
  });

  listaNoteDiario.innerHTML = html;

  const btnDeleteList = listaNoteDiario.querySelectorAll('.btn-delete-note');
  btnDeleteList.forEach((btn) => {
    btn.addEventListener('click', async (event) => {
      if (!window.confirm(t.confirmDeleteNote)) return;

      const id = event.currentTarget.dataset.id;
      try {
        await deleteLogbookNote(id);
        aggiornaStatoDiario(t.noteDeleted);
        await renderizzaDiario();
      } catch (error) {
        console.error('Errore eliminazione nota:', error);
        aggiornaStatoDiario(t.errors.storage, true);
      }
    });
  });
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function (m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    }[m];
  });
}

btnSalvaNota.addEventListener('click', async () => {
  const testo = inputNotaDiario.value;
  if (!testo.trim()) return;
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.it;
  const locale = currentLang === 'fr' ? 'fr-FR' : 'it-IT';
  const dataOraCorrente = new Date().toLocaleString(locale, {
    dateStyle: 'short',
    timeStyle: 'short',
  });

  try {
    await saveLogbookNote(testo, dataOraCorrente);
    inputNotaDiario.value = '';
    aggiornaStatoDiario(t.noteSaved);
    await renderizzaDiario();
  } catch (error) {
    console.error('Errore salvataggio nota:', error);
    aggiornaStatoDiario(t.errors.storage, true);
  }
});

function gestisciReset() {
  impostaValoriPredefiniti();
  aggiornaScheda();
}

if (selectLingua) {
  selectLingua.addEventListener('change', (e) => {
    applicaTraduzioniUI(e.target.value);
    aggiornaScheda();
    aggiornaStatoDiario();
    void renderizzaDiario();
  });
}

impostaValoriPredefiniti();

const campiForm = [inputData, inputOra, inputDurata, inputStrumento, inputLat, inputLon];
campiForm.forEach((campo) => {
  campo.addEventListener('input', aggiornaScheda);
  campo.addEventListener('change', aggiornaScheda);
});

formMissione.addEventListener('submit', (e) => e.preventDefault());
btnReset.addEventListener('click', gestisciReset);

const linguaIniziale = caricaLinguaPreferita();
applicaTraduzioniUI(linguaIniziale);
aggiornaScheda();
void renderizzaDiario();
