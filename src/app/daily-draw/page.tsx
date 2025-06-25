// src/app/daily-draw/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react'; // Import useRef
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import tarotCards from '@/data/tarot_cards.json'; // Import your tarot cards data

// Define the TarotCard interface (can also be centralized in src/types/astrology.d.ts if preferred)
interface TarotCard {
  id: string;
  name: string;
  suit: string;
  value: number; // Ensure this is number, and your JSON values are numbers
  keywords: string[];
  meaning_upright: string;
  meaning_reversed: string;
  image: string;
}

export default function DailyDrawPage() {
  const [drawnCard, setDrawnCard] = useState<TarotCard | null>(null);
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient(); // Initialize Supabase client once

  const effectRan = useRef(false); // <--- Add this ref for Strict Mode mitigation

  useEffect(() => {
    // Strict Mode mitigation: Only run the effect once in development
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

      // Fetch user's sun sign (still needed for personalized interpretation)
      const { data: userProfile, error: fetchProfileError } = await supabase
        .from('profiles')
        .select('sun_sign') // Only need sun_sign now
        .eq('id', user.id)
        .single();

      if (fetchProfileError || !userProfile?.sun_sign) {
        console.error('Error fetching sun sign:', fetchProfileError);
        setError('Could not retrieve your sun sign for interpretation.');
        setIsLoading(false);
        return;
      }

      try {
        // 1. Select a random tarot card
        const randomIndex = Math.floor(Math.random() * tarotCards.length);
        const newDrawnCard: TarotCard = tarotCards[randomIndex] as TarotCard;

        // 2. Request personalized interpretation from Next.js proxy route
        const interpretationResponse = await fetch('/api/interpret-tarot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cardName: newDrawnCard.name,
            cardMeaningUpright: newDrawnCard.meaning_upright,
            userSunSign: userProfile.sun_sign, // Use the user's sun sign from profile
          }),
        });

        const interpretationData = await interpretationResponse.json();

        if (!interpretationResponse.ok) {
          throw new Error(interpretationData.error || 'Failed to get interpretation.');
        }

        const newInterpretation = interpretationData.interpretation;

        // 3. Update state to display the card
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
    effectRan.current = true; // <--- Set ref to true after the first run
  }, [router, supabase]); // Add supabase to dependencies

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Drawing your card...</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-4 md:p-8 pt-16 text-center bg-gray-900 text-white">
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
            {/* Display card image if you have it */}
            {/* {drawnCard.image && (
              <img src={`/images/tarot/${drawnCard.image}`} alt={drawnCard.name} className="mx-auto w-48 h-auto rounded-lg shadow-md" />
            )} */}
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
  );
}