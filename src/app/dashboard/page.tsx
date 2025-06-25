'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import SignOutButton from './SignOutButton';

// A reusable component for our static placeholder cards
function DashboardCard({ title, description, link, buttonText }: { title: string, description: string, link: string, buttonText: string }) {
  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 text-center flex flex-col justify-between">
      <div>
        <h2 className="font-serif text-3xl text-fuchsia-400 mb-3">{title}</h2>
        <p className="text-gray-300 mb-6 min-h-[40px]">{description}</p>
      </div>
      <Link href={link}>
        <span className="font-sans font-bold text-white px-8 py-3 rounded-full bg-button-gradient hover:bg-button-gradient-hover transition-all duration-300 ease-in-out shadow-lg shadow-brand-red/20 transform hover:scale-105 inline-block">
          {buttonText}
        </span>
      </Link>
    </div>
  );
}

// --- NEW INTERACTIVE HOROSCOPE CARD COMPONENT ---
function HoroscopeCard() {
  const [horoscope, setHoroscope] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHoroscope = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Calls our new Next.js proxy route
      const response = await fetch('/api/daily-horoscope');
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch Sophia's insight.");
      }
      setHoroscope(data.horoscope);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 text-center flex flex-col justify-between">
      <div>
        <h2 className="font-serif text-3xl text-fuchsia-400 mb-3">Daily Insight</h2>
        {horoscope ? (
          <p className="text-gray-300 mb-6 min-h-[60px] italic">"{horoscope}"</p>
        ) : (
          <p className="text-gray-300 mb-6 min-h-[60px]">See what the stars have in store for you today.</p>
        )}
      </div>
      <button
        onClick={fetchHoroscope}
        disabled={isLoading}
        className="font-sans font-bold text-white px-8 py-3 rounded-full bg-button-gradient hover:bg-button-gradient-hover transition-all duration-300 ease-in-out shadow-lg shadow-brand-red/20 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Contemplating...' : "Ask Sophia"}
      </button>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // This setup logic remains the same
    const setupDashboard = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth/login'); return; }
      let { data: existingProfile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (!existingProfile) {
        router.push('/onboarding/natal-chart');
      } else {
        setProfile(existingProfile);
      }
      setIsLoading(false);
    };
    setupDashboard();
  }, [router]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Loading Dashboard...</div>;
  }
  if (!profile) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Redirecting...</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-4 md:p-8 pt-16 text-center bg-gray-900">
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-12">
            <h1 className="font-serif text-5xl font-bold mb-2">Your Mystical Dashboard</h1>
            <p className="text-gray-400 text-lg">
                Welcome, Seeker. Your Sun shines in <span className="font-bold text-amber-400">{profile.sun_sign}</span>.
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard 
            title="Daily Draw"
            description="The tarot awaits. Draw your card to receive guidance."
            link="/daily-draw"
            buttonText="Draw My Card"
          />
          <DashboardCard 
            title="My Natal Chart"
            description="Explore the cosmic blueprint of your soul's journey."
            link="/onboarding/natal-chart"
            buttonText="View My Chart"
          />
          {/* Using our new interactive card */}
          <HoroscopeCard />
        </div>
        <div className="mt-12">
            <SignOutButton />
        </div>
      </div>
    </div>
  );
}