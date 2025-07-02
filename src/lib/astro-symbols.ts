// src/lib/astro-symbols.ts

// A common viewBox for glyphs, adjust if your SVGs use a different internal coordinate system
// e.g., if your SVGs are 100x100, use viewBox="0 0 100 100"
export const GLYPH_VIEWBOX = "0 0 50 50"; // Standardized viewBox for simple glyph SVGs

// Zodiac Sign Glyphs (12 total)
export const ZODIAC_GLYPHS: { [key: string]: string } = {
  // Replace these example paths with your actual extracted 'd' attributes
  // Ensure the keys (e.g., 'Ari', 'Tau') match what your Kerykeion data uses for signs
  Ari: "M 143.265625 143.265625 L 606.765625 143.265625 L 606.765625 606.765625 L 143.265625 606.765625 Z M 143.265625 143.265625 ", // Placeholder Aries
  Tau: "M 134 122.164062 L 623.511719 122.164062 L 623.511719 611.914062 L 134 611.914062 Z M 134 122.164062 ", // Placeholder Taurus
  Gem: "M 143.265625 143.265625 L 606.765625 143.265625 L 606.765625 606.765625 L 143.265625 606.765625 Z M 143.265625 143.265625 ", // Placeholder Gemini
  Can: "M 143.265625 143.265625 L 606.765625 143.265625 L 606.765625 606.765625 L 143.265625 606.765625 Z M 143.265625 143.265625 ", // Placeholder Cancer
  Leo: "M 143.265625 143.265625 L 606.765625 143.265625 L 606.765625 606.765625 L 143.265625 606.765625 Z M 143.265625 143.265625 ", // Placeholder Leo
  Vir: "M 143.265625 143.265625 L 606.765625 143.265625 L 606.765625 606.765625 L 143.265625 606.765625 Z M 143.265625 143.265625 ", // Placeholder Virgo
  Lib: "M 143.265625 143.265625 L 606.765625 143.265625 L 606.765625 606.765625 L 143.265625 606.765625 Z M 143.265625 143.265625 ", // Placeholder Libra
  Sco: "M 221 143.265625 L 529.605469 143.265625 L 529.605469 606.765625 L 221 606.765625 Z M 221 143.265625 ", // Placeholder Scorpio
  Sag: "M 143.265625 143.265625 L 606.765625 143.265625 L 606.765625 606.765625 L 143.265625 606.765625 Z M 143.265625 143.265625 ", // Placeholder Sagittarius
  Cap: "M 186.339844 141 L 541 141 L 541 673 L 186.339844 673 Z M 186.339844 141 ", // Placeholder Capricorn
  Aqu: "M 143.265625 143.265625 L 606.765625 143.265625 L 606.765625 606.765625 L 143.265625 606.765625 Z M 143.265625 143.265625", // Placeholder Aquarius
  Pis: "M 219 135 L 573.5625 135 L 573.5625 667 L 219 667 Z M 219 135 ", // Placeholder Pisces
};

// Planetary Glyphs (10 total)
export const PLANET_GLYPHS: { [key: string]: string } = {
  // Replace these example paths with your actual extracted 'd' attributes
  // Ensure the keys (e.g., 'Sun', 'Moon') match what your Kerykeion data uses for planet names
  Sun: "M 143.265625 143.265625 L 606.765625 143.265625 L 606.765625 606.765625 L 143.265625 606.765625 Z M 143.265625 143.265625 ", // Placeholder Sun
  Moon: "M 164.261719 75 L 585.761719 75 L 585.761719 707 L 164.261719 707 Z M 164.261719 75 ", // Placeholder Moon
  Mercury: "M 197.242188 171 L 660.742188 171 L 660.742188 634 L 197.242188 634 Z M 197.242188 171 ", // Placeholder Mercury
  Venus: "M 121.246094 165 L 584.746094 165 L 584.746094 628 L 121.246094 628 Z M 121.246094 165 ", // Placeholder Venus
  Mars: "M 143.265625 143.265625 L 606.765625 143.265625 L 606.765625 606.765625 L 143.265625 606.765625 Z M 143.265625 143.265625 ", // Placeholder Mars
  Jupiter: "M 140 56.019531 L 565 56.019531 L 565 694 L 140 694 Z M 140 56.019531 ", // Placeholder Jupiter
  Saturn: "M 166.089844 160 L 629.589844 160 L 629.589844 623 L 166.089844 623 Z M 166.089844 160 ", // Placeholder Saturn
  Uranus: "M 25 5 C 15 5, 10 15, 10 25 L 10 35 M 40 35 L 40 25 C 40 15, 35 5, 25 5 M 25 15 L 25 45", // Placeholder Uranus
  Neptune: "M 143.265625 143.265625 L 606.765625 143.265625 L 606.765625 606.765625 L 143.265625 606.765625 Z M 143.265625 143.265625 ", // Placeholder Neptune
  Pluto: "M 111.3125 176.261719 L 695.5625 176.261719 L 695.5625 750 L 111.3125 750 Z M 111.3125 176.261719 ", // Placeholder Pluto
  // For angles, reuse planet glyphs or create simple ones if desired
  Ascendant: "M 25 5 L 25 45 M 10 30 L 40 30", // Placeholder (same as Aries for now)
  Medium_Coeli: "M 25 5 L 25 45 M 10 30 L 40 30", // Placeholder (same as Aries for now)
};

// You'll also need a retrograde symbol. If you have one, add it here.
export const RETROGRADE_GLYPH: string = "M25 5 L25 45 M15 15 L35 15 L35 25 L15 25 Z"; // Placeholder R