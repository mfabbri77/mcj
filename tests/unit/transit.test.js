import { describe, it, expect } from 'vitest';
import { getEveningPlan } from '../../src/astronomy/plan.js';

describe('astronomySessionAndTransitAltitude', () => {
  it("calcola l'altezza massima stimata di sessione e la prossima culminazione", () => {
    const plan = getEveningPlan({
      dateString: '2026-07-24',
      timeString: '21:30',
      durationMinutes: 45,
      latitudeDeg: 41.9,
      longitudeDeg: 12.5,
    });

    expect(plan.length).toBeGreaterThan(0);
    plan.forEach((t) => {
      expect(typeof t.sessionMaxAltDeg).toBe('number');
      expect(typeof t.sessionMaxTimeStr).toBe('string');
      expect(typeof t.transitAltitudeDeg).toBe('number');
      expect(typeof t.transitTimeStr).toBe('string');
    });
  });
});
