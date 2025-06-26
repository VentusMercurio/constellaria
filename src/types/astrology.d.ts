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

// New interface for the joined user profile and auth.users data
export interface UserProfileWithEmail {
  id: string;
  sun_sign: string;
  users: {
    email: string | null;
  } | null; // This represents the joined 'users' object, which can be null if no email is linked
}

// Updated interface for the joined user profile and auth.users data via the view
export interface UserProfileWithEmail {
  id: string;
  sun_sign: string;
  // Change 'users' to 'auth_users_emails_view' to match the view's name
  auth_users_emails_view: {
    email: string | null;
  } | null;
}

// If you have other specific types, like for aspects, you'd define them here too
// export interface Aspect {
//   planet1: string;
//   planet2: string;
//   type: string; // e.g., "Conjunction", "Trine"
//   orb: number;
// }