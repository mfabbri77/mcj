import { describe, it, expect } from 'vitest';
import { getAllPlanetsSummary, getDirectionLabel } from '../../src/astronomy/planets.js';

describe('planetsAstronomyModule', () => {
  it('getDirectionLabel assegna le direzioni cardinali giuste', () => {
    expect(getDirectionLabel(0)).toBe('Nord');
    expect(getDirectionLabel(90)).toBe('Est');
    expect(getDirectionLabel(180)).toBe('Sud');
    expect(getDirectionLabel(270)).toBe('Ovest');
  });

  it("getAllPlanetsSummary posziona prima tutti i pianeti sopra l'orizzonte", () => {
    const list = getAllPlanetsSummary({
      dateString: '2026-07-24',
      timeString: '21:30',
      latitudeDeg: 41.9,
      longitudeDeg: 12.5,
    });

    expect(list.length).toBe(7);

    // Trova l'indice del primo pianeta sotto l'orizzonte
    const firstOfflineIndex = list.findIndex((p) => !p.aboveHorizon);
    if (firstOfflineIndex !== -1) {
      // Verifichiamo che nessun pianeta sopra l'orizzonte venga dopo uno sotto l'orizzonte
      for (let i = firstOfflineIndex; i < list.length; i++) {
        expect(list[i].aboveHorizon).toBe(false);
      }
    }
  });
});
