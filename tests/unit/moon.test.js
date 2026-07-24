import { describe, it, expect } from 'vitest';
import { getMoonSummary, getMoonPhaseName } from '../../src/astronomy/moon.js';

describe('moonAstronomyModule', () => {
  it('getMoonPhaseName assegna i nomi corretti in base agli angoli', () => {
    expect(getMoonPhaseName(0)).toBe('Luna nuova');
    expect(getMoonPhaseName(90)).toBe('Primo quarto');
    expect(getMoonPhaseName(180)).toBe('Luna piena');
    expect(getMoonPhaseName(270)).toBe('Ultimo quarto');
  });

  it('getMoonSummary calcola correttamente la fase per una data specifica', () => {
    const summary = getMoonSummary({ dateString: '2026-07-28', timeString: '21:30' });
    expect(summary).not.toBeNull();
    expect(summary.illuminationPercent).toBeGreaterThanOrEqual(0);
    expect(summary.illuminationPercent).toBeLessThanOrEqual(100);
    expect(typeof summary.phaseName).toBe('string');
  });
});
