import { describe, expect, it } from 'vitest';
import {
  calculateBodyHorizontalPosition,
  calculateMoonIllumination,
} from '../../src/astronomy/astronomy-engine-adapter.js';

describe('astronomyEngineAdapter', () => {
  it('restituisce soltanto valori astronomici finiti', () => {
    const position = calculateBodyHorizontalPosition(
      'Jupiter',
      new Date('2026-07-24T20:00:00Z'),
      41.9,
      12.5,
    );
    const moon = calculateMoonIllumination(new Date('2026-07-24T20:00:00Z'));

    expect(Number.isFinite(position.altitudeDeg)).toBe(true);
    expect(Number.isFinite(position.azimuthDeg)).toBe(true);
    expect(Number.isFinite(moon.phaseFraction)).toBe(true);
    expect(Number.isFinite(moon.phaseAngleDeg)).toBe(true);
  });

  it('propaga un corpo sconosciuto invece di inventare coordinate zero', () => {
    expect(() =>
      calculateBodyHorizontalPosition(
        'CorpoInesistente',
        new Date('2026-07-24T20:00:00Z'),
        41.9,
        12.5,
      ),
    ).toThrow(/non supportato/);
  });
});
