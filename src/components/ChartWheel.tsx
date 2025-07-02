// src/components/ChartWheel.tsx
import React from 'react';
import Image from 'next/image'; // For Image-based glyphs
import { AstrologicalPoint, NatalChartDetails } from '@/types/astrology';

// Import the glyph file paths
import { PLANET_GLYPH_PATHS, RETROGRADE_GLYPH_PATH, ZODIAC_GLYPH_PATHS } from '@/lib/astro-symbols'; // ZODIAC_GLYPH_PATHS is still here but won't be used in rendering

interface ChartWheelProps {
  chartData: NatalChartDetails;
  size?: number; // Diameter of the SVG viewBox and internal coordinate system
}

const ChartWheel: React.FC<ChartWheelProps> = ({ chartData, size = 700 }) => { // Default size matches new fixed size
  const centerX = size / 2;
  const centerY = size / 2;

  // These radii now refer to positions on your BACKGROUND IMAGE
  // You will need to fine-tune these values based on your new image's design
  // Use trial and error with dev tools to align with the image's concentric circles
  const planetOrbitRadius = size * 0.35; // Adjust this carefully (e.g., 35% of total size)
  const innerChartRadius = size * 0.1; // Radius of the innermost empty circle if your image has one

  // Helper to convert astrological longitude (0-360, Aries at 0, counter-clockwise)
  // to SVG angle (0-360, 0 is right, clockwise).
  const getSvgAngle = (longitude: number) => {
    return 180 - longitude;
  };

  // Helper to get X, Y coordinates on a circle based on SVG angle and radius
  const getCoordinates = (angleDegrees: number, radius: number) => {
    const angleRadians = (angleDegrees) * Math.PI / 180;
    return {
      x: centerX + radius * Math.cos(angleRadians),
      y: centerY - radius * Math.sin(angleRadians), // Y is inverted in SVG (positive is down)
    };
  };

  return (
    // The SVG container. It's transparent and overlays the base image.
    // Ensure its size (width/height) matches the parent div it fills (e.g., 700px x 700px)
    <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 pointer-events-none z-[-1]">
      
      {/* --- REMOVE ALL ZODIAC GLYPHS, HOUSE CUSPS, AND CENTRAL CIRCLE DRAWING --- */}
      {/* These are now baked into your background image */}

      {/* Example of what to remove: */}
      {/*
      {Object.keys(ZODIAC_GLYPH_PATHS).map((signKey, index) => { // REMOVE THIS BLOCK
          // ... rendering for zodiac glyphs ...
      })}
      {chartData.houseCusps.map((cusp, index) => { // REMOVE THIS BLOCK
          // ... rendering for house cusps ...
      })}
      <circle cx={centerX} cy={centerY} r="5" fill="#ecc94b" className="pointer-events-none" /> // REMOVE THIS
      */}

      {/* --- Planet Glyphs and Angles (Ascendant, Midheaven) --- */}
      {/* Focus solely on these dynamic elements */}
      {[...chartData.planets, chartData.ascendant, chartData.midheaven].filter(Boolean).map((obj, index) => {
        const glyphAngle = getSvgAngle(obj.longitude);
        const glyphCoords = getCoordinates(glyphAngle, planetOrbitRadius);
        const glyphSize = 40; // Adjust this to make glyphs more noticeable
        const textOffsetFromGlyph = 10; // Adjust distance of text from glyph
        const textWidth = 60; // Estimated width for text div
        const textHeight = 40; // Estimated height for text div

        const planetOrAngleKey = obj.name === 'Ascendant' ? 'Ascendant' : obj.name === 'Medium_Coeli' ? 'Medium_Coeli' : obj.name;
        const glyphPath = PLANET_GLYPH_PATHS[planetOrAngleKey];

        if (!glyphPath) {
          console.warn(`Missing image filename mapping for: ${planetOrAngleKey}`);
          return null;
        }

        // Calculate text position relative to glyph, adjusted by angle for radial alignment
        // This makes the text appear radially from the glyph, not just below it.
        const textAnchorOffset = getCoordinates(glyphAngle, textOffsetFromGlyph);


        return (
          <foreignObject
            key={`${obj.name}-${index}`}
            x={glyphCoords.x - glyphSize / 2} // Center glyph at its coordinates
            y={glyphCoords.y - glyphSize / 2}
            width={glyphSize}
            height={glyphSize}
            className="pointer-events-auto"
          >
            {/* Planet/Angle Glyph */}
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
                left: `${(glyphSize / 2) + textAnchorOffset.x - centerX}px`, // Adjust horizontally relative to glyph
                top: `${(glyphSize / 2) + textAnchorOffset.y - centerY}px`,  // Adjust vertically relative to glyph
                transform: `translate(-50%, -50%)`, // Center the text div itself
                fontSize: '14px',
                color: '#D1D5DB', // Desired text color (e.g., golden)
                textAlign: 'center',
                whiteSpace: 'nowrap',
                pointerEvents: 'auto',
                // Optional: Debug border to see text div's boundaries
                // border: '1px solid red',
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