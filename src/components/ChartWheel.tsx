// src/components/ChartWheel.tsx
import React from 'react';
import { ZODIAC_GLYPHS, PLANET_GLYPHS, RETROGRADE_GLYPH, GLYPH_VIEWBOX } from '@/lib/astro-symbols';
import { AstrologicalPoint, NatalChartDetails } from '@/types/astrology';

interface ChartWheelProps {
  chartData: NatalChartDetails;
  size?: number; // Diameter of the SVG viewBox and internal coordinate system
}

const ChartWheel: React.FC<ChartWheelProps> = ({ chartData, size = 500 }) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const outerRadius = size / 2 - 20; // Margin for glyphs around the edge
  const innerRadius = outerRadius * 0.4; // Inner boundary for planet glyphs
  const zodiacRingRadius = outerRadius * 0.9; // Where zodiac glyphs will sit
  const planetOrbitRadius = outerRadius * 0.7; // Where planet glyphs will sit
  const houseCuspInnerLineRadius = innerRadius; // Where house lines start (inner circle)
  const houseCuspOuterLineRadius = outerRadius * 0.95; // Where house lines end (near zodiac glyphs)

  // Helper to convert astrological longitude (0-360, Aries at 0, counter-clockwise)
  // to SVG angle (0-360, 0 is right, clockwise).
  const getSvgAngle = (longitude: number) => {
    // 0 Aries (left) = 180 deg SVG
    // Angle increases counter-clockwise in astrology, but clockwise in SVG.
    // So, we use 180 - longitude to flip and adjust origin.
    return 180 - longitude;
  };

  // Helper to get X, Y coordinates on a circle based on SVG angle and radius
  const getCoordinates = (angleDegrees: number, radius: number) => {
    // Adjust for SVG's 0-degree being "east" (3 o'clock)
    // and standard trigonometric functions expecting 0 to be "east" and increasing counter-clockwise.
    const angleRadians = (angleDegrees) * Math.PI / 180;
    return {
      x: centerX + radius * Math.cos(angleRadians),
      y: centerY - radius * Math.sin(angleRadians), // Y is inverted in SVG (positive is down)
    };
  };

  // Function to format house names (from "Ninth_House" to "9th House")
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

  // House Number placement logic (simplified: place them slightly outside the cusps)
  const getHouseNumberCoords = (cuspLongitude: number) => {
    const angle = getSvgAngle(cuspLongitude);
    return getCoordinates(angle, houseCuspOuterLineRadius + 15); // Adjust 15 for desired distance
  };

  return (
    // The SVG container. It's transparent and overlays the base image.
    <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 pointer-events-none z-[-1]">
      {/* Optional: Debugging circles to check radii and center */}
      {/* <circle cx={centerX} cy={centerY} r={outerRadius} stroke="red" strokeWidth="1" fill="none" />
      <circle cx={centerX} cy={centerY} r={innerRadius} stroke="blue" strokeWidth="1" fill="none" /> */}

      {/* --- Zodiac Sign Glyphs (Dynamic) --- */}
      {/* Each sign spans 30 degrees. We'll place glyphs at the midpoint of each sign. */}
      {Object.keys(ZODIAC_GLYPHS).map((signName, index) => {
        const signStartLong = index * 30; // 0 for Aries, 30 for Taurus, etc.
        const signMidLong = signStartLong + 15; // Midpoint of the sign
        const glyphAngle = getSvgAngle(signMidLong);
        const glyphCoords = getCoordinates(glyphAngle, zodiacRingRadius);
        const glyphSize = 30; // Size of the glyph SVG (e.g., 50x50 viewBox)

        return (
          <g
            key={signName}
            transform={`translate(${glyphCoords.x - glyphSize / 2}, ${glyphCoords.y - glyphSize / 2})`}
            className="pointer-events-auto cursor-help" // Make glyphs interactive (optional)
          >
            <svg x="0" y="0" width={glyphSize} height={glyphSize} viewBox={GLYPH_VIEWBOX} fill="#F9A8D4"> {/* Set your desired color */}
              <path d={ZODIAC_GLYPHS[signName]} />
            </svg>
          </g>
        );
      })}

      {/* --- House Cusps --- */}
      {chartData.houseCusps.map((cusp, index) => {
        const cuspAngle = getSvgAngle(cusp.longitude);
        const startCoords = getCoordinates(cuspAngle, houseCuspInnerLineRadius);
        const endCoords = getCoordinates(cuspAngle, houseCuspOuterLineRadius);
        const labelCoords = getHouseNumberCoords(cusp.longitude); // Position for house number

        return (
          <g key={cusp.name}>
            {/* House Line */}
            <line x1={centerX} y1={centerY} x2={endCoords.x} y2={endCoords.y}
                  stroke="#60A5FA" strokeWidth="1.5" /> {/* Color and thickness of house lines */}

            {/* House Number (1-12) - positioned on the outer edge, rotated for readability */}
            <text
              x={labelCoords.x} y={labelCoords.y}
              dominantBaseline="middle" textAnchor="middle"
              fontSize="16" fill="#D1D5DB" // Color for house numbers
              transform={`rotate(${cuspAngle + 90}, ${labelCoords.x}, ${labelCoords.y})`} // Rotate text to align with wheel
              className="pointer-events-auto" // Optional: make text interactive
            >
              {index + 1}
            </text>
          </g>
        );
      })}

      {/* --- Planet Glyphs and Angles (Ascendant, Midheaven) --- */}
      {[...chartData.planets, chartData.ascendant, chartData.midheaven].filter(Boolean).map((obj, index) => {
        const glyphAngle = getSvgAngle(obj.longitude);
        const glyphCoords = getCoordinates(glyphAngle, planetOrbitRadius);
        const glyphSize = 30; // Size for planet/angle glyph SVG
        const textOffset = 25; // Distance for degree text from glyph
        const textCoords = getCoordinates(glyphAngle, planetOrbitRadius + textOffset);

        const glyphName = obj.name === 'Ascendant' ? 'Ascendant' : obj.name === 'Medium_Coeli' ? 'Medium_Coeli' : obj.name;
        const glyphPath = PLANET_GLYPHS[glyphName];

        if (!glyphPath) {
            console.warn(`Missing glyph path for: ${glyphName}`);
            return null; // Skip if glyph not found
        }

        return (
          <g
            key={`${obj.name}-${index}`}
            transform={`translate(${glyphCoords.x - glyphSize / 2}, ${glyphCoords.y - glyphSize / 2})`}
            className="pointer-events-auto cursor-help" // Make glyphs interactive (optional)
          >
            {/* Planet/Angle Glyph */}
            <svg x="0" y="0" width={glyphSize} height={glyphSize} viewBox={GLYPH_VIEWBOX} fill="#EC4899"> {/* Set desired color */}
              <path d={glyphPath} />
            </svg>

            {/* Degree and Sign Text */}
            <text
              x={glyphCoords.x - glyphSize / 2} // Relative to glyph group's origin
              y={glyphCoords.y - glyphSize / 2}
              dominantBaseline="middle" textAnchor="middle"
              fontSize="14" fill="#D1D5DB" // Color for degree text
              // Position relative to glyph, adjust based on desired layout
              transform={`translate(${textOffset * Math.cos(glyphAngle * Math.PI / 180)}, ${-textOffset * Math.sin(glyphAngle * Math.PI / 180)}) rotate(${glyphAngle + 90}, ${glyphCoords.x - glyphSize / 2}, ${glyphCoords.y - glyphSize / 2})`} // Rotate with wheel
              className="pointer-events-auto"
            >
              {obj.formattedPosition.split(' ')[0]} {/* e.g., "23.12°" */}
              {obj.isRetrograde && (
                <tspan dx="2" fill="#EF4444"> {/* Small horizontal offset for R */}
                  <svg x="0" y="0" width="10" height="10" viewBox={GLYPH_VIEWBOX} fill="#EF4444"> {/* Smaller R glyph */}
                    <path d={RETROGRADE_GLYPH} />
                  </svg>
                </tspan>
              )}
            </text>
          </g>
        );
      })}

      {/* Central point */}
      <circle cx={centerX} cy={centerY} r="5" fill="#ecc94b" className="z-20 pointer-events-none" /> {/* Golden center dot */}
    </svg>
  );
};

export default ChartWheel;