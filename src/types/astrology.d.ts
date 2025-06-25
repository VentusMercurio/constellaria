// src/types/astrology.d.ts (or .ts, if you prefer)

// Define the AstrologicalPoint interface
export interface AstrologicalPoint {
  name: string;
  longitude: number;
  sign: string;
  degreeInSign: number;
  formattedPosition: string;
  house?: string; // CORRECTED: This should be 'string' to match "Ninth_House"
  isRetrograde?: boolean;
}

// Define the NatalChartDetails interface
export interface NatalChartDetails {
  birthDateTimeUTC: string;
  latitude: number;
  longitude: number;
  ascendant: AstrologicalPoint;
  midheaven: AstrologicalPoint;
  houseCusps: AstrologicalPoint[];
  planets: AstrologicalPoint[];
  // If your JSON has other top-level properties like aspects, add them here
  // aspects?: Aspect[]; // Example if you add aspects later
}

// If you have other specific types, like for aspects, you'd define them here too
// export interface Aspect {
//   planet1: string;
//   planet2: string;
//   type: string; // e.g., "Conjunction", "Trine"
//   orb: number;
// }