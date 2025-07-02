// src/lib/astro-symbols.ts

// We no longer need GLYPH_VIEWBOX, as glyphs are loaded as image files with their own viewbox.
// export const GLYPH_VIEWBOX = "0 0 50 50"; // Can remove or comment out

// Zodiac Sign Glyph File Paths (12 total)
export const ZODIAC_GLYPH_PATHS: { [key: string]: string } = {
  // IMPORTANT: Ensure these keys match your Kerykeion data for signs (e.g., 'Ari', 'Tau')
  // IMPORTANT: Ensure these values match the EXACT filenames in public/images/astro-glyphs/
  Ari: '/images/astro-glyphs/aries.svg', // Example filename
  Tau: '/images/astro-glyphs/taurus.svg',
  Gem: '/images/astro-glyphs/gemini.svg',
  Can: '/images/astro-glyphs/cancer.svg',
  Leo: '/images/astro-glyphs/leo.svg',
  Vir: '/images/astro-glyphs/virgo.svg',
  Lib: '/images/astro-glyphs/libra.svg',
  Sco: '/images/astro-glyphs/scorpio.svg',
  Sag: '/images/astro-glyphs/sagittarius.svg',
  Cap: '/images/astro-glyphs/capricorn.svg',
  Aqu: '/images/astro-glyphs/aquarius.svg',
  Pis: '/images/astro-glyphs/pisces.svg',
};

// Planetary Glyph File Paths (10 total, plus angles)
export const PLANET_GLYPH_PATHS: { [key: string]: string } = {
  // IMPORTANT: Ensure these keys match your Kerykeion data for planet names (e.g., 'Sun', 'Moon')
  // IMPORTANT: Ensure these values match the EXACT filenames in public/images/astro-glyphs/
  Sun: '/images/astro-glyphs/sun.svg', // Example filename
  Moon: '/images/astro-glyphs/moon.svg',
  Mercury: '/images/astro-glyphs/mercury.svg',
  Venus: '/images/astro-glyphs/venus.svg',
  Mars: '/images/astro-glyphs/mars.svg',
  Jupiter: '/images/astro-glyphs/jupiter.svg',
  Saturn: '/images/astro-glyphs/saturn.svg',
  Uranus: '/images/astro-glyphs/uranus.svg',
  Neptune: '/images/astro-glyphs/neptune.svg',
  Pluto: '/images/astro-glyphs/pluto.svg',
  Ascendant: '/images/astro-glyphs/ascendant.svg', // Example for Ascendant glyph
  Medium_Coeli: '/images/astro-glyphs/mc.svg', // Example for Midheaven glyph
};

// Retrograde Symbol File Path
export const RETROGRADE_GLYPH_PATH: string = '/images/astro-glyphs/retrograde.svg'; // Example filename