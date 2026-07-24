import { describe, it, expect } from 'vitest';
import { TRANSLATIONS } from '../../src/i18n/translations.js';

describe('i18nTranslationsModule', () => {
  it('contiene le traduzioni per i 5 testi in italiano e francese', () => {
    expect(TRANSLATIONS.it).toBeDefined();
    expect(TRANSLATIONS.fr).toBeDefined();
    expect(Object.keys(TRANSLATIONS.it).sort()).toEqual(Object.keys(TRANSLATIONS.fr).sort());

    expect(TRANSLATIONS.it.labelDate).toBe("Scegli la data dell'osservazione:");
    expect(TRANSLATIONS.fr.labelDate).toBe("Choisissez la date d'observation :");

    expect(TRANSLATIONS.it.headerPlan).toBe("🚀 Piano della Serata d'Osservazione");
    expect(TRANSLATIONS.fr.headerPlan).toBe("🚀 Plan de la soirée d'observation");
  });
});
