import { describe, it, expect } from 'vitest';
import {
  formatDateItalian,
  formatDateLocalized,
  getTodayDateString,
  parseLocalDate,
  parseLocalDateTime,
} from '../../src/utils/format.js';

describe('formatUtils', () => {
  it('getTodayDateString restituisce una data in formato YYYY-MM-DD', () => {
    const today = getTodayDateString();
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('formatDateItalian formatta correttamente una data valida', () => {
    const formatted = formatDateItalian('2026-08-10');
    expect(formatted).toContain('2026');
    expect(formatted).toContain('agosto');
  });

  it('rifiuta date e orari impossibili senza normalizzarli', () => {
    expect(parseLocalDate('2026-02-29')).toBeNull();
    expect(parseLocalDate('2024-02-29')).toBeInstanceOf(Date);
    expect(parseLocalDateTime('2026-08-10', '24:00')).toBeNull();
  });

  it('formatta la data nella lingua selezionata', () => {
    expect(formatDateLocalized('2026-08-10', 'fr')).toContain('août');
  });
});
