import { getMoonSummary } from './moon.js';
import { PLANETS_LIST, getDirectionLabel } from './planets.js';
import {
  calculateBodyHorizontalPosition,
  calculateBodyRiseSet,
  calculateNextTransit,
} from './astronomy-engine-adapter.js';
import { TRANSLATIONS } from '../i18n/translations.js';
import { parseLocalDateTime } from '../utils/format.js';

function isSameLocalDate(first, second) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

function formatEventTime(date, referenceDate, lang, unavailableLabel) {
  if (!(date instanceof Date) || !Number.isFinite(date.getTime())) {
    return unavailableLabel;
  }

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  if (isSameLocalDate(date, referenceDate)) {
    return `${hours}:${minutes}`;
  }

  const locale = lang === 'fr' ? 'fr-FR' : 'it-IT';
  const day = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
  }).format(date);
  return `${day} ${hours}:${minutes}`;
}

function isWithinSession(date, startDate, endDate) {
  return date instanceof Date && date >= startDate && date <= endDate;
}

function getSessionBounds(dateString, timeString, durationMinutes) {
  const startDate = parseLocalDateTime(dateString, timeString);
  const duration = Number(durationMinutes);
  if (!startDate || !Number.isFinite(duration) || duration <= 0) {
    return null;
  }

  return {
    startDate,
    endDate: new Date(startDate.getTime() + duration * 60 * 1000),
  };
}

/**
 * Calcola la scaletta del Piano della Serata con supporto bilingue (Italiano / Francese) e affinità strumento.
 *
 * @param {{ dateString: string, timeString: string, durationMinutes: number, latitudeDeg: number, longitudeDeg: number, instrument: string, lang: string }} params
 * @returns {Array<Object>} Lista di corpi celesti visibili
 */
