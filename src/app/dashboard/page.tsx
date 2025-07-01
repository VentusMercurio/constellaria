// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import Image from 'next/image'; // Make sure Image is imported for the background
import SignOutButton from './SignOutButton';

// Assuming you have your dashboard background image prepared
import dashboardBg from '/public/images/backgrounds/dashboard-bg.png'; // Adjust path/filename/extension if needed

// A reusable component for our static placeholder cards (KEEP EXISTING)
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

// --- ENSURE THE HOROSCOPECARD COMPONENT IS REMOVED FROM THIS FILE ---
// If you still have it, delete the entire function definition:
// function HoroscopeCard() { /* ... */ }


export default function DashboardPage() {
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
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
    // Loading state with background
    return (
      <div className="relative min-h-screen text-white flex flex-col items-center justify-center p-4 md:p-8">
        <Image
          src={dashboardBg}
          alt="Dashboard Background"
          fill
          sizes="100vw"
          priority
          className="object-cover pointer-events-none z-[-2]"
        />
        <div className="absolute inset-0 bg-black opacity-50 z-[-1]"></div>
        <div className="relative z-10 w-full max-w-4xl bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 text-center">
          <p className="text-fuchsia-400">Loading your mystical dashboard...</p>
        </div>
      </div>
    );
  }
  if (!profile) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Redirecting...</div>;
  }

  return (
    // Outer div for background, similar to LandingPage and other themed pages
    <div className="relative min-h-screen text-white">
      <Image
        src={dashboardBg} // Your dashboard background image
        alt="Dashboard Background"
        fill
        sizes="100vw"
        priority
        className="object-cover pointer-events-none z-[-2]"
      />
      <div className="absolute inset-0 bg-black opacity-50 z-[-1]"></div> {/* Adjust opacity as needed */}

      {/* Main content, relative and z-indexed above background/overlay */}
      <div className="relative z-10 flex flex-col items-center min-h-screen p-4 md:p-8 pt-16 text-center">
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
              link="/my-chart"
              buttonText="View My Chart"
            />
            {/* THIS IS THE MODIFIED CARD FOR DAILY INSIGHT */}
            <DashboardCard
              title="Daily Insight"
              description="See what the stars have in store for you today."
              link="/daily-ephemeris" // <--- ENSURE THIS LINK IS CORRECT
              buttonText="Ask Sophia" // <--- ENSURE THIS BUTTON TEXT IS CORRECT
            />
          </div>
          <div className="mt-12">
              <SignOutButton />
          </div>
        </div>
      </div>
    </div>
  );
}