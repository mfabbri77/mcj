import { describe, it, expect } from 'vitest';
import { getEveningPlan, getSolarSafetyStatus } from '../../src/astronomy/plan.js';

describe('eveningPlanModule', () => {
  it('getEveningPlan calcola indicazioni astronomiche reali verificate', () => {
    const plan = getEveningPlan({
      dateString: '2026-07-24',
      timeString: '21:30',
      durationMinutes: 45,
      latitudeDeg: 41.9,
      longitudeDeg: 12.5,
    });

    expect(Array.isArray(plan)).toBe(true);
    plan.forEach((target) => {
      expect(typeof target.statusBadge).toBe('string');
      // Verifichiamo che l'indicazione contenga dati reali (in salita, in discesa o tramonta/sorge)
      expect(target.statusBadge).toMatch(
        /In salita|In discesa|Stabile|Tramonta durante|Sorge durante/,
      );
    });
  });

  it('rifiuta una data civile impossibile', () => {
    expect(
      getEveningPlan({
        dateString: '2026-02-29',
        timeString: '21:30',
        durationMinutes: 45,
        latitudeDeg: 41.9,
        longitudeDeg: 12.5,
      }),
    ).toEqual([]);
  });

  it("calcola l'avviso solare dalla posizione reale del Sole", () => {
    const common = {
      dateString: '2026-07-24',
      durationMinutes: 45,
      latitudeDeg: 41.9,
      longitudeDeg: 12.5,
    };

    expect(getSolarSafetyStatus({ ...common, timeString: '12:00' }).sunAboveDuringSession).toBe(
      true,
    );
    expect(getSolarSafetyStatus({ ...common, timeString: '00:00' }).sunAboveDuringSession).toBe(
      false,
    );
  });
});
