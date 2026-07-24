import { describe, it, expect } from 'vitest';
import {
  isValidLatitude,
  isValidLongitude,
  validateObserverCoordinates,
} from '../../src/astronomy/coordinates.js';

describe('coordinatesValidation', () => {
  it('valida latitudini corrette e rifiuta quelle fuori limite', () => {
    expect(isValidLatitude(41.9)).toBe(true);
    expect(isValidLatitude(-90)).toBe(true);
    expect(isValidLatitude(90)).toBe(true);
    expect(isValidLatitude(100)).toBe(false);
    expect(isValidLatitude(-95)).toBe(false);
  });

  it('valida longitudini corrette e rifiuta quelle fuori limite', () => {
    expect(isValidLongitude(12.5)).toBe(true);
    expect(isValidLongitude(-180)).toBe(true);
    expect(isValidLongitude(180)).toBe(true);
    expect(isValidLongitude(200)).toBe(false);
  });

  it('validateObserverCoordinates restituisce oggetto observer valido', () => {
    const res = validateObserverCoordinates(41.9, 12.5);
    expect(res.valid).toBe(true);
    expect(res.observer.latitudeDeg).toBe(41.9);
  });

  it('restituisce un codice traducibile per coordinate non valide', () => {
    expect(validateObserverCoordinates(91, 12.5)).toEqual({
      valid: false,
      errorCode: 'invalidLatitude',
    });
  });
});
