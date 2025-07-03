// src/components/ChartWheel.tsx
import React from 'react';
import Image from 'next/image';
import { AstrologicalPoint, NatalChartDetails } from '@/types/astrology'; // Make sure this path is correct

// Import the glyph file paths and the new sign longitudes
import { PLANET_GLYPH_PATHS, RETROGRADE_GLYPH_PATH, ZODIAC_SIGN_START_LONGITUDE } from '@/lib/astro-symbols';

interface ChartWheelProps {
  chartData: NatalChartDetails;
  size?: number;
}

const ChartWheel: React.FC<ChartWheelProps> = ({ chartData, size = 700 }) => {
  const centerX = size / 2;
  const centerY = size / 2;

  const planetOrbitRadius = size * 0.35; // Adjust this carefully
  // const innerChartRadius = size * 0.1; // Not used in this simplified version

  // Helper to convert astrological longitude (0-360, Aries at 0, counter-clockwise)
  // to STANDARD TRIGONOMETRIC ANGLE (0-360, 0 is right, counter-clockwise).
  const getSvgAngle = (absoluteLongitude: number) => { // Renamed parameter for clarity
    return (270 - absoluteLongitude + 360) % 360;
  };

  // Helper to get X, Y coordinates on a circle based on standard trigonometric angle and radius
  const getCoordinates = (angleDegrees: number, radius: number) => {
    const angleRadians = angleDegrees * Math.PI / 180;
    return {
      x: centerX + radius * Math.cos(angleRadians),
      y: centerY - radius * Math.sin(angleRadians), // Y is inverted in SVG (positive is down)
    };
  };

  // --- NEW HELPER: Calculate Absolute Longitude ---
  const calculateAbsoluteLongitude = (point: AstrologicalPoint): number => {
    const signStart = ZODIAC_SIGN_START_LONGITUDE[point.sign];
    if (signStart === undefined) {
      console.warn(`[ChartWheel] Unknown zodiac sign "${point.sign}" for ${point.name}. Using 0 longitude.`);
      return 0; // Fallback
    }
    // Kerykeion's 'longitude' property (as seen in debug log) is 'degreeInSign'
    // So, we use point.longitude for the degree within the sign
    return signStart + point.longitude;
  };
  // --- END NEW HELPER ---


  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 pointer-events-none z-[-1]">
      {/* Planet Glyphs and Angles (Ascendant, Midheaven) */}
      {[...chartData.planets, chartData.ascendant, chartData.midheaven].filter(Boolean).map((obj, index) => {
        // <--- CRITICAL CHANGE HERE ---
        const trueLongitude = calculateAbsoluteLongitude(obj);
        // <--- END CRITICAL CHANGE ---

        const glyphAngle = getSvgAngle(trueLongitude); // Use the true absolute longitude
        const glyphCoords = getCoordinates(glyphAngle, planetOrbitRadius);

        const glyphSize = 50;
        const textRadialOffset = glyphSize * 0.7;
        
        const planetOrAngleKey = obj.name === 'Ascendant' ? 'Ascendant' : obj.name === 'Medium_Coeli' ? 'Medium_Coeli' : obj.name;
        const glyphPath = PLANET_GLYPH_PATHS[planetOrAngleKey];

        if (!glyphPath) {
          console.warn(`Missing image filename mapping for: ${planetOrAngleKey}`);
          return null;
        }

        return (
          <foreignObject
            key={`${obj.name}-${index}`}
            x={glyphCoords.x - glyphSize / 2}
            y={glyphCoords.y - glyphSize / 2}
            width={glyphSize}
            height={glyphSize}
            className="pointer-events-auto"
          >
            <Image
              src={glyphPath}
              alt={`${obj.name} Glyph`}
              width={glyphSize}
              height={glyphSize}
              className="object-contain"
              unoptimized
            />
            {/* Degree and Sign Text */}
            <div
              style={{
                position: 'absolute',
                left: `${glyphSize / 2}px`,
                top: `${glyphSize / 2}px`,
                transform: `translate(${textRadialOffset * Math.cos(glyphAngle * Math.PI / 180)}, ${-textRadialOffset * Math.sin(glyphAngle * Math.PI / 180)}) translate(-50%, -50%)`,
                fontSize: '14px',
                color: '#ecc94b',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                pointerEvents: 'auto',
              }}
            >
              {obj.formattedPosition.split(' ')[0]} {/* e.g., "22.55°" */}
              {obj.isRetrograde && (
                <Image
                  src={RETROGRADE_GLYPH_PATH}
                  alt="Retrograde"
                  width={15}
                  height={15}
                  className="inline-block ml-1 align-middle"
                  unoptimized
                />
              )}
            </div>
          </foreignObject>
        );
      })}
    </svg>
  );
};

export default ChartWheel;