/**
 * Genera la grafica della Luna usando l'illustrazione reale HD + un overlay SVG
 * che oscura la parte non visibile in base alla fase lunare.
 *
 * La fase lunare (Emisfero Boreale):
 * - Crescente (0°-180°): illuminazione a DESTRA, ombra a SINISTRA.
 * - Calante (180°-360°): illuminazione a SINISTRA, ombra a DESTRA.
 *
 * @param {number} phaseAngleDeg - Angolo di fase lunare (0-360°)
 * @param {number} sizePx - Dimensione in pixel (default 90)
 * @param {string} altText - Testo alternativo localizzato
 * @returns {string} HTML string con immagine + overlay SVG
 */
export function createMoonSvg(phaseAngleDeg, sizePx = 90, altText = 'Luna') {
  const normAngle = ((phaseAngleDeg % 360) + 360) % 360;
  const radius = 50;
  const cx = 50;
  const cy = 50;

  const rad = (normAngle * Math.PI) / 180;
  const cosA = Math.cos(rad);
  const rx = Math.abs(cosA) * radius;

  let shadowPath;

  if (normAngle >= 0 && normAngle < 180) {
    // FASE CRESCENTE: illuminata a DESTRA, ombra a SINISTRA
    if (normAngle < 90) {
      // Crescente iniziale: ombra copre emisfero sinistro + parte del destro
      shadowPath = `M ${cx} ${cy - radius} A ${radius} ${radius} 0 0 0 ${cx} ${cy + radius} A ${rx} ${radius} 0 0 0 ${cx} ${cy - radius}`;
    } else {
      // Gibbosa crescente: ombra copre solo parte dell'emisfero sinistro
      shadowPath = `M ${cx} ${cy - radius} A ${radius} ${radius} 0 0 0 ${cx} ${cy + radius} A ${rx} ${radius} 0 0 1 ${cx} ${cy - radius}`;
    }
  } else {
    // FASE CALANTE: illuminata a SINISTRA, ombra a DESTRA
    if (normAngle < 270) {
      // Gibbosa calante: ombra copre solo parte dell'emisfero destro
      shadowPath = `M ${cx} ${cy - radius} A ${radius} ${radius} 0 0 1 ${cx} ${cy + radius} A ${rx} ${radius} 0 0 0 ${cx} ${cy - radius}`;
    } else {
      // Calante finale: ombra copre emisfero destro + parte del sinistro
      shadowPath = `M ${cx} ${cy - radius} A ${radius} ${radius} 0 0 1 ${cx} ${cy + radius} A ${rx} ${radius} 0 0 1 ${cx} ${cy - radius}`;
    }
  }

  const basePath = import.meta.env.BASE_URL || '/';
  const imgSrc = `${basePath}images/planets/luna.png`;

  return `
    <div class="moon-phase-container" style="width:${sizePx}px; height:${sizePx}px; position:relative; border-radius:50%; overflow:hidden;">
      <img
        src="${imgSrc}"
        alt="${altText}"
        width="${sizePx}"
        height="${sizePx}"
        class="moon-img-graphic"
        style="display:block; border-radius:50%;"
        loading="lazy"
        decoding="async"
      />
      <svg
        width="${sizePx}"
        height="${sizePx}"
        viewBox="0 0 100 100"
        class="moon-phase-overlay"
        style="position:absolute; top:0; left:0;"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <radialGradient id="moonShadowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#050810" stop-opacity="0.92" />
            <stop offset="100%" stop-color="#0a0e18" stop-opacity="0.88" />
          </radialGradient>
        </defs>
        <path d="${shadowPath}" fill="url(#moonShadowGrad)" />
      </svg>
    </div>
  `;
}
