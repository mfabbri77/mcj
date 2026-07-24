import { calculateBodyHorizontalPosition } from './astronomy-engine-adapter.js';
import { TRANSLATIONS } from '../i18n/translations.js';
import { parseLocalDateTime } from '../utils/format.js';

export const PLANETS_LIST = [
  {
    bodyName: 'Venus',
    displayNameKey: 'Venus',
    tip: "L'oggetto più luminoso del cielo dopo la Luna.",
  },
  {
    bodyName: 'Jupiter',
    displayNameKey: 'Jupiter',
    tip: 'Gigante gassoso ben visibile ad occhio nudo.',
  },
  { bodyName: 'Mars', displayNameKey: 'Mars', tip: 'Pianeta rosso, ben visibile ad occhio nudo.' },
  { bodyName: 'Saturn', displayNameKey: 'Saturn', tip: 'Spettacolare con i suoi anelli.' },
  {
    bodyName: 'Mercury',
    displayNameKey: 'Mercury',
    tip: "Visibile vicinissimo all'orizzonte prima dell'alba o dopo il tramonto.",
  },
  {
    bodyName: 'Uranus',
    displayNameKey: 'Uranus',
    tip: 'Gigante di ghiaccio debole (richiede binocolo o telescopio).',
  },
  {
    bodyName: 'Neptune',
    displayNameKey: 'Neptune',
    tip: 'Gigante di ghiaccio molto debole (richiede telescopio).',
  },
];

export function getDirectionLabel(azDeg, lang = 'it') {
  const norm = ((azDeg % 360) + 360) % 360;
  const dirs = (TRANSLATIONS[lang] || TRANSLATIONS.it).directions;

  if (norm >= 337.5 || norm < 22.5) return dirs.N;
  if (norm >= 22.5 && norm < 67.5) return dirs.NE;
  if (norm >= 67.5 && norm < 112.5) return dirs.E;
  if (norm >= 112.5 && norm < 157.5) return dirs.SE;
  if (norm >= 157.5 && norm < 202.5) return dirs.S;
  if (norm >= 202.5 && norm < 247.5) return dirs.SW;
  if (norm >= 247.5 && norm < 292.5) return dirs.W;
  return dirs.NW;
}

export function getPlanetSummary({
  bodyName = 'Jupiter',
  bodyDisplayName = 'Giove',
  tip = '',
  dateString,
  timeString = '21:30',
  latitudeDeg,
  longitudeDeg,
  lang = 'it',
}) {
  if (typeof latitudeDeg !== 'number' || typeof longitudeDeg !== 'number') {
    return null;
  }

  const date = parseLocalDateTime(dateString, timeString);
  if (!date) return null;

  const { altitudeDeg, azimuthDeg } = calculateBodyHorizontalPosition(
    bodyName,
    date,
    latitudeDeg,
    longitudeDeg,
  );
  const aboveHorizon = altitudeDeg > 0;

  return {
    bodyName,
    name: bodyDisplayName,
    tip,
    altitudeDeg: Math.round(altitudeDeg * 10) / 10,
    azimuthDeg: Math.round(azimuthDeg * 10) / 10,
    directionLabel: getDirectionLabel(azimuthDeg, lang),
    aboveHorizon,
  };
}

export function getAllPlanetsSummary({
  dateString,
  timeString,
  latitudeDeg,
  longitudeDeg,
  lang = 'it',
}) {
  const planetSummaries = PLANETS_LIST.map((p, index) => {
    const summary = getPlanetSummary({
      bodyName: p.bodyName,
      bodyDisplayName: p.displayNameKey,
      tip: p.tip,
      dateString,
      timeString,
      latitudeDeg,
      longitudeDeg,
      lang,
    });
    if (summary) {
      summary.canonicalIndex = index;
    }
    return summary;
  }).filter(Boolean);

  planetSummaries.sort((a, b) => {
    if (a.aboveHorizon !== b.aboveHorizon) {
      return a.aboveHorizon ? -1 : 1;
    }
    return a.canonicalIndex - b.canonicalIndex;
  });

  return planetSummaries;
}
