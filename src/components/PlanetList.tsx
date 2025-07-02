// src/components/PlanetList.tsx
import React from 'react';
import Image from 'next/image'; // For glyphs inside the list
import { AstrologicalPoint } from '@/types/astrology'; // Make sure this path is correct
import { PLANET_GLYPH_PATHS } from '@/lib/astro-symbols'; // Import glyph paths

interface PlanetListProps {
  planets: AstrologicalPoint[];
}

function formatHouseName(house: string | null | undefined): string {
  if (!house) return '';
  const parts = house.split('_');
  if (parts.length < 2) return house;
  const houseNumber = parts[0];
  const suffixMap: { [key: string]: string } = {
    'First': '1st', 'Second': '2nd', 'Third': '3rd', 'Fourth': '4th', 'Fifth': '5th',
    'Sixth': '6th', 'Seventh': '7th', 'Eighth': '8th', 'Ninth': '9th', 'Tenth': '10th',
    'Eleventh': '11th', 'Twelfth': '12th'
  };
  return `${suffixMap[houseNumber] || houseNumber} House`;
}

const getShortSign = (sign: string): string => {
    return sign; // Assuming kerykeion returns short forms (Lib, Can, etc.)
}

// Temporary placeholder interpretations for the mockup.
// In a full implementation, these would come from your backend.
const TEMPORARY_INTERPRETATIONS: { [key: string]: string } = {
    "Sun": "Balance and harmony in values",
    "Moon": "Emotional discipline in creativity",
    "Mercury": "Deep and perceptive communication",
    "Venus": "Practicality in social connections",
    "Mars": "Assertive energy and drive",
    "Jupiter": "Expansion and growth in wisdom",
    "Saturn": "Structure and discipline in reality",
    "Uranus": "Innovation and sudden change",
    "Neptune": "Intuition and spiritual connection",
    "Pluto": "Transformation and profound insight",
};


const PlanetList: React.FC<PlanetListProps> = ({ planets }) => {
    const filteredPlanets = planets.filter(p => 
        !['Ascendant', 'Medium_Coeli'].includes(p.name)
    );

    const leftColumnPlanets = filteredPlanets.slice(0, 5);
    const rightColumnPlanets = filteredPlanets.slice(5, 10);

  return (
    <div className="text-gray-300 font-serif text-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"> {/* Use md:grid-cols-2 for desktop */}
            
            {/* Left Column */}
            <div className="flex flex-col space-y-6">
                {leftColumnPlanets.map((planet) => (
                    <div key={planet.name} className="relative p-4 rounded-lg border border-amber-400 bg-gray-900 bg-opacity-70 shadow-md flex items-start space-x-3">
                        {/* Planet Glyph */}
                        <Image
                            src={PLANET_GLYPH_PATHS[planet.name] || ''} // Provide fallback empty string if path is missing
                            alt={`${planet.name} Glyph`}
                            width={32} // Adjust size for list
                            height={32}
                            className="object-contain flex-shrink-0"
                            unoptimized
                        />
                        <div className="flex flex-col text-left">
                            <p className="font-bold text-amber-400 text-xl leading-tight tracking-wide">{planet.name}</p>
                            <p className="text-gray-300 text-base leading-tight">{planet.formattedPosition} {getShortSign(planet.sign)}</p>
                            <p className="text-gray-300 text-base leading-tight">{planet.house ? formatHouseName(planet.house) : ''}</p>
                            <p className="text-gray-400 text-sm mt-1 leading-tight">{TEMPORARY_INTERPRETATIONS[planet.name] || 'Cosmic influence unknown'}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Right Column */}
            <div className="flex flex-col space-y-6">
                {rightColumnPlanets.map((planet) => (
                    <div key={planet.name} className="relative p-4 rounded-lg border border-amber-400 bg-gray-900 bg-opacity-70 shadow-md flex items-start space-x-3">
                        {/* Planet Glyph */}
                        <Image
                            src={PLANET_GLYPH_PATHS[planet.name] || ''}
                            alt={`${planet.name} Glyph`}
                            width={32}
                            height={32}
                            className="object-contain flex-shrink-0"
                            unoptimized
                        />
                        <div className="flex flex-col text-left">
                            <p className="font-bold text-amber-400 text-xl leading-tight tracking-wide">{planet.name}</p>
                            <p className="text-gray-300 text-base leading-tight">{planet.formattedPosition} {getShortSign(planet.sign)}</p>
                            <p className="text-gray-300 text-base leading-tight">{planet.house ? formatHouseName(planet.house) : ''}</p>
                            <p className="text-gray-400 text-sm mt-1 leading-tight">{TEMPORARY_INTERPRETATIONS[planet.name] || 'Cosmic influence unknown'}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default PlanetList;