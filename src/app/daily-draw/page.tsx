// src/app/daily-draw/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import Image from 'next/image'; // For background image
import tarotCards from '@/data/tarot_cards.json'; // Import your tarot cards data

// Import the specific background image for the daily draw page
import dailyDrawBg from '/public/images/backgrounds/tarot-draw-bg.png'; // Adjust path/filename/extension

// Define the TarotCard interface (update to include video_url)
interface TarotCard {
  id: string;
  name: string;
  suit: string;
  value: number;
  keywords: string[];
  meaning_upright: string;
  meaning_reversed: string;
  image: string; // Still useful for poster or fallback
  video_url?: string; // <--- ADD THIS
  video_webm_url?: string; // <--- ADD THIS (optional)
}

export default function DailyDrawPage() {
  const [drawnCard, setDrawnCard] = useState<TarotCard | null>(null);
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const effectRan = useRef(false); // Strict Mode mitigation

  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && effectRan.current) {
      return;
    }

    const performDailyDraw = async () => {
      setIsLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }

      const { data: userProfile, error: fetchProfileError } = await supabase
        .from('profiles')
        .select('sun_sign')
        .eq('id', user.id)
        .single();

      if (fetchProfileError || !userProfile?.sun_sign) {
        console.error('Error fetching sun sign:', fetchProfileError);
        setError('Could not retrieve your sun sign for interpretation.');
        setIsLoading(false);
        return;
      }

      try {
        const randomIndex = Math.floor(Math.random() * tarotCards.length);
        const newDrawnCard: TarotCard = tarotCards[randomIndex] as TarotCard;

        const interpretationResponse = await fetch('/api/interpret-tarot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cardName: newDrawnCard.name,
            cardMeaningUpright: newDrawnCard.meaning_upright,
            userSunSign: userProfile.sun_sign,
          }),
        });

        const interpretationData = await interpretationResponse.json();

        if (!interpretationResponse.ok) {
          throw new Error(interpretationData.error || 'Failed to get interpretation.');
        }

        const newInterpretation = interpretationData.interpretation;

        setDrawnCard(newDrawnCard);
        setInterpretation(newInterpretation);
        console.log("Card drawn and interpretation received.");

      } catch (err: any) {
        console.error("Daily Draw Error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    performDailyDraw();
    effectRan.current = true;
  }, [router, supabase]);

  if (isLoading) {
    return (
      // Loading state with background
      <div className="relative min-h-screen text-white flex flex-col items-center justify-center p-4 md:p-8">
        <Image
          src={dailyDrawBg}
          alt="Daily Draw Background"
          fill
          sizes="100vw"
          priority
          className="object-cover pointer-events-none z-[-2]"
        />
        <div className="absolute inset-0 bg-black opacity-50 z-[-1]"></div>
        <div className="relative z-10 w-full max-w-2xl bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 text-center">
          <p className="font-serif text-fuchsia-400 text-2xl animate-pulse">Drawing your card...</p>
        </div>
      </div>
    );
  }

  return (
    // Outer div for background
    <div className="relative min-h-screen text-white">
      <Image
        src={dailyDrawBg} // Your daily draw background image
        alt="Daily Draw Background"
        fill
        sizes="100vw"
        priority
        className="object-cover pointer-events-none z-[-2]"
      />
      <div className="absolute inset-0 bg-black opacity-50 z-[-1]"></div> {/* Adjust opacity as needed */}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center min-h-screen p-4 md:p-8 pt-16 text-center">
        <div className="w-full max-w-2xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
          <h1 className="font-serif text-5xl font-bold mb-4 text-fuchsia-400">Your Daily Draw</h1>
          <p className="text-gray-400 mb-8">
            The cosmos whispers a message just for you today.
          </p>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {drawnCard && interpretation ? (
            // Display drawn card and interpretation
            <div className="space-y-6">
              <h2 className="font-serif text-3xl text-amber-400">The {drawnCard.name}</h2>
              
              {/* --- NEW: VIDEO DISPLAY FOR THE CARD --- */}
              {drawnCard.video_url && (
                <div className="relative w-full max-w-xs mx-auto rounded-lg overflow-hidden shadow-xl border border-gray-700">
                  <video
                    key={drawnCard.id} // Important for React to re-render video when card changes
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster={drawnCard.image ? `/images/tarot/${drawnCard.image}` : undefined} // Use the static image as poster
                    className="w-full h-auto object-cover"
                    controls={false} // Hide controls for a cleaner look
                  >
                    {drawnCard.video_url && <source src={drawnCard.video_url} type="video/mp4" />}
                    {drawnCard.video_webm_url && <source src={drawnCard.video_webm_url} type="video/webm" />}
                    {/* Fallback text if video not supported */}
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
              {/* --- END NEW VIDEO DISPLAY --- */}

              <p className="text-gray-300 text-lg italic leading-relaxed">"{interpretation}"</p>
              <p className="text-sm text-gray-500">Meaning (Upright): {drawnCard.meaning_upright}</p>
            </div>
          ) : (
            // Fallback if no card could be drawn/interpreted
            <p className="text-gray-400">Unable to reveal your daily card at this time.</p>
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