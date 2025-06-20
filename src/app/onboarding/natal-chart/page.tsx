'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NatalChartPage() {
  // State for the main form
  const [birthDate, setBirthDate] = useState('1990-07-15');
  const [birthTime, setBirthTime] = useState('14:30');

  // State for our location lookup
  const [locationQuery, setLocationQuery] = useState('Los Angeles, CA');
  const [latitude, setLatitude] = useState<number | null>(34.0522);
  const [longitude, setLongitude] = useState<number | null>(-118.2437);
  const [timezone, setTimezone] = useState<string | null>('America/Los_Angeles');

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
    
    // Simple validation
    if (!latitude || !longitude || !timezone) {
      setError('Please find and confirm location details first.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // This is the key part: we are now calling our Python API
      const response = await fetch('/api/calculate-chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          birthDate,
          birthTime,
          latitude,
          longitude,
          timezone,
        }),
      });

      const resultData = await response.json();

      if (!response.ok) {
        // Handle errors from our Python API
        throw new Error(resultData.detail || 'An error occurred during chart calculation.');
      }
      
      console.log('SUCCESS! Received Natal Chart Data:', resultData);

      // In the future, we will save this resultData to Supabase and redirect
      // For now, seeing the success log is our goal.
      // router.push('/dashboard');

    } catch (err: any) {
      console.error("Frontend Error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900">
      <div className="w-full max-w-lg text-center">
        <h1 className="font-serif text-5xl font-bold mb-2 text-transparent bg-clip-text bg-mystic-gradient">
          Your Cosmic Blueprint
        </h1>
        <p className="text-gray-400 mb-8">
          To reveal your chart, Sophia needs to know when and where your journey began.
        </p>

        <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-2xl shadow-xl space-y-4">
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          />
          <input
            type="time"
            value={birthTime}
            onChange={(e) => setBirthTime(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          />

          <div className="pt-4 space-y-2">
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder="Enter City, State/Country"
              required
              className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            />
            <button
              type="button"
              onClick={handleFindLocation}
              disabled={isFindingLocation}
              className="w-full font-sans text-sm font-bold text-white px-8 py-2 rounded-full bg-gray-600 hover:bg-gray-500 transition-all duration-300 disabled:opacity-50"
            >
              {isFindingLocation ? 'Finding...' : 'Find Location Details'}
            </button>
          </div>
          
          {/* Display found details for user confirmation */}
          {latitude && longitude && (
            <div className="text-left text-sm text-gray-400 pt-2 px-2">
              <p>Lat: {latitude.toFixed(4)}</p>
              <p>Lon: {longitude.toFixed(4)}</p>
              <p>Timezone: {timezone}</p>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading || !latitude}
              className="w-full font-sans font-bold text-white px-8 py-3 rounded-full bg-button-gradient hover:bg-button-gradient-hover transition-all duration-300 ease-in-out shadow-lg shadow-brand-red/20 disabled:opacity-50"
            >
              {isLoading ? 'Calculating...' : 'Calculate My Chart'}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
}