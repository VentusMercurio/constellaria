// src/components/PlanetList.tsx
import React from 'react';
// Import types from the new central file
import { AstrologicalPoint } from '@/types/astrology'; // Adjust path if needed

// --- NO NEED TO REDEFINE INTERFACE HERE ANYMORE ---

interface PlanetListProps {
  planets: AstrologicalPoint[];
}

// Helper to format house names (can be moved to a common utility)
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
  return `${suffixMap[houseNumber] || houseNumber} ${parts[1]}`;
}


const PlanetList: React.FC<PlanetListProps> = ({ planets }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 text-left">
      <h2 className="font-serif text-2xl text-amber-400 mb-4">Planetary Positions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-gray-300">
        {planets.map((planet) => (
          <div key={planet.name} className="flex items-center space-x-2">
            <span className="font-bold w-24 text-lg text-fuchsia-300">{planet.name}:</span>
            <span className="flex-1 text-lg">
              {planet.formattedPosition} {planet.isRetrograde ? <span className="text-red-400">(R)</span> : ''}
              {planet.house && ` in ${formatHouseName(planet.house)}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanetList;