// src/components/ChartWheel.tsx
import React from 'react';
import Image from 'next/image';
import { AstrologicalPoint, NatalChartDetails } from '@/types/astrology';

import { PLANET_GLYPH_PATHS, RETROGRADE_GLYPH_PATH, ZODIAC_SIGN_START_LONGITUDE } from '@/lib/astro-symbols';

interface ChartWheelProps {
  chartData: NatalChartDetails;
  size?: number; // Diameter of the SVG viewBox and internal coordinate system (e.g., 700)
}

const ChartWheel: React.FC<ChartWheelProps> = ({ chartData, size = 700 }) => {
  const centerX = size / 2;
  const centerY = size / 2;

  const diagnosticCircleRadius = centerX; // Full radius of the diagnostic circle
  const zodiacTestRadius = diagnosticCircleRadius * 0.9; // Radius for placing zodiac symbols
  const planetOrbitRadius = size * 0.35; // Fine-tune this visually

  // Radii for the degree tick marks - these will need visual fine-tuning
  const degreeTickOuterRadius = diagnosticCircleRadius; // Extends to the outer edge of the diagnostic circle
  const degreeTickInnerRadius = diagnosticCircleRadius * 0.98; // Short tick marks
  const tenDegreeTickInnerRadius = diagnosticCircleRadius * 0.96; // Slightly longer for every 10 degrees

  // Helper to convert astrological longitude (0-360, Aries at 0, counter-clockwise)
  // to STANDARD TRIGONOMETRIC ANGLE (0-360, 0 is right, counter-clockwise).
  const getSvgAngle = (absoluteLongitude: number) => {
    return (270 - absoluteLongitude + 360) % 360;
  };

  // Helper to get X, Y coordinates on a circle based on standard trigonometric angle and radius
  const getCoordinates = (angleDegrees: number, radius: number) => {
    const angleRadians = angleDegrees * Math.PI / 180;
    return {
      x: centerX + radius * Math.cos(angleRadians),
      y: centerY + radius * Math.sin(angleRadians),
    };
  };

  // Calculate Absolute Longitude helper (KEEP EXISTING)
  const calculateAbsoluteLongitude = (point: AstrologicalPoint): number => {
    const signStart = ZODIAC_SIGN_START_LONGITUDE[point.sign];
    if (signStart === undefined) {
      console.warn(`[ChartWheel DEBUG] Unknown zodiac sign "${point.sign}" for ${point.name}. Using 0 longitude for sign start.`);
      return point.longitude;
    }
    return signStart + point.longitude;
  };

  // Zodiac Unicode Mapping (KEEP EXISTING)
  const ZODIAC_UNICODE: { [key: string]: string } = {
    Ari: '\u2648', Tau: '\u2649', Gem: '\u264A', Can: '\u264B', Leo: '\u264C',
    Vir: '\u264D', Lib: '\u264E', Sco: '\u264F', Sag: '\u2650', Cap: '\u2651',
    Aqu: '\u2652', Pis: '\u2653',
  };

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 pointer-events-none z-[-1]">
      
      {/* --- DIAGNOSTIC CIRCLE AND LINES --- */}
      {/* Main outer circle */}
      <circle cx={centerX} cy={centerY} r={diagnosticCircleRadius} stroke="rgba(255,255,255,0.5)" strokeWidth="1" fill="none" />
      
      {/* Crosshairs for cardinal points (0, 90, 180, 270) */}
      <line x1={centerX} y1={0} x2={centerX} y2={size} stroke="red" strokeWidth="1" />
      <line x1={0} y1={centerY} x2={size} y2={centerY} stroke="red" strokeWidth="1" />

      {/* Quadrant labels */}
      <text x={size - 10} y={centerY + 5} fontSize="20" fill="white" dominantBaseline="middle" textAnchor="end">0° (Right)</text>
      <text x={centerX} y={25} fontSize="20" fill="white" dominantBaseline="hanging" textAnchor="middle">90° (Top)</text>
      <text x={10} y={centerY + 5} fontSize="20" fill="white" dominantBaseline="middle" textAnchor="start">180° (Left)</text>
      <text x={centerX} y={size - 10} fontSize="20" fill="white" dominantBaseline="ideographic" textAnchor="middle">270° (Bottom)</text>
      {/* --- END DIAGNOSTIC CIRCLE AND LINES --- */}

      {/* --- Zodiac Sign Wedge Lines & Symbols (KEEP EXISTING) --- */}
      {Object.keys(ZODIAC_SIGN_START_LONGITUDE).map((signKey) => {
        const startLong = ZODIAC_SIGN_START_LONGITUDE[signKey];
        const svgAngle = getSvgAngle(startLong);
        const coords = getCoordinates(svgAngle, diagnosticCircleRadius);

        const midLong = (startLong + 15) % 360;
        const midSvgAngle = getSvgAngle(midLong);
        const labelRadius = diagnosticCircleRadius * 0.8;
        const labelCoords = getCoordinates(midSvgAngle, labelRadius);

        return (
          <g key={`wedge-${signKey}`}>
            {/* Wedge Line */}
            <line x1={centerX} y1={centerY} x2={coords.x} y2={coords.y}
                  stroke="rgba(178, 183, 21, 0.5)" strokeWidth="1" />

            {/* Zodiac Symbol (Unicode) */}
            <text
              x={labelCoords.x}
              y={labelCoords.y}
              fontSize="24"
              fill="#ecc94b"
              dominantBaseline="middle"
              textAnchor="middle"
              className="pointer-events-auto"
            >
              {ZODIAC_UNICODE[signKey]}
            </text>
          </g>
        );
      })}
      {/* --- END ZODIAC SIGN UNICODE SYMBOLS --- */}

      {/* --- NEW DIAGNOSTIC: DEGREE TICK MARKS --- */}
      {[...Array(360)].map((_, degree) => { // Loop for every degree (0 to 359)
        if (degree % 10 === 0) { // Only draw a tick for every 10th degree
          const svgAngle = getSvgAngle(degree);
          
          let innerRadiusForTick = degreeTickInnerRadius;
          let tickColor = "rgba(255,255,255,0.3)"; // Lighter tick color
          let tickWidth = 0.5;

          if (degree % 30 === 0) { // Longer tick for start of each sign (0, 30, 60, etc.)
            innerRadiusForTick = degreeTickInnerRadius; // Keep same as outer, but this can be adjusted
            tickColor = "rgba(255,255,255,0.7)"; // Brighter for sign boundaries
            tickWidth = 1;
          }

          const startCoords = getCoordinates(svgAngle, innerRadiusForTick);
          const endCoords = getCoordinates(svgAngle, degreeTickOuterRadius);

          return (
            <line
              key={`degree-tick-${degree}`}
              x1={startCoords.x} y1={startCoords.y}
              x2={endCoords.x} y2={endCoords.y}
              stroke={tickColor}
              strokeWidth={tickWidth}
            />
          );
        }
        return null; // Don't draw for other degrees
      })}
      {/* --- END NEW DIAGNOSTIC --- */}


      {/* Planet Glyphs and Angles (Ascendant, Midheaven) */}
      {[...chartData.planets, chartData.ascendant, chartData.midheaven].filter(Boolean).map((obj, index) => {
        // ... (existing planet rendering code) ...
        const trueLongitude = calculateAbsoluteLongitude(obj);
        console.log(`[ChartWheel DEBUG] Plotting ${obj.name}: Input Longitude=${obj.longitude}, Sign=${obj.sign}`);
        console.log(`[ChartWheel DEBUG] ${obj.name}: Calculated True Longitude=${trueLongitude}, Calculated SVG Angle=${getSvgAngle(trueLongitude)}`);

        const glyphAngle = getSvgAngle(trueLongitude);
        const glyphCoords = getCoordinates(glyphAngle, planetOrbitRadius);

        const glyphSize = 120; // Adjust this
        const textRadialOffset = glyphSize * 0.9; // Adjust this
        
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
              {obj.formattedPosition.split(' ')[0]}
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