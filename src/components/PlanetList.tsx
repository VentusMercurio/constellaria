// This component contains all logic and data, so it has no external imports.

// --- Data is now directly inside the component ---
const PLANET_GLYPHS: { [key: string]: string } = {
  "Sun": "☉", "Moon": "☽", "Mercury": "☿", "Venus": "♀", "Mars": "♂",
  "Jupiter": "♃", "Saturn": "♄", "Uranus": "♅", "Neptune": "♆", "Pluto": "♇",
};

const PLANET_COLORS: { [key: string]: string } = {
  "Sun": "#FFCA28", "Moon": "#B0BEC5", "Mercury": "#FFA726", "Venus": "#F06292",
  "Mars": "#EF5350", "Jupiter": "#42A5F5", "Saturn": "#8D6E63", "Uranus": "#26C6DA",
  "Neptune": "#29B6F6", "Pluto": "#7E57C2",
};

// --- Interfaces are also defined here ---
interface AstrologicalPoint {
  name: string;
  formattedPosition: string;
  house?: number;
  isRetrograde?: boolean;
}

interface PlanetListProps {
  planets: AstrologicalPoint[];
}

// --- The Main Component ---
export default function PlanetList({ planets }: PlanetListProps) {
  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
      <h2 className="text-center font-serif text-2xl text-fuchsia-400 mb-4">
        Planets
      </h2>
      <div className="space-y-1">
        {/* We map over the planets and render each one directly */}
        {planets.map((planet) => {
          const glyph = PLANET_GLYPHS[planet.name] || '•';
          const color = PLANET_COLORS[planet.name] || '#FFFFFF';

          return (
            <div key={planet.name} className="flex items-center py-2">
              <span className="w-6 text-xl" style={{ color: color }}>
                {glyph}
              </span>
              <div className="flex-grow text-gray-300">
                <span className="font-bold">{planet.name}:</span> {planet.formattedPosition}
                {planet.house && (
                  <span className="ml-2 text-sm text-gray-500">(H{planet.house})</span>
                )}
              </div>
              {planet.isRetrograde && (
                <span className="text-sm font-bold text-red-500">Rx</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}