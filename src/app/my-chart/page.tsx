// src/app/my-chart/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

// Import the new components
import ChartWheel from '@/components/ChartWheel';
import PlanetList from '@/components/PlanetList';
// Import types from the new central file
import { NatalChartDetails } from '@/types/astrology'; // Adjust path if needed

export default function MyNatalChartPage() {
  const [chartData, setChartData] = useState<NatalChartDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchChart = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/login');
        return;
      }

      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('chart_data')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        console.error('Error fetching natal chart:', fetchError);
        setError('Could not retrieve your natal chart. Please try again.');
      } else if (profile && profile.chart_data) {
        setChartData(profile.chart_data as NatalChartDetails); // Cast to NatalChartDetails
      } else {
        setError('No natal chart found. Please generate your chart first.');
      }
      setIsLoading(false);
    };

    fetchChart();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Loading Natal Chart...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-4 md:p-8 pt-16 text-center bg-gray-900 text-white">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="font-serif text-5xl font-bold mb-8 text-fuchsia-400">Your Natal Chart</h1>

        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}

        {chartData ? (
          <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 text-left space-y-8 flex flex-col md:flex-row md:space-x-8 md:space-y-0 items-center justify-center">
            {/* Chart Wheel */}
            <div className="md:w-1/2 flex justify-center">
                <ChartWheel chartData={chartData} size={400} />
            </div>

            {/* Planet List (and potentially Birth Details) */}
            <div className="md:w-1/2 space-y-8">
              {/* Add BirthDetailsCard here if you have it and want it displayed */}
              {/* <BirthDetailsCard
                birthDateTimeUTC={chartData.birthDateTimeUTC}
                latitude={chartData.latitude}
                longitude={chartData.longitude}
                timezone="UTC" // Make sure you pass the correct timezone if available in chartData
              /> */}
              <PlanetList planets={chartData.planets} />
            </div>
          </div>
        ) : (
          !error && <p className="text-gray-400">Your natal chart data is not available.</p>
        )}

        <div className="mt-8">
          <Link href="/dashboard">
            <span className="font-sans font-bold text-white px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 ease-in-out shadow-lg transform hover:scale-105 inline-block">
              Back to Dashboard
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}