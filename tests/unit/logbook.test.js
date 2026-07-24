import { describe, it, expect, vi } from 'vitest';
import { loadLogbookNotes, saveLogbookNote, deleteLogbookNote } from '../../src/storage/logbook.js';

// Mock per idb-keyval per l'ambiente di test senza browser IndexedDB reale
vi.mock('idb-keyval', () => {
  let memoryStore = [];
  return {
    get: vi.fn(async () => memoryStore),
    set: vi.fn(async (key, val) => {
      memoryStore = val;
    }),
  };
});

describe('logbookStorageModule', () => {
  it('salva e carica una nuova nota di missione nel diario', async () => {
    const initialNotes = await loadLogbookNotes();
    expect(initialNotes).toEqual([]);

    const updatedNotes = await saveLogbookNote(
      'Stasera ho osservato Giove con il telescopio!',
      '24/07/2026 21:30',
    );
    expect(updatedNotes.length).toBe(1);
    expect(updatedNotes[0].text).toBe('Stasera ho osservato Giove con il telescopio!');
  });

  it('elimina una nota esistente dal diario', async () => {
    const currentNotes = await loadLogbookNotes();
    const noteId = currentNotes[0].id;

    const notesAfterDelete = await deleteLogbookNote(noteId);
    expect(notesAfterDelete.length).toBe(0);
  });
});
