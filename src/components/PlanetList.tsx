// src/components/PlanetList.tsx
import React from 'react';
import { AstrologicalPoint } from '@/types/astrology';

interface PlanetListProps {
  planets: AstrologicalPoint[];
}

// Helper to format house names (from "Ninth_House" to "9th House")
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
  return `${suffixMap[houseNumber] || houseNumber} House`; // Added " House" to match mockup
}

// Function to get short sign name (e.g., "Lib", "Can") or full if needed
const getShortSign = (sign: string): string => {
    switch(sign) {
        case 'Ari': return 'Ari';
        case 'Tau': return 'Tau';
        case 'Gem': return 'Gem';
        case 'Can': return 'Can';
        case 'Leo': return 'Leo';
        case 'Vir': return 'Vir';
        case 'Lib': return 'Lib';
        case 'Sco': return 'Sco';
        case 'Sag': return 'Sag';
        case 'Cap': return 'Cap';
        case 'Aqu': return 'Aqu';
        case 'Pis': return 'Pis';
        default: return sign; // Fallback
    }
}


const PlanetList: React.FC<PlanetListProps> = ({ planets }) => {
    // Separate planets into two columns (simple split for 10 planets: 5 per column)
    const leftColumnPlanets = planets.slice(0, 5);
    const rightColumnPlanets = planets.slice(5, 10);

  return (
    <div className="text-gray-300 font-serif text-lg"> {/* Base styling for the list */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-4"> {/* Two column grid */}
            
            {/* Left Column */}
            <div className="flex flex-col space-y-4">
                {leftColumnPlanets.map((planet) => (
                    <div key={planet.name}>
                        <p className="font-bold text-amber-400">{planet.name}</p>
                        <p>{planet.formattedPosition} {planet.isRetrograde ? <span className="text-red-400">(R)</span> : ''}</p>
                        <p>{getShortSign(planet.sign)}</p>
                        <p>{planet.house ? formatHouseName(planet.house) : ''}</p>
                    </div>
                ))}
            </div>

            {/* Right Column */}
            <div className="flex flex-col space-y-4">
                {rightColumnPlanets.map((planet) => (
                    <div key={planet.name}>
                        <p className="font-bold text-amber-400">{planet.name}</p>
                        <p>{planet.formattedPosition} {planet.isRetrograde ? <span className="text-red-400">(R)</span> : ''}</p>
                        <p>{getShortSign(planet.sign)}</p>
                        <p>{planet.house ? formatHouseName(planet.house) : ''}</p>
                    </div>
                ))}
            </div>
        </div>
        
        {/* You may want to add Ascendant/Midheaven/House Cusps in similar styled sections */}
        {/* For now, just focus on planets as per the immediate request */}
    </div>
  );
};

export default PlanetList;