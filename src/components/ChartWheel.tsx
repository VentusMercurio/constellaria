// File: src/app/components/ChartWheel.tsx

// We'll need the chart details to draw everything later
interface NatalChartDetails {
  // We'll fill this in with the full interface later
  planets: any[]; 
}

interface ChartWheelProps {
  chartData: NatalChartDetails;
  size: number; // The width and height of the SVG
}

export default function ChartWheel({ chartData, size }: ChartWheelProps) {
  const center = size / 2;
  const strokeWidth = 1;
  const mainRadius = size / 2 - strokeWidth;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* We use a <g> tag to group elements and apply styles */}
        <g fill="none" stroke="#A78BFA" strokeWidth={strokeWidth}>
          {/* This is the main outer circle of the chart */}
          <circle cx={center} cy={center} r={mainRadius} />
        </g>
      </svg>
    </div>
  );
}