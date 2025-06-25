// src/lib/astro-symbols.ts

export const ZODIAC_SYMBOLS: { [key: string]: string } = {
  Ari: 'M 50 10 L 50 90 M 20 60 L 80 60', // Aries (Placeholder)
  Tau: 'M 20 50 C 20 30, 80 30, 80 50 L 80 70 M 50 70 L 50 90', // Taurus (Placeholder)
  Gem: 'M 20 30 L 80 70 M 80 30 L 20 70', // Gemini (Placeholder)
  Can: 'M 30 70 C 10 50, 10 30, 30 10 C 50 30, 50 50, 30 70 M 70 70 C 50 50, 50 30, 70 10 C 90 30, 90 50, 70 70', // Cancer (Placeholder)
  Leo: 'M 50 90 C 70 70, 70 50, 50 30 C 30 50, 30 70, 50 90 M 50 30 L 70 10', // Leo (Placeholder)
  Vir: 'M 30 10 L 30 90 M 70 10 L 70 90 M 30 50 L 70 50', // Virgo (Placeholder)
  Lib: 'M 20 50 L 80 50 M 30 70 L 70 70 M 40 30 L 60 30', // Libra (Placeholder)
  Sco: 'M 20 40 L 80 40 M 30 60 L 70 60 M 50 80 L 50 20', // Scorpio (Placeholder)
  Sag: 'M 50 10 L 50 90 M 20 40 L 80 40', // Sagittarius (Placeholder)
  Cap: 'M 20 80 C 20 60, 40 60, 40 40 C 40 20, 60 20, 60 40 C 60 60, 80 60, 80 40', // Capricorn (Placeholder)
  Aqu: 'M 20 40 L 80 40 M 20 60 L 80 60', // Aquarius (Placeholder)
  Pis: 'M 20 50 L 80 50 M 50 20 L 50 80', // Pisces (Placeholder)
};

export const PLANET_SYMBOLS: { [key: string]: string } = {
  Sun: 'M 50 20 C 70 20, 80 30, 80 50 C 80 70, 70 80, 50 80 C 30 80, 20 70, 20 50 C 20 30, 30 20, 50 20 M 50 30 L 50 70 M 30 50 L 70 50', // Sun (Placeholder)
  Moon: 'M 70 30 C 70 10, 30 10, 30 30 C 30 50, 50 70, 70 90 L 70 30 Z', // Moon (Placeholder)
  Mercury: 'M 50 10 C 30 10, 30 30, 50 50 C 70 50, 70 30, 50 10 M 20 70 L 80 70 M 50 50 L 50 90', // Mercury (Placeholder)
  Venus: 'M 50 10 L 50 60 M 30 40 L 70 40 M 50 70 C 30 70, 20 80, 20 90 C 20 90, 80 90, 80 90 C 80 80, 70 70, 50 70', // Venus (Placeholder)
  Mars: 'M 20 80 L 80 20 M 20 20 C 20 40, 40 40, 40 20 M 60 80 C 60 60, 80 60, 80 80', // Mars (Placeholder)
  Jupiter: 'M 50 10 L 50 90 M 30 40 L 70 40 M 40 70 L 60 70', // Jupiter (Placeholder)
  Saturn: 'M 20 50 L 80 50 M 30 70 L 70 70 M 40 30 L 60 30', // Saturn (Placeholder)
  Uranus: 'M 50 10 C 30 10, 20 30, 20 50 L 20 70 M 80 70 L 80 50 C 80 30, 70 10, 50 10 M 50 30 L 50 90', // Uranus (Placeholder)
  Neptune: 'M 20 20 L 80 80 M 80 20 L 20 80 M 50 50 C 70 50, 70 70, 50 70 C 30 70, 30 50, 50 50', // Neptune (Placeholder)
  Pluto: 'M 20 20 L 80 80 M 80 20 L 20 80', // Pluto (Placeholder)
  Ascendant: 'M 50 10 L 50 90 M 20 60 L 80 60', // Ascendant (same as Aries for now, adjust later)
  Medium_Coeli: 'M 50 10 L 50 90 M 20 60 L 80 60', // Midheaven (same as Aries for now, adjust later)
};

// These are simplified placeholder SVGs. For a production app,
// you would use more accurate/aesthetic designs or an astrological font.
// Example of a proper path for Sun: 'M50,0 C22.386,0,0,22.386,0,50 C0,77.614,22.386,100,50,100 C77.614,100,100,77.614,100,50 C100,22.386,77.614,0,50,0 M50,22.5 L50,77.5 M22.5,50 L77.5,50'