import * as Astronomy from 'astronomy-engine';

/**
 * Risolve un nome interno in un corpo supportato da Astronomy Engine.
 * Un nome sconosciuto è un errore di programmazione e non viene mascherato.
 * @param {string} bodyName
 * @returns {Astronomy.Body}
 */
function resolveBody(bodyName) {
  const body = Astronomy.Body[bodyName];
  if (!body) {
    throw new TypeError(`Corpo astronomico non supportato: ${bodyName}`);
  }
  return body;
}

/**
 * Converte una Date valida in un istante Astronomy Engine.
 * @param {Date} instant
 * @returns {Astronomy.AstroTime}
 */
export function toAstronomyTime(instant) {
  if (!(instant instanceof Date) || !Number.isFinite(instant.getTime())) {
    throw new TypeError('È richiesto un istante Date valido.');
  }
  return Astronomy.MakeTime(instant);
}

/**
 * Calcola l'illuminazione della Luna e il suo angolo di fase.
 * @param {Date} date
 * @returns {{ phaseFraction: number, phaseAngleDeg: number }}
 */
export function calculateMoonIllumination(date) {
  const time = toAstronomyTime(date);
  const illumination = Astronomy.Illumination(Astronomy.Body.Moon, time);
  const phaseAngleDeg = Astronomy.MoonPhase(time);

  if (!Number.isFinite(illumination.phase_fraction) || !Number.isFinite(phaseAngleDeg)) {
    throw new Error('Astronomy Engine ha restituito dati lunari non validi.');
  }

  return {
    phaseFraction: illumination.phase_fraction,
    phaseAngleDeg,
  };
}

/**
 * Calcola altezza e azimut reali per un corpo celeste.
 * @param {string} bodyName - 'Jupiter', 'Mars', 'Venus', ecc.
 * @param {Date} date
 * @param {number} latitudeDeg
 * @param {number} longitudeDeg
 * @param {number} elevationM
 * @returns {{ altitudeDeg: number, azimuthDeg: number }}
 */
export function calculateBodyHorizontalPosition(
  bodyName,
  date,
  latitudeDeg,
  longitudeDeg,
  elevationM = 0,
) {
  const time = toAstronomyTime(date);
  const observer = new Astronomy.Observer(latitudeDeg, longitudeDeg, elevationM);
  const equatorial = Astronomy.Equator(resolveBody(bodyName), time, observer, true, true);
  const horizontal = Astronomy.Horizon(time, observer, equatorial.ra, equatorial.dec, 'normal');

  if (!Number.isFinite(horizontal.altitude) || !Number.isFinite(horizontal.azimuth)) {
    throw new Error(`Astronomy Engine ha restituito una posizione non valida per ${bodyName}.`);
  }

  return {
    altitudeDeg: horizontal.altitude,
    azimuthDeg: horizontal.azimuth,
  };
}

/**
 * Cerca i prossimi eventi di levata e tramonto, conservando data e ora.
 * `null` indica che l'evento non avviene nella finestra cercata.
 * @param {string} bodyName
 * @param {Date} date
 * @param {number} latitudeDeg
 * @param {number} longitudeDeg
 * @param {number} elevationM
 * @param {number} limitDays
 * @returns {{ riseTime: Date|null, setTime: Date|null }}
 */
export function calculateBodyRiseSet(
  bodyName,
  date,
  latitudeDeg,
  longitudeDeg,
  elevationM = 0,
  limitDays = 2,
) {
  const time = toAstronomyTime(date);
  const observer = new Astronomy.Observer(latitudeDeg, longitudeDeg, elevationM);
  const body = resolveBody(bodyName);
  const riseEvent = Astronomy.SearchRiseSet(body, observer, +1, time, limitDays);
  const setEvent = Astronomy.SearchRiseSet(body, observer, -1, time, limitDays);

  return {
    riseTime: riseEvent?.date ?? null,
    setTime: setEvent?.date ?? null,
  };
}

/**
 * Cerca la prossima culminazione: il passaggio del corpo sul meridiano locale.
 * @param {string} bodyName
 * @param {Date} date
 * @param {number} latitudeDeg
 * @param {number} longitudeDeg
 * @param {number} elevationM
 * @returns {{ altitudeDeg: number, time: Date }}
 */
export function calculateNextTransit(bodyName, date, latitudeDeg, longitudeDeg, elevationM = 0) {
  const time = toAstronomyTime(date);
  const observer = new Astronomy.Observer(latitudeDeg, longitudeDeg, elevationM);
  const event = Astronomy.SearchHourAngle(resolveBody(bodyName), observer, 0, time, +1);
  const altitudeDeg = event?.hor?.altitude;
  const eventDate = event?.time?.date;

  if (!Number.isFinite(altitudeDeg) || !(eventDate instanceof Date)) {
    throw new Error(`Astronomy Engine non ha trovato una culminazione valida per ${bodyName}.`);
  }

  return {
    altitudeDeg,
    time: eventDate,
  };
}
