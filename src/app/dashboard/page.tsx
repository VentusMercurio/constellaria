// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import Image from 'next/image';
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

  // Use a placeholder for the user alias for now, matching the mockup
  const userAlias = profile?.display_name || 'Aria the Seeker'; // Assuming 'display_name' or 'name' in profile

  return (
    // Outer div for background
    <div className="relative min-h-screen text-white">
      <Image
        src={dashboardBg} // Your dashboard background image
        alt="Dashboard Background"
        fill
        sizes="100vw"
        priority
        className="object-cover center-top pointer-events-none z-[-2]"
      />
      <div className="absolute inset-0 bg-black opacity-50 z-[-1]"></div> {/* Adjust opacity as needed */}

      {/* Main content, relative and z-indexed above background/overlay */}
      <div className="relative z-10 flex flex-col items-center min-h-screen p-4 md:p-8 pt-16 text-center">
        <div className="w-full max-w-6xl mx-auto space-y-12"> {/* Increased max-width */}

          {/* --- TOP HEADER SECTION --- */}
          <div className="text-center mb-8">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-amber-300 mb-2 tracking-wider">
              CONSTELLARIA SANCTUM
            </h1>
            <p className="text-lg md:text-xl text-gray-300">
              Welcome, {userAlias}! Your Sun shines in <span className="font-bold text-fuchsia-300">{profile.sun_sign || 'Libra'}</span> {/* Default to Libra if sun_sign is null for some reason */}
            </p>
          </div>

          {/* --- NEW: USER STATS / INFO CONTAINER --- */}
          <div className="relative mx-auto max-w-xl p-0.5 rounded-xl border border-amber-300 shadow-lg shadow-amber-500/20">
            {/* Inner content box for stats */}
            <div className="bg-gray-900 bg-opacity-80 backdrop-blur-sm p-6 rounded-xl grid grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-8 text-center items-center justify-center">
              
              {/* Stat 1: Mystic Alias */}
              <div className="flex flex-col items-center justify-center">
                <p className="text-lg text-gray-400 font-serif">Mystic Alias;</p>
                <div className="font-bold text-fuchsia-300 text-2xl flex items-center mt-1">
                  {/* Placeholder icon (replace with actual SVG later) */}
                  <span className="text-xl mr-2">✉</span> {/* Envelope icon for alias */}
                  {userAlias}
                </div>
              </div>

              {/* Stat 2: Level */}
              <div className="flex flex-col items-center justify-center">
                <p className="text-lg text-gray-400 font-serif">Level;</p>
                <div className="font-bold text-amber-300 text-2xl flex items-center mt-1">
                  <span className="text-xl mr-2">★</span> {/* Star icon for level */}
                  Adept Stargazer
                </div>
              </div>

              {/* Stat 3: Wisdom */}
              <div className="flex flex-col items-center justify-center">
                <p className="text-lg text-gray-400 font-serif">Wisdom</p>
                <div className="font-bold text-fuchsia-300 text-2xl flex items-center mt-1">
                  <span className="text-xl mr-2">☆</span> {/* Empty star icon for wisdom */}
                  1200
                </div>
              </div>

              {/* Stat 4: Wisdom +Days */}
              <div className="flex flex-col items-center justify-center">
                <p className="text-lg text-gray-400 font-serif">Wisdom</p>
                <div className="font-bold text-amber-300 text-2xl flex items-center mt-1">
                  <span className="text-xl mr-2">⚗</span> {/* Trident/Ankh-like icon for wisdom days */}
                  +50 DAYS
                </div>
              </div>

            </div>
          </div>
          {/* --- END NEW: USER STATS / INFO CONTAINER --- */}


          {/* --- "TODAY'S MISSIONS" SECTION DIVIDER (Stylized) --- */}
          <div className="relative w-full my-8 flex items-center justify-center">
            <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
            <h2 className="font-serif text-3xl text-amber-300 relative z-10 bg-gray-900 px-6 py-2 rounded-lg shadow-md border border-amber-300">
              TODAY'S MISSIONS
            </h2>
          </div>

          {/* --- MISSION CARDS GRID (EXISTING) --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: Daily Draw */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 text-center flex flex-col justify-between">
              <div>
                <h2 className="font-serif text-3xl text-fuchsia-400 mb-2">Daily Draw</h2>
                <h3 className="font-serif text-xl text-amber-300 mb-3">TAROT QUEST</h3>
                <p className="text-gray-300 mb-6 min-h-[40px]">The tarot awaits. Draw your card for guidance.</p>
              </div>
              <Link href="/daily-draw">
                <span className="font-sans font-bold text-white px-8 py-3 rounded-full bg-button-gradient hover:bg-button-gradient-hover transition-all duration-300 ease-in-out shadow-lg shadow-brand-red/20 transform hover:scale-105 inline-block">
                  Draw My Card
                </span>
              </Link>
              <p className="text-amber-300 mt-4 text-lg">+ 100 Wisdom</p>
            </div>

            {/* Card 2: Star Chart Codex */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 text-center flex flex-col justify-between">
              <div>
                <h2 className="font-serif text-3xl text-fuchsia-400 mb-2">Star Chart</h2>
                <h3 className="font-serif text-xl text-amber-300 mb-3">CODEX</h3>
                <p className="text-gray-300 mb-6 min-h-[40px]">Explore your cosmic blueprint.</p>
              </div>
              <Link href="/my-chart">
                <span className="font-sans font-bold text-white px-8 py-3 rounded-full bg-button-gradient hover:bg-button-gradient-hover transition-all duration-300 ease-in-out shadow-lg shadow-brand-red/20 transform hover:scale-105 inline-block">
                  View My Chart
                </span>
              </Link>
              <p className="text-green-400 mt-4 text-lg">✓ Chart Generated</p> {/* Static for now */}
            </div>

            {/* Card 3: Sophia's Insight */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 text-center flex flex-col justify-between">
              <div>
                <h2 className="font-serif text-3xl text-fuchsia-400 mb-2">Sophia's</h2>
                <h3 className="font-serif text-xl text-amber-300 mb-3">INSIGHT</h3>
                <p className="text-gray-300 mb-6 min-h-[40px]">Hear Sophia's whisper for today.</p>
              </div>
              <Link href="/daily-ephemeris">
                <span className="font-sans font-bold text-white px-8 py-3 rounded-full bg-button-gradient hover:bg-button-gradient-hover transition-all duration-300 ease-in-out shadow-lg shadow-brand-red/20 transform hover:scale-105 inline-block">
                  Ask Sophia
                </span>
              </Link>
              <p className="text-amber-300 mt-4 text-lg">+ 100 Wisdom</p>
            </div>
          </div>

          {/* --- "COSMIC UPDATES" SECTION DIVIDER (Stylized) --- */}
          <div className="relative w-full my-8 flex items-center justify-center">
            <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
            <h2 className="font-serif text-3xl text-amber-300 relative z-10 bg-gray-900 px-6 py-2 rounded-lg shadow-md border border-amber-300">
              COSMIC UPDATES
            </h2>
          </div>

          {/* --- COSMIC UPDATES LIST --- */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 text-left space-y-4">
            <p className="text-gray-300"><span className="text-amber-300 font-bold">Mars enters Leo today.</span></p>
            <p className="text-gray-300"><span className="text-fuchsia-300 italic">Sophia whispers:</span> The time is ripe for courage.</p>
            <p className="text-gray-300"><span className="text-blue-300 font-bold">New Feature:</span> Tarot Journal Coming Soon!</p>
          </div>

          {/* Sign Out Button */}
          <div className="mt-12">
              <SignOutButton />
          </div>

        </div>
      </div>
    </div>
  );
}