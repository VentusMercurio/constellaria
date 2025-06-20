'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// UPDATED: Now only importing the components we need directly on this page
import BirthDetailsCard from '@/components/BirthDetailsCard';
import PlanetList from '@/components/PlanetList';
import ChartWheel from '@/components/ChartWheel';


// --- Data Types (for type safety) ---
interface AstrologicalPoint {
  name: string;
  longitude: number;
  sign: string;
  degreeInSign: number;
  formattedPosition: string;
  house?: number;
  isRetrograde?: boolean;
}

interface NatalChartDetails {
  birthDateTimeUTC: string;
  latitude: number;
  longitude: number;
  ascendant: AstrologicalPoint;
  midheaven: AstrologicalPoint;
  houseCusps: AstrologicalPoint[];
  planets: AstrologicalPoint[];
}

// --- Display Component (Updated) ---
function ChartDisplay({ chartData, timezone, onContinue }: { chartData: NatalChartDetails, timezone: string, onContinue: () => void }) {
  return (
    <div className="w-full max-w-lg text-center animate-fade-in space-y-8">
      <div>
        <h1 className="font-serif text-5xl font-bold mb-2 text-transparent bg-clip-text bg-mystic-gradient">
          Your Chart is Revealed
        </h1>
        <p className="text-gray-400">
          Behold, the cosmic signature of your soul's journey.
        </p>
      </div>

      {/* NEW: Center the chart wheel */}
      <div className="flex justify-center">
        <ChartWheel chartData={chartData} size={300} />
      </div>

      <BirthDetailsCard 
        birthDateTimeUTC={chartData.birthDateTimeUTC}
        latitude={chartData.latitude}
        longitude={chartData.longitude}
        timezone={timezone}
      />
      
      <PlanetList planets={chartData.planets} />

      <div className="pt-4">
        <button
          onClick={onContinue}
          className="w-full font-sans font-bold text-white px-8 py-3 rounded-full bg-button-gradient hover:bg-button-gradient-hover transition-all duration-300 ease-in-out shadow-lg shadow-brand-red/20"
        >
          Continue to Dashboard
        </button>
      </div>
    </div>
  );
}

// --- Main Page Component ---
export default function NatalChartPage() {
  const [birthDate, setBirthDate] = useState('1990-07-15');
  const [birthTime, setBirthTime] = useState('14:30');
  const [locationQuery, setLocationQuery] = useState('Los Angeles, CA');
  const [latitude, setLatitude] = useState<number | null>(34.0522);
  const [longitude, setLongitude] = useState<number | null>(-118.2437);
  const [timezone, setTimezone] = useState<string | null>('America/Los_Angeles');
  const [chartData, setChartData] = useState<NatalChartDetails | null>(null);
  const [isFindingLocation, setIsFindingLocation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleFindLocation = async () => {
    setIsFindingLocation(true);
    setError(null);
    try {
      const response = await fetch('/api/lookup-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locationQuery }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setLatitude(data.latitude);
      setLongitude(data.longitude);
      setTimezone(data.timezone);
    } catch (err: any) {
      setError(err.message);
      setLatitude(null);
      setLongitude(null);
      setTimezone(null);
    } finally {
      setIsFindingLocation(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!latitude || !longitude || !timezone) {
      setError('Please find and confirm location details first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/calculate-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ birthDate, birthTime, latitude, longitude, timezone }),
      });
      const resultData = await response.json();
      if (!response.ok) {
        throw new Error(resultData.error || 'An error occurred during chart calculation.');
      }
      setChartData(resultData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900">
      {chartData && timezone ? (
        <ChartDisplay chartData={chartData} timezone={timezone} onContinue={handleContinue} />
      ) : (
        <div className="w-full max-w-lg text-center">
            <h1 className="font-serif text-5xl font-bold mb-2 text-transparent bg-clip-text bg-mystic-gradient">
              Your Cosmic Blueprint
            </h1>
            <p className="text-gray-400 mb-8">
              To reveal your chart, Sophia needs to know when and where your journey began.
            </p>
            <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-2xl shadow-xl space-y-4">
              <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-fuchsia-500" />
              <input type="time" value={birthTime} onChange={(e) => setBirthTime(e.target.value)} required className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-fuchsia-500" />
              <div className="pt-4 space-y-2">
                <input type="text" value={locationQuery} onChange={(e) => setLocationQuery(e.target.value)} placeholder="Enter City, State/Country" required className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-fuchsia-500" />
                <button type="button" onClick={handleFindLocation} disabled={isFindingLocation} className="w-full font-sans text-sm font-bold text-white px-8 py-2 rounded-full bg-gray-600 hover:bg-gray-500 transition-all duration-300 disabled:opacity-50">
                  {isFindingLocation ? 'Finding...' : 'Find Location Details'}
                </button>
              </div>
              {latitude && longitude && timezone && (
                <div className="text-left text-sm text-gray-400 pt-2 px-2">
                  <p>Lat: {latitude.toFixed(4)}</p>
                  <p>Lon: {longitude.toFixed(4)}</p>
                  <p>Timezone: {timezone}</p>
                </div>
              )}
              <div className="pt-4">
                <button type="submit" disabled={isLoading || !latitude} className="w-full font-sans font-bold text-white px-8 py-3 rounded-full bg-button-gradient hover:bg-button-gradient-hover transition-all duration-300 ease-in-out shadow-lg shadow-brand-red/20 disabled:opacity-50">
                  {isLoading ? 'Calculating...' : 'Calculate My Chart'}
                </button>
              </div>
              {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            </form>
        </div>
      )}
    </div>
  );
}
