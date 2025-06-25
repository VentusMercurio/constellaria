// src/app/my-chart/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function MyNatalChartPage() {
  const [chartData, setChartData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchChart = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // If no user, redirect to login.
        router.push('/auth/login');
        return;
      }

      // Fetch the profile for the authenticated user
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('chart_data') // Only select the chart_data column
        .eq('id', user.id)
        .single();

      if (fetchError) {
        console.error('Error fetching natal chart:', fetchError);
        setError('Could not retrieve your natal chart. Please try again.');
      } else if (profile && profile.chart_data) {
        setChartData(profile.chart_data);
      } else {
        // Handle case where profile exists but chart_data is missing, or profile doesn't exist
        setError('No natal chart found. Please generate your chart first.');
        // Optionally, redirect them to the onboarding page if no chart data
        // router.push('/onboarding/natal-chart');
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
          <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 text-left">
            <h2 className="font-serif text-2xl text-amber-400 mb-4">Planetary Positions:</h2>
            {/* Displaying raw JSON for now, you can format this more beautifully later */}
            <pre className="whitespace-pre-wrap break-words text-gray-300 text-sm overflow-auto max-h-[60vh]">
              {JSON.stringify(chartData, null, 2)}
            </pre>
            {/* You can iterate over chartData.planets to display them */}
            {/* Example:
            {chartData.planets?.map((planet: any) => (
              <p key={planet.name} className="text-lg text-gray-200">
                <span className="font-bold">{planet.name}</span> in <span className="italic">{planet.sign}</span> at {planet.degree}°
              </p>
            ))}
            */}
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