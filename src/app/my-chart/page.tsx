// src/app/my-chart/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import Image from 'next/image';

// Import components for displaying chart data
import ChartWheel from '@/components/ChartWheel';
import PlanetList from '@/components/PlanetList';

// Import types for chart data
import { NatalChartDetails } from '@/types/astrology';

// Import your custom background images for this page and the chart
import natalChartBg from '/public/images/backgrounds/natal-chart-bg.png'; // Page background image
import natalChartWheelImage from '/public/images/chart_assets/natal-chart-wheel.png'; // Your blank golden circle image


export default function MyNatalChartPage() {
  const [chartData, setChartData] = useState<NatalChartDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchChart = async () => {
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
        setChartData(profile.chart_data as NatalChartDetails);
      } else {
        setError('No natal chart found. Please generate your chart first.');
      }
      setIsLoading(false);
    };

    fetchChart();
  }, [router, supabase]);

  if (isLoading) {
    return (
      <div className="relative min-h-screen text-white flex flex-col items-center justify-center p-4 md:p-8">
        <Image
          src={natalChartBg}
          alt="Natal Chart Background"
          fill
          sizes="100vw"
          priority
          className="object-cover pointer-events-none z-[-2]"
        />
        <div className="absolute inset-0 bg-black opacity-50 z-[-1]"></div>
        <div className="relative z-10 w-full max-w-4xl bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 text-center">
          <p className="text-fuchsia-400">Drawing your cosmic blueprint...</p>
        </div>
      </div>
    );
  }

  return (
    // Outer div for page background
    <div className="relative min-h-screen text-white font-serif">
      <Image
        src={natalChartBg} // Your page background image
        alt="Natal Chart Background"
        fill
        sizes="100vw"
        priority
        className="object-cover pointer-events-none z-[-2]"
      />
      <div className="absolute inset-0 bg-black opacity-50 z-[-1]"></div>

      {/* Main content container, centered and above background/overlay */}
      <div className="relative z-10 flex flex-col items-center min-h-screen p-4 md:p-8 pt-16 text-center">
        <div className="w-full max-w-6xl mx-auto space-y-12">

          <h1 className="font-serif text-5xl md:text-6xl font-bold text-fuchsia-400 mb-8">
            Your Natal Chart
          </h1>

          {error && (
            <p className="text-red-500 mb-4">{error}</p>
          )}

          {chartData ? (
            // <--- MODIFIED CONTAINER FOR CHART & TEXT ---
            // Changed from lg:flex-row to always flex-col
            // Added vertical gap with gap-8
            <div className="flex flex-col items-center justify-center gap-8 md:gap-12 bg-gray-900 bg-opacity-70 p-6 rounded-2xl shadow-xl border border-gray-700 backdrop-blur-sm">
              
              {/* --- Chart Wheel Container (Image + SVG Overlay) --- */}
              {/* This container will naturally center itself due to flex-col parent */}
              <div className="relative aspect-square w-full max-w-sm lg:max-w-md mx-auto">
                {/* Static Chart Wheel Base Image */}
                <Image
                  src={natalChartWheelImage}
                  alt="Astrology Chart Wheel Base"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  className="object-contain pointer-events-none z-[-2]"
                />

                {/* Dynamic SVG Overlay for Glyphs and Lines */}
                <ChartWheel chartData={chartData} size={500} />
              </div>

              {/* --- Textual Planet Positions Container --- */}
              {/* This container will now stack below the chart, and will be centered by its parent */}
              {/* Added mx-auto max-w-2xl to constrain and center it */}
              <div className="w-full max-w-2xl mx-auto">
                <h2 className="font-serif text-3xl text-amber-400 mb-6">Planetary Positions</h2>
                <PlanetList planets={chartData.planets} />
              </div>
            </div>
            // <--- END MODIFIED CONTAINER ---
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
    </div>
  );
}