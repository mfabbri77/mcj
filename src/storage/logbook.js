import { get, set } from 'idb-keyval';

const STORAGE_KEY = 'mcj_mission_logbook_v1';

/**
 * Carica tutte le note salvate dal diario di bordo in IndexedDB.
 * @returns {Promise<Array<{ id: string, timestamp: number, dateStr: string, text: string }>>}
 */
export async function loadLogbookNotes() {
  const notes = await get(STORAGE_KEY);
  return Array.isArray(notes) ? notes : [];
}

/**
 * Salva una nuova nota nel diario di bordo in IndexedDB.
 * @param {string} text
 * @param {string} dateStr
 * @returns {Promise<Array>} Lista aggiornata delle note
 */
export async function saveLogbookNote(text, dateStr) {
  if (!text || text.trim() === '') return loadLogbookNotes();

  const notes = await loadLogbookNotes();
  const newNote = {
    id: `note_${crypto.randomUUID()}`,
    timestamp: Date.now(),
    dateStr: dateStr || new Date().toLocaleString('it-IT'),
    text: text.trim(),
  };

  const updatedNotes = [newNote, ...notes];
  await set(STORAGE_KEY, updatedNotes);
  return updatedNotes;
}

/**
 * Elimina una nota dal diario di bordo tramite il suo ID univoco.
 * @param {string} noteId
 * @returns {Promise<Array>} Lista aggiornata delle note
 */
export async function deleteLogbookNote(noteId) {
  const notes = await loadLogbookNotes();
  const updatedNotes = notes.filter((note) => note.id !== noteId);
  await set(STORAGE_KEY, updatedNotes);
  return updatedNotes;
}
