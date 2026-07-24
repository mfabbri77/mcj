/**
 * Restituisce la data di oggi in formato ISO YYYY-MM-DD per gli input HTML.
 */
export function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Converte una data HTML YYYY-MM-DD in una Date locale, senza normalizzare
 * silenziosamente date impossibili come il 31 febbraio.
 * @param {string} dateString
 * @returns {Date|null}
 */
export function parseLocalDate(dateString) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString ?? '');
  if (!match) return null;

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(0);
  date.setHours(0, 0, 0, 0);
  date.setFullYear(year, month - 1, day);

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }

  return date;
}

/**
 * Converte data e ora degli input HTML in una Date nel fuso del dispositivo.
 * @param {string} dateString
 * @param {string} timeString
 * @returns {Date|null}
 */
export function parseLocalDateTime(dateString, timeString) {
  const date = parseLocalDate(dateString);
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(timeString ?? '');
  if (!date || !match) return null;

  date.setHours(Number(match[1]), Number(match[2]), 0, 0);
  return date;
}

/**
 * Formatta una data HTML nella lingua scelta.
 * @param {string} dateString
 * @param {string} lang
 * @returns {string|null}
 */
export function formatDateLocalized(dateString, lang = 'it') {
  const date = parseLocalDate(dateString);
  if (!date) return null;

  const locale = lang === 'fr' ? 'fr-FR' : 'it-IT';
  const formatted = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

/**
 * Compatibilità con il nome usato dalle prime versioni dell'app.
 * @param {string} dateString
 * @returns {string|null}
 */
export function formatDateItalian(dateString) {
  return formatDateLocalized(dateString, 'it');
}
