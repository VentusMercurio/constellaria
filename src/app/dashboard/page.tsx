'use client'; // This component now needs to be a client component

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import SignOutButton from './SignOutButton';

// Define the structure of our profile data
interface Profile {
  id: string;
  sun_sign: string;
  chart_data: any; 
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const setupDashboard = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/login');
        return;
      }

      // First, try to fetch an existing profile from the database
      let { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // If no profile exists, check localStorage for pending data
      if (!existingProfile) {
        const pendingDataString = localStorage.getItem('pendingChartData');
        if (pendingDataString) {
          const chartData = JSON.parse(pendingDataString);

          // Call our new API route to save the data
          const saveResponse = await fetch('/api/save-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(chartData),
          });

          if (saveResponse.ok) {
            localStorage.removeItem('pendingChartData'); // Clean up localStorage
            // Re-fetch the profile, which should now exist
            const { data: newProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .single();
            existingProfile = newProfile;
          } else {
            console.error("Failed to save pending chart data.");
          }
        }
      }

      if (existingProfile) {
        setProfile(existingProfile);
      } else {
        // If still no profile, they need to go through onboarding
        router.push('/onboarding/natal-chart');
      }

      setIsLoading(false);
    };

    setupDashboard();
  }, [router]);

  // --- Render logic ---

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Loading Dashboard...</div>;
  }

  if (!profile) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Redirecting...</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-4 md:p-8 pt-16 text-center bg-gray-900">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
            <h1 className="font-serif text-5xl font-bold mb-2">Your Mystical Dashboard</h1>
            <p className="text-gray-400 text-lg">
                Welcome, Seeker. Your Sun shines in <span className="font-bold text-amber-400">{profile.sun_sign}</span>.
            </p>
        </div>
        {/* Grid and other components from before */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">Daily Draw Placeholder</div>
          <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">Natal Chart Placeholder</div>
          <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">Horoscopes Placeholder</div>
        </div>
        <div className="mt-12">
                   {/* --- THIS IS THE NEW BUTTON YOU REQUESTED --- */}
        <div className="mt-10">
          <Link href="/onboarding/natal-chart">
            <span className="font-sans font-bold text-gray-300 px-6 py-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
              (Dev) Go to Natal Chart Page
            </span>
          </Link>
        </div>
           
            <SignOutButton />
        </div>
      </div>
    </div>
  );
}