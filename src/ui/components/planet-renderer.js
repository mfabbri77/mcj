/**
 * Genera la grafica per un pianeta usando le illustrazioni reali HD.
 * L'immagine viene inserita in un contenitore con dimensioni uguali alla grafica SVG precedente.
 *
 * @param {string} bodyName - Nome del corpo celeste in inglese (Jupiter, Mars, ecc.)
 * @param {number} sizePx - Dimensione in pixel (default 90, come le SVG precedenti)
 * @param {string} altText - Testo alternativo localizzato
 * @returns {string} HTML string con l'immagine del pianeta
 */
export function createPlanetSvg(bodyName = 'Jupiter', sizePx = 90, altText = bodyName) {
  const imageMap = {
    mercury: 'mercurio.png',
    mercurio: 'mercurio.png',
    venus: 'venere.png',
    venere: 'venere.png',
    mars: 'marte.png',
    marte: 'marte.png',
    jupiter: 'giove.png',
    giove: 'giove.png',
    saturn: 'saturno.png',
    saturno: 'saturno.png',
    uranus: 'urano.png',
    urano: 'urano.png',
    neptune: 'nettuno.png',
    nettuno: 'nettuno.png',
  };

  const name = bodyName.toLowerCase();
  const fileName = imageMap[name] || 'giove.png';
  const basePath = import.meta.env.BASE_URL || '/';
  const imgSrc = `${basePath}images/planets/${fileName}`;

  return `
    <img
      src="${imgSrc}"
      alt="${altText}"
      width="${sizePx}"
      height="${sizePx}"
      class="planet-img-graphic"
      loading="lazy"
      decoding="async"
    />
  `;
}