export function getEveningPlan({
  dateString,
  timeString = '21:30',
  durationMinutes = 45,
  latitudeDeg,
  longitudeDeg,
  instrument = 'eyes',
  lang = 'it',
}) {
  if (typeof latitudeDeg !== 'number' || typeof longitudeDeg !== 'number') {
    return [];
  }

  const session = getSessionBounds(dateString, timeString, durationMinutes);
  if (!session) return [];

  const { startDate, endDate } = session;
  const tDict = TRANSLATIONS[lang] || TRANSLATIONS.it;
  const rawTargets = [];

  const moonInfo = getMoonSummary({ dateString, timeString, lang });
  if (moonInfo) {
    rawTargets.push({
      type: 'moon',
      bodyName: 'Moon',
      name: tDict.planets.Moon,
      phaseName: moonInfo.phaseName,
      illuminationPercent: moonInfo.illuminationPercent,
      phaseAngleDeg: moonInfo.phaseAngleDeg,
      baseRank: 0,
    });
  }

  PLANETS_LIST.forEach((p, idx) => {
    rawTargets.push({
      type: 'planet',
      bodyName: p.bodyName,
      name: tDict.planets[p.bodyName] || p.bodyName,
      baseRank: idx + 1,
    });
  });

  const validTargets = [];

  rawTargets.forEach((target) => {
    const posStart = calculateBodyHorizontalPosition(
      target.bodyName,
      startDate,
      latitudeDeg,
      longitudeDeg,
    );
    const posEnd = calculateBodyHorizontalPosition(
      target.bodyName,
      endDate,
      latitudeDeg,
      longitudeDeg,
    );
    const { riseTime, setTime } = calculateBodyRiseSet(
      target.bodyName,
      startDate,
      latitudeDeg,
      longitudeDeg,
    );
    const nextTransit = calculateNextTransit(target.bodyName, startDate, latitudeDeg, longitudeDeg);

    const isAboveStart = posStart.altitudeDeg > 0;
    const risesDuring = isWithinSession(riseTime, startDate, endDate);
    const setsDuring = isWithinSession(setTime, startDate, endDate);

    if (!isAboveStart && !risesDuring) {
      return;
    }

    const altStart = Math.round(posStart.altitudeDeg * 10) / 10;
    const altEnd = Math.round(posEnd.altitudeDeg * 10) / 10;
    const candidates = [
      { altitudeDeg: posStart.altitudeDeg, azimuthDeg: posStart.azimuthDeg, time: startDate },
      { altitudeDeg: posEnd.altitudeDeg, azimuthDeg: posEnd.azimuthDeg, time: endDate },
    ];

    if (isWithinSession(nextTransit.time, startDate, endDate)) {
      candidates.push({
        altitudeDeg: nextTransit.altitudeDeg,
        azimuthDeg: calculateBodyHorizontalPosition(
          target.bodyName,
          nextTransit.time,
          latitudeDeg,
          longitudeDeg,
        ).azimuthDeg,
        time: nextTransit.time,
      });
    } else if (risesDuring && setsDuring && riseTime < setTime) {
      const midpoint = new Date((riseTime.getTime() + setTime.getTime()) / 2);
      const midpointPosition = calculateBodyHorizontalPosition(
        target.bodyName,
        midpoint,
        latitudeDeg,
        longitudeDeg,
      );
      candidates.push({ ...midpointPosition, time: midpoint });
    }

    const sessionMaximum = candidates.reduce((highest, candidate) =>
      candidate.altitudeDeg > highest.altitudeDeg ? candidate : highest,
    );
    const azimuthDeg = Math.round(sessionMaximum.azimuthDeg * 10) / 10;
    const directionLabel = getDirectionLabel(azimuthDeg, lang);
    const instrumentAffinity = tDict.instrumentAffinity?.[target.bodyName]?.[instrument] ?? '';

    let statusBadge;
    let badgeClass;
    let priorityCategory;
    const indT = tDict.indications;

    if (setsDuring && (isAboveStart || risesDuring)) {
      statusBadge = indT.setsDuring.replace(
        '{time}',
        formatEventTime(setTime, startDate, lang, tDict.eventUnavailable),
      );
      badgeClass = 'tag-urgent';
      priorityCategory = 1;
    } else if (risesDuring) {
      statusBadge = indT.risesDuring.replace(
        '{time}',
        formatEventTime(riseTime, startDate, lang, tDict.eventUnavailable),
      );
      badgeClass = 'tag-rising';
      priorityCategory = 3;
    } else {
      const altDiff = altEnd - altStart;
      if (altDiff > 0.2) {
        statusBadge = indT.rising.replace('{dir}', directionLabel);
        badgeClass = 'tag-ideal';
        priorityCategory = 2;
      } else if (altDiff < -0.2) {
        statusBadge = indT.descending.replace('{dir}', directionLabel);
        badgeClass = 'tag-rising';
        priorityCategory = 2;
      } else {
        statusBadge = indT.stable.replace('{dir}', directionLabel);
        badgeClass = 'tag-ideal';
        priorityCategory = 2;
      }
    }

    validTargets.push({
      ...target,
      altitudeDeg: altStart,
      sessionMaxAltDeg: Math.round(sessionMaximum.altitudeDeg * 10) / 10,
      sessionMaxTimeStr: formatEventTime(
        sessionMaximum.time,
        startDate,
        lang,
        tDict.eventUnavailable,
      ),
      transitAltitudeDeg: Math.round(nextTransit.altitudeDeg * 10) / 10,
      transitTimeStr: formatEventTime(nextTransit.time, startDate, lang, tDict.eventUnavailable),
      azimuthDeg,
      directionLabel,
      riseTimeStr: formatEventTime(riseTime, startDate, lang, tDict.eventUnavailable),
      setTimeStr: formatEventTime(setTime, startDate, lang, tDict.eventUnavailable),
      instrumentAffinity,
      statusBadge,
      badgeClass,
      priorityCategory,
      aboveHorizon: isAboveStart,
    });
  });

  validTargets.sort((a, b) => {
    if (a.priorityCategory !== b.priorityCategory) {
      return a.priorityCategory - b.priorityCategory;
    }
    if (a.priorityCategory === 1) {
      return a.altitudeDeg - b.altitudeDeg;
    }
    return a.baseRank - b.baseRank;
  });

  return validTargets;
}

/**
 * Verifica se il Sole è sopra l'orizzonte in almeno una parte della sessione.
 * @param {{ dateString: string, timeString: string, durationMinutes: number, latitudeDeg: number, longitudeDeg: number }} params
 * @returns {{ sunAboveDuringSession: boolean } | null}
 */
export function getSolarSafetyStatus({
  dateString,
  timeString,
  durationMinutes,
  latitudeDeg,
  longitudeDeg,
}) {
  const session = getSessionBounds(dateString, timeString, durationMinutes);
  if (!session) return null;

  const { startDate, endDate } = session;
  const startPosition = calculateBodyHorizontalPosition(
    'Sun',
    startDate,
    latitudeDeg,
    longitudeDeg,
  );
  const endPosition = calculateBodyHorizontalPosition('Sun', endDate, latitudeDeg, longitudeDeg);
  const { riseTime } = calculateBodyRiseSet('Sun', startDate, latitudeDeg, longitudeDeg);

  return {
    sunAboveDuringSession:
      startPosition.altitudeDeg > 0 ||
      endPosition.altitudeDeg > 0 ||
      isWithinSession(riseTime, startDate, endDate),
  };
}
