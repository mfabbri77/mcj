/**
 * Valida che la latitudine sia compresa tra -90 e +90 gradi decimali.
 * @param {number} lat
 * @returns {boolean}
 */
export function isValidLatitude(lat) {
  return typeof lat === 'number' && !isNaN(lat) && lat >= -90 && lat <= 90;
}

/**
 * Valida che la longitudine sia compresa tra -180 e +180 gradi decimali.
 * @param {number} lon
 * @returns {boolean}
 */
export function isValidLongitude(lon) {
  return typeof lon === 'number' && !isNaN(lon) && lon >= -180 && lon <= 180;
}

/**
 * Valida e restituisce un oggetto observer pulito o un errore.
 * @param {number} lat
 * @param {number} lon
 * @returns {{ valid: boolean, error?: string, observer?: { latitudeDeg: number, longitudeDeg: number } }}
 */
export function validateObserverCoordinates(lat, lon) {
  if (!isValidLatitude(lat)) {
    return { valid: false, errorCode: 'invalidLatitude' };
  }
  if (!isValidLongitude(lon)) {
    return { valid: false, errorCode: 'invalidLongitude' };
  }
  return {
    valid: true,
    observer: {
      latitudeDeg: lat,
      longitudeDeg: lon,
    },
  };
}
