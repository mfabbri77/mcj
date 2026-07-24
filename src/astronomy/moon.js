import { calculateMoonIllumination } from './astronomy-engine-adapter.js';
import { TRANSLATIONS } from '../i18n/translations.js';
import { parseLocalDateTime } from '../utils/format.js';

/**
 * Restituisce il nome della fase lunare tradotto in base all'angolo di fase (0-360°).
 * @param {number} angleDeg
 * @param {string} lang
 * @returns {string}
 */
export function getMoonPhaseName(angleDeg, lang = 'it') {
  const norm = ((angleDeg % 360) + 360) % 360;
  const mp = (TRANSLATIONS[lang] || TRANSLATIONS.it).moonPhases;

  if (norm >= 337.5 || norm < 22.5) return mp.new;
  if (norm >= 22.5 && norm < 67.5) return mp.waxingCrescent;
  if (norm >= 67.5 && norm < 112.5) return mp.firstQuarter;
  if (norm >= 112.5 && norm < 157.5) return mp.waxingGibbous;
  if (norm >= 157.5 && norm < 202.5) return mp.full;
  if (norm >= 202.5 && norm < 247.5) return mp.waningGibbous;
  if (norm >= 247.5 && norm < 292.5) return mp.thirdQuarter;
  return mp.waningCrescent;
}

/**
 * Calcola il sommario lunare per una data e un'ora date.
 * @param {{ dateString: string, timeString: string, lang: string }} param0
 * @returns {{ phaseName: string, illuminationPercent: number, phaseAngleDeg: number } | null}
 */
export function getMoonSummary({ dateString, timeString = '21:30', lang = 'it' }) {
  const date = parseLocalDateTime(dateString, timeString);
  if (!date) return null;

  const { phaseFraction, phaseAngleDeg } = calculateMoonIllumination(date);
  const illuminationPercent = Math.round(phaseFraction * 100);
  const phaseName = getMoonPhaseName(phaseAngleDeg, lang);

  return {
    phaseName,
    illuminationPercent,
    phaseAngleDeg: Math.round(phaseAngleDeg * 10) / 10,
  };
}
