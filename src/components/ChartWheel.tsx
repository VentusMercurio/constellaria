// src/components/ChartWheel.tsx
import React from 'react';
import { ZODIAC_SYMBOLS, PLANET_SYMBOLS } from '@/lib/astro-symbols';
// Import types from the new central file
import { AstrologicalPoint, NatalChartDetails } from '@/types/astrology'; // Adjust path if needed

// --- NO NEED TO REDEFINE INTERFACES HERE ANYMORE ---

interface ChartWheelProps {
  chartData: NatalChartDetails;
  size?: number; // Diameter of the SVG, default to 400
}

const ChartWheel: React.FC<ChartWheelProps> = ({ chartData, size = 400 }) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const outerRadius = size / 2 - 20; // Margin for text/symbols
  const innerRadius = outerRadius * 0.6; // Inner circle for planets
  // const houseCuspRadius = outerRadius * 0.75; // Not directly used for drawing house lines
  const planetOrbitRadius = (outerRadius + innerRadius) / 2; // Midpoint for planet symbols

  // Helper to convert longitude (0-360) to SVG angle (0-360, but starts from right, goes clockwise)
  const getSvgAngle = (longitude: number) => {
    return 180 - longitude; // Adjust for SVG's coordinate system and astrological conventions
  };

  // Helper to get X, Y coordinates on a circle
  const getCoordinates = (angleDegrees: number, radius: number) => {
    const angleRadians = (angleDegrees - 90) * Math.PI / 180; // Adjust for SVG's 0-degree being "east"
    return {
      x: centerX + radius * Math.cos(angleRadians),
      y: centerY + radius * Math.sin(angleRadians),
    };
  };

  // Zodiac sign definitions (static positions for the outer ring)
  const zodiacSigns = [
    { name: 'Ari', startLong: 0, endLong: 30 }, { name: 'Tau', startLong: 30, endLong: 60 },
    { name: 'Gem', startLong: 60, endLong: 90 }, { name: 'Can', startLong: 90, endLong: 120 },
    { name: 'Leo', startLong: 120, endLong: 150 }, { name: 'Vir', startLong: 150, endLong: 180 },
    { name: 'Lib', startLong: 180, endLong: 210 }, { name: 'Sco', startLong: 210, endLong: 240 },
    { name: 'Sag', startLong: 240, endLong: 270 }, { name: 'Cap', startLong: 270, endLong: 300 },
    { name: 'Aqu', startLong: 300, endLong: 330 }, { name: 'Pis', startLong: 330, endLong: 360 },
  ];

  // Function to calculate midpoint angle for zodiac symbol placement
  const getMidpointAngle = (start: number, end: number) => {
    let mid = (start + end) / 2;
    if (end === 360 && start === 330) { // Special case for Pisces crossing 360/0
      mid = 345;
    }
    return getSvgAngle(mid);
  };

  // Function to format house names (can be moved to a common utility if needed elsewhere)
  const formatHouseName = (house: string | null | undefined): string => {
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
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="bg-gray-900 rounded-full shadow-2xl border border-gray-700">
      {/* Outer chart circle */}
      <circle cx={centerX} cy={centerY} r={outerRadius} fill="none" stroke="#4B5563" strokeWidth="1" />

      {/* Zodiac Signs and Labels */}
      {zodiacSigns.map((sign, index) => {
        const startAngle = getSvgAngle(sign.startLong);
        const endAngle = getSvgAngle(sign.endLong);
        const midAngle = getMidpointAngle(sign.startLong, sign.endLong);

        const textCoords = getCoordinates(midAngle, outerRadius + 10); // Slightly outside for labels

        return (
          <g key={sign.name}>
            {/* Sector lines for zodiac signs (optional, for visual separation) */}
            <line
              x1={centerX} y1={centerY}
              x2={getCoordinates(startAngle, outerRadius).x}
              y2={getCoordinates(startAngle, outerRadius).y}
              stroke="#4B5563" strokeWidth="0.5"
            />
            {/* Zodiac Symbol */}
            {ZODIAC_SYMBOLS[sign.name] && (
              <g transform={`translate(${textCoords.x - 12} ${textCoords.y - 12}) scale(0.24)`} fill="#F9A8D4">
                <path d={ZODIAC_SYMBOLS[sign.name]} />
              </g>
            )}
          </g>
        );
      })}

      {/* Inner chart circle (for planet placement area) */}
      <circle cx={centerX} cy={centerY} r={innerRadius} fill="none" stroke="#4B5563" strokeWidth="1" />

      {/* House Cusps */}
      {chartData.houseCusps.map((cusp, index) => {
        const cuspAngle = getSvgAngle(cusp.longitude);
        const startCoords = getCoordinates(cuspAngle, innerRadius);
        const endCoords = getCoordinates(cuspAngle, outerRadius); // Extend to outer ring
        const labelCoords = getCoordinates(cuspAngle, outerRadius * 0.9); // Inside outer ring for numbers

        return (
          <g key={cusp.name}>
            {/* Cusp line */}
            <line x1={startCoords.x} y1={startCoords.y} x2={endCoords.x} y2={endCoords.y}
                  stroke="#60A5FA" strokeWidth="1.5" />
            {/* House Number Label */}
            <text
              x={labelCoords.x} y={labelCoords.y}
              dominantBaseline="middle" textAnchor="middle"
              fontSize="12" fill="#D1D5DB"
              transform={`rotate(${cuspAngle + 90}, ${labelCoords.x}, ${labelCoords.y})`} // Rotate text
            >
              {index + 1}
            </text>
          </g>
        );
      })}

      {/* Planets and Angles (Ascendant, Midheaven) */}
      {[...chartData.planets, chartData.ascendant, chartData.midheaven].filter(Boolean).map((obj, index) => {
        const objAngle = getSvgAngle(obj.longitude);
        const symbolCoords = getCoordinates(objAngle, planetOrbitRadius); // All on one orbit for now
        const textOffset = 20; // Offset for text relative to symbol
        const textCoords = getCoordinates(objAngle, planetOrbitRadius + textOffset);

        const symbolKey = obj.name === 'Ascendant' ? 'Ascendant' : obj.name === 'Medium_Coeli' ? 'Medium_Coeli' : obj.name;

        return (
          <g key={`${obj.name}-${index}`}>
            {PLANET_SYMBOLS[symbolKey] && (
              <g transform={`translate(${symbolCoords.x - 15} ${symbolCoords.y - 15}) scale(0.3)`} fill="#EC4899">
                <path d={PLANET_SYMBOLS[symbolKey]} />
              </g>
            )}
            <text
              x={textCoords.x} y={textCoords.y}
              dominantBaseline="middle" textAnchor="middle"
              fontSize="10" fill="#D1D5DB"
              // Optional: rotate degrees text if needed
              // transform={`rotate(${objAngle + 90}, ${textCoords.x}, ${textCoords.y})`}
            >
              {obj.formattedPosition.split(' ')[0]}
              {obj.isRetrograde && <tspan fill="#EF4444">(R)</tspan>}
            </text>
          </g>
        );
      })}

      {/* Center dot/label (optional) */}
      <circle cx={centerX} cy={centerY} r="5" fill="#EC4899" />
    </svg>
  );
};

export default ChartWheel;