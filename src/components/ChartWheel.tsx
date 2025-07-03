// src/components/ChartWheel.tsx
import React from 'react';
import Image from 'next/image';
import { AstrologicalPoint, NatalChartDetails } from '@/types/astrology';

// Import the glyph file paths
import { PLANET_GLYPH_PATHS, RETROGRADE_GLYPH_PATH, ZODIAC_SIGN_START_LONGITUDE } from '@/lib/astro-symbols';

interface ChartWheelProps {
  chartData: NatalChartDetails;
  size?: number; // Diameter of the SVG viewBox and internal coordinate system (e.g., 700)
}

const ChartWheel: React.FC<ChartWheelProps> = ({ chartData, size = 700 }) => {
  const centerX = size / 2;
  const centerY = size / 2;

  // --- Diagnostic Radii and Tick Mark Parameters ---
  // These define the size and placement of the temporary diagnostic elements
  const diagnosticCircleRadius = centerX; // Full radius of the diagnostic circle
  const zodiacTestRadius = diagnosticCircleRadius * 0.85; // Radius for placing zodiac symbols (adjusted slightly inward)
  const degreeTickOuterRadius = diagnosticCircleRadius; // Extends to the outer edge of the diagnostic circle
  const degreeTickInnerRadius = diagnosticCircleRadius * 0.98; // Short tick marks
  const tenDegreeTickInnerRadius = diagnosticCircleRadius * 0.96; // Slightly longer for every 10 degrees
  // --- END Diagnostic Parameters ---

  // --- Planetary Orbit Radius ---
  // This is the CRUCIAL radius for your planet glyphs.
  // It needs to be adjusted based on the specific "ring" on your background image.
  // Start with 0.35 and fine-tune (e.g., 0.3, 0.4, 0.45)
  const planetOrbitRadius = size * 0.35; 
  // --- END Planetary Orbit Radius ---


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

  // Calculate Absolute Longitude helper (from degreeInSign and sign)
  const calculateAbsoluteLongitude = (point: AstrologicalPoint): number => {
    const signStart = ZODIAC_SIGN_START_LONGITUDE[point.sign];
    if (signStart === undefined) {
      console.warn(`[ChartWheel DEBUG] Unknown zodiac sign "${point.sign}" for ${point.name}. Using 0 longitude for sign start.`);
      return point.longitude;
    }
    return signStart + point.longitude;
  };

  // Zodiac Unicode Mapping (for diagnostic labels)
  const ZODIAC_UNICODE: { [key: string]: string } = {
    Ari: '\u2648', Tau: '\u2649', Gem: '\u264A', Can: '\u264B', Leo: '\u264C',
    Vir: '\u264D', Lib: '\u264E', Sco: '\u264F', Sag: '\u2650', Cap: '\u2651',
    Aqu: '\u2652', Pis: '\u2653',
  };

  // --- NEW: Conjunction Offsetting Logic (from previous steps) ---
  const conjunctionTolerance = 10; // Degrees within which planets are considered in conjunction
  const radialOffsetStep = 40;     // Pixels to offset each planet in a conjunction.

  // Helper function for conjunction offsetting
  const getAdjustedPlanetPositions = (
    planets: AstrologicalPoint[],
    tolerance: number,
    offsetStep: number
  ): (AstrologicalPoint & { adjustedRadialOffset?: number; trueLongitude?: number; })[] => {
    let adjustedPlanets: (AstrologicalPoint & { trueLongitude?: number; })[] = planets
      .map(p => ({ ...p, trueLongitude: calculateAbsoluteLongitude(p) }))
      .sort((a, b) => a.trueLongitude! - b.trueLongitude!);

    const conjunctionGroups: (typeof adjustedPlanets)[] = [];
    let currentGroup: typeof adjustedPlanets = [];

    for (let i = 0; i < adjustedPlanets.length; i++) {
      const currentPlanet = adjustedPlanets[i];
      if (currentGroup.length === 0) {
        currentGroup.push(currentPlanet);
      } else {
        const lastPlanetInGroup = currentGroup[currentGroup.length - 1];
        const diff = Math.abs(currentPlanet.trueLongitude! - lastPlanetInGroup.trueLongitude!);
        const wrappedDiff = 360 - diff;

        if (Math.min(diff, wrappedDiff) <= tolerance) {
          currentGroup.push(currentPlanet);
        } else {
          conjunctionGroups.push(currentGroup);
          currentGroup = [currentPlanet];
        }
      }
    }
    if (currentGroup.length > 0) {
      conjunctionGroups.push(currentGroup);
    }

    if (conjunctionGroups.length > 1 && conjunctionGroups[0].length > 0 && conjunctionGroups[conjunctionGroups.length - 1].length > 0) {
      const firstPlanetOfFirstGroup = conjunctionGroups[0][0];
      const lastPlanetOfLastGroup = conjunctionGroups[conjunctionGroups.length - 1][conjunctionGroups[conjunctionGroups.length - 1].length - 1];
      const diff = Math.abs(firstPlanetOfFirstGroup.trueLongitude! + 360 - lastPlanetOfLastGroup.trueLongitude!);
      if (diff <= tolerance) {
        conjunctionGroups[conjunctionGroups.length - 1] = conjunctionGroups[conjunctionGroups.length - 1].concat(conjunctionGroups[0]);
        conjunctionGroups.shift();
      }
    }

    const finalPositions: (AstrologicalPoint & { adjustedRadialOffset?: number; trueLongitude?: number; })[] = [];
    conjunctionGroups.forEach(group => {
      if (group.length === 1) {
        finalPositions.push({ ...group[0], adjustedRadialOffset: 0 });
      } else {
        const numToOffset = group.length;
        const totalOffsetSpan = (numToOffset - 1) * offsetStep;
        const startOffset = -totalOffsetSpan / 2;

        group.forEach((planet, index) => {
          finalPositions.push({
            ...planet,
            adjustedRadialOffset: startOffset + index * offsetStep,
          });
        });
      }
    });

    return finalPositions.sort((a, b) => a.trueLongitude! - b.trueLongitude!);
  };
  // --- END Conjunction Offsetting Logic ---

  // Prepare planets with conjunction offsets for rendering
  const planetsToRender = getAdjustedPlanetPositions(
    [...chartData.planets, chartData.ascendant, chartData.midheaven].filter(Boolean),
    conjunctionTolerance,
    radialOffsetStep
  );


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

      {/* --- Zodiac Sign Wedge Lines & Symbols --- */}
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
                  stroke="rgba(0,255,0,0.5)" strokeWidth="1" />

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

      {/* --- DEGREE TICK MARKS --- */}
      {[...Array(360)].map((_, degree) => {
        if (degree % 10 === 0) {
          const svgAngle = getSvgAngle(degree);
          
          let innerRadiusForTick = degreeTickInnerRadius;
          let tickColor = "rgba(255,255,255,0.3)";
          let tickWidth = 0.5;

          if (degree % 30 === 0) {
            innerRadiusForTick = tenDegreeTickInnerRadius; // Use the longer tick radius
            tickColor = "rgba(255,255,255,0.7)";
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
        return null;
      })}
      {/* --- END DEGREE TICK MARKS --- */}


      {/* Planet Glyphs and Angles (Ascendant, Midheaven) */}
      {planetsToRender.map((obj, index) => { // Use planetsToRender array
        const glyphAngle = getSvgAngle(obj.trueLongitude!); // Use true longitude
        // Add adjustedRadialOffset to planetOrbitRadius
        const finalOrbitRadius = planetOrbitRadius + (obj.adjustedRadialOffset || 0);
        const glyphCoords = getCoordinates(glyphAngle, finalOrbitRadius);

        const glyphSize = 95; // <--- This will need fine-tuning
        const textRadialOffset = glyphSize * 0.7; // <--- This will need fine-tuning
        
        const planetOrAngleKey = obj.name === 'Ascendant' ? 'Ascendant' : obj.name === 'Medium_Coeli' ? 'Medium_Coeli' : obj.name;
        const glyphPath = PLANET_GLYPH_PATHS[planetOrAngleKey];

        if (!glyphPath) {
          console.warn(`Missing image filename mapping for: ${planetOrAngleKey}`);
          return null;
        }

        return (
          <foreignObject
            key={`${obj.name}-${index}`}
            x={glyphCoords.x - glyphSize / 2} // Center glyph at its coordinates
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
                // Position text relative to the glyph's center, along the radial line
                // This will likely need fine-tuning with x/y/transform based on your specific font/sizing
                left: `${glyphSize / 2}px`, // Center horizontally relative to foreignObject
                top: `${glyphSize / 2}px`,  // Center vertically relative to foreignObject
                transform: `translate(${textRadialOffset * Math.cos(glyphAngle * Math.PI / 180)}, ${-textRadialOffset * Math.sin(glyphAngle * Math.PI / 180)}) translate(-50%, -50%)`, // Combined transform
                fontSize: '14px',
                color: '#ecc94b',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                pointerEvents: 'auto',
                // border: '1px solid red', // Temp debug border
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