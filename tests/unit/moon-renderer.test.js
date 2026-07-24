import { describe, it, expect } from 'vitest';
import { createMoonSvg } from '../../src/ui/components/moon-renderer.js';

describe('moonRendererComponent', () => {
  it('genera correttamente il frammento SVG per la Luna Crescente (0-180deg)', () => {
    const svgCrescent = createMoonSvg(45, 95);
    expect(svgCrescent).toContain('svg');
    expect(svgCrescent).toContain('moon-phase-overlay');
  });

  it('genera correttamente il frammento SVG per il Primo Quarto (90deg)', () => {
    const svgQuarter = createMoonSvg(90, 95);
    expect(svgQuarter).toContain('svg');
  });

  it('genera correttamente il frammento SVG per la Luna Piena (180deg)', () => {
    const svgFull = createMoonSvg(180, 95);
    expect(svgFull).toContain('svg');
  });
});
