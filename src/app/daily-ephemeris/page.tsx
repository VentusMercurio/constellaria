// src/app/daily-ephemeris/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client'; // Assuming you still need supabase client for user context
import Image from 'next/image';
import Link from 'next/link';

// Import components for displaying chart data
import ChartWheel from '@/components/ChartWheel';
import PlanetList from '@/components/PlanetList';

// Import types for chart data
import { NatalChartDetails } from '@/types/astrology'; // Reusing this type for ephemeris_data structure

// Import your background image for this page
import dailyEphemerisBg from '/public/images/backgrounds/daily-ephemeris-bg.png'; // Adjust path/filename/extension if different


export default function DailyEphemerisPage() {
  const [horoscope, setHoroscope] = useState<string | null>(null);
  const [ephemerisData, setEphemerisData] = useState<NatalChartDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient(); // Initialize Supabase client for user context

  useEffect(() => {
    const fetchDailyData = async () => {
      setIsLoading(true);
      setError(null);

      // Authenticate user to ensure they are logged in.
      // This is necessary even if their sun sign isn't directly used by the horoscope itself,
      // as the page requires authentication.
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }
      
      try {
        // Call the Next.js proxy route which in turn calls your Python API
        const response = await fetch('/api/daily-horoscope'); // This route is cached by default in production
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch Sophia's insight and ephemeris.");
        }
        
        setHoroscope(data.horoscope);
        // Cast to NatalChartDetails as the structure matches
        setEphemerisData(data.ephemeris_data as NatalChartDetails); 

      } catch (err: any) {
        console.error("Daily Ephemeris Fetch Error:", err);
        setError(err.message || "An error occurred while fetching daily insights.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyData();
  }, [router, supabase]);


  if (isLoading) {
    return (
      // Loading state with background and spinner/message
      <div className="relative min-h-screen text-white flex flex-col items-center justify-center p-4 md:p-8">
        <Image
          src={dailyEphemerisBg}
          alt="Daily Ephemeris Background"
          fill
          sizes="100vw"
          priority
          className="object-cover pointer-events-none z-[-2]"
        />
        <div className="absolute inset-0 bg-black opacity-50 z-[-1]"></div>
        <div className="relative z-10 w-full max-w-4xl bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 text-center">
          <p className="font-serif text-fuchsia-400 text-2xl animate-pulse">Consulting the cosmic currents...</p>
        </div>
      </div>
    );
  }

  return (
    // Main content display once data is loaded
    <div className="relative min-h-screen text-white">
      {/* Background Image */}
      <Image
        src={dailyEphemerisBg}
        alt="Daily Ephemeris Background"
        fill
        sizes="100vw"
        priority
        className="object-cover pointer-events-none z-[-2]"
      />
      {/* Semi-transparent dark overlay */}
      <div className="absolute inset-0 bg-black opacity-50 z-[-1]"></div>

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col items-center min-h-screen p-4 md:p-8 pt-16 text-center">
        <div className="w-full max-w-4xl mx-auto space-y-8">
          <h1 className="font-serif text-5xl font-bold mb-4 text-fuchsia-400">Today's Cosmic Insight</h1>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Sophia's Horoscope Interpretation */}
          {horoscope && (
            <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 text-left">
              <h2 className="font-serif text-3xl text-amber-400 mb-4 text-center">Sophia's Wisdom</h2>
              <p className="text-gray-300 text-lg italic leading-relaxed text-center">"{horoscope}"</p>
            </div>
          )}

          {/* Ephemeris Chart Display */}
          {ephemerisData && (
            <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 text-left flex flex-col md:flex-row md:space-x-8 md:space-y-0 items-center justify-center">
              <div className="md:w-1/2 flex justify-center">
                  <ChartWheel chartData={ephemerisData} size={300} /> {/* Reusing ChartWheel */}
              </div>
              <div className="md:w-1/2 space-y-8">
                <h2 className="font-serif text-3xl text-amber-400 text-center">Today's Ephemeris Chart</h2>
                {/* Displaying birth details of the current sky (time, lat, long) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6 text-gray-300 mb-4">
                  <p><span className="font-bold">Time:</span> {new Date(ephemerisData.birthDateTimeUTC).toLocaleString()}</p>
                  <p><span className="font-bold">Latitude:</span> {ephemerisData.latitude}°</p>
                  <p><span className="font-bold">Longitude:</span> {ephemerisData.longitude}°</p>
                </div>
                <PlanetList planets={ephemerisData.planets} /> {/* Reusing PlanetList */}
                {/* You might want to display angles (Asc/MC) and house cusps in separate lists as well */}
              </div>
            </div>
          )}

          {/* Fallback if no data and no error */}
          {!horoscope && !ephemerisData && !error && !isLoading && (
            <p className="text-gray-400">No daily insight or ephemeris data available.</p>
          )}

          {/* Back to Dashboard Button */}
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