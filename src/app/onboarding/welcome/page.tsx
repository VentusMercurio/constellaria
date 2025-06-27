// src/app/onboarding/welcome/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image'; // Assuming you want a background here too

// Import the specific background image for the welcome page
// Assuming 'onboarding-welcome-bg.png' exists in your backgrounds folder
import onboardingWelcomeBg from '/public/images/backgrounds/onboarding-welcome-bg.png'; // Adjust path and filename


export default function WelcomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('Verifying your journey...');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleVerificationAndProfileCheck = async () => {
      // 1. Ensure user is logged in (session is active after email click)
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        setMessage('Verification failed or session expired. Please try logging in.');
        router.push('/auth/login'); // Redirect to login if session is not active
        return;
      }

      setMessage(`Welcome, Seeker! We're preparing your cosmic journey.`);

      // 2. Check if user already has a profile (meaning a chart is generated)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') { // PGRST116 means "no row found" which is expected for new users
        console.error('Error fetching profile:', profileError);
        setMessage('Error loading your profile. Please try again.');
        return;
      }

      setIsLoading(false);

      if (profile) {
        // User has a profile (already generated chart)
        setMessage('Welcome back! Proceed to your dashboard.');
        router.push('/dashboard');
      } else {
        // New user, no profile yet. Redirect to natal chart generation.
        setMessage('Your cosmic blueprint awaits! Let\'s generate your natal chart.');
        router.push('/onboarding/natal-chart');
      }
    };

    handleVerificationAndProfileCheck();
  }, [router, supabase]);

  // BackgroundWrapper component (re-used here, adjust image source)
  const BackgroundWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="relative min-h-screen text-white">
      <Image
        src={onboardingWelcomeBg} // Use the specific welcome background here
        alt="Welcome Background"
        fill
        sizes="100vw"
        priority
        className="object-cover pointer-events-none z-[-2]"
      />
      <div className="absolute inset-0 bg-black opacity-50 z-[-1]"></div> {/* Adjust opacity as needed */}
      {children}
    </div>
  );

  return (
    <BackgroundWrapper>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <div className="w-full max-w-md">
          <h1 className="font-serif text-5xl font-bold mb-4">Welcome to Constellaria!</h1>
          <p className="text-gray-300 text-lg mb-8">{message}</p>
          {isLoading && (
            <div className="text-fuchsia-400">
              <p>Loading...</p> {/* Or add a spinner here */}
            </div>
          )}
        </div>
      </div>
    </BackgroundWrapper>
  );
}