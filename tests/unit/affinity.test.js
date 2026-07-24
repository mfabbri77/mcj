import { describe, it, expect } from 'vitest';
import { getEveningPlan } from '../../src/astronomy/plan.js';

describe('instrumentAffinityModule', () => {
  it('mostra affinità differenti per Nettuno a occhio nudo vs telescopio', () => {
    const planEyes = getEveningPlan({
      dateString: '2026-07-24',
      timeString: '21:30',
      durationMinutes: 600,
      latitudeDeg: 41.9,
      longitudeDeg: 12.5,
      instrument: 'eyes',
    });

    const neptuneEyes = planEyes.find((target) => target.bodyName === 'Neptune');
    expect(neptuneEyes).toBeDefined();
    expect(neptuneEyes.instrumentAffinity).toContain('Impossibile');

    const planScope = getEveningPlan({
      dateString: '2026-07-24',
      timeString: '21:30',
      durationMinutes: 600,
      latitudeDeg: 41.9,
      longitudeDeg: 12.5,
      instrument: 'small-telescope',
    });

    const neptuneScope = planScope.find((target) => target.bodyName === 'Neptune');
    expect(neptuneScope).toBeDefined();
    expect(neptuneScope.instrumentAffinity).toContain('Necessario');
  });
});
