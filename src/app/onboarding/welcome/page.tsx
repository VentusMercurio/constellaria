// src/app/onboarding/welcome/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

// Import the specific background image for the welcome page
import onboardingWelcomeBg from '/public/images/backgrounds/onboarding-welcome-bg.png'; // Adjust path and filename


export default function WelcomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('Verifying your journey...');
  const [redirectPath, setRedirectPath] = useState<string | null>(null); // New state to store the determined redirect path
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleVerificationAndProfileCheck = async () => {
      // 1. Ensure user is logged in (session is active after email click)
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        setMessage('Verification failed or session expired. Please try logging in.');
        setRedirectPath('/auth/login'); // Set login path if verification fails
        setIsLoading(false);
        return;
      }

      // 2. Check if user already has a profile (meaning a chart is generated)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') { // PGRST116 means "no row found" which is expected for new users
        console.error('Error fetching profile:', profileError);
        setMessage('Error loading your profile. Please try again.');
        setRedirectPath('/auth/login'); // Fallback to login on error
        setIsLoading(false);
        return;
      }

      // Set the message and the redirect path based on profile existence
      if (profile) {
        // User has a profile (already generated chart)
        setMessage('Welcome back, Seeker! Your mystical journey continues from your Dashboard.');
        setRedirectPath('/dashboard'); // Store dashboard path
      } else {
        // New user, no profile yet. Redirect to natal chart generation.
        setMessage('Welcome, Seeker! Your cosmic blueprint awaits. Let\'s generate your natal chart to begin.');
        setRedirectPath('/onboarding/natal-chart'); // Store natal chart path
      }

      setIsLoading(false); // End loading, which will reveal the button
    };

    handleVerificationAndProfileCheck();
  }, [router, supabase]); // Dependencies remain the same

  // Function to handle the button click
  const handleProceed = () => {
    if (redirectPath) {
      router.push(redirectPath);
    }
  };

  // BackgroundWrapper component (re-used here, adjust image source)
  const BackgroundWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="relative min-h-screen text-white">
      <Image
        src={onboardingWelcomeBg}
        alt="Welcome Background"
        fill
        sizes="100vw"
        priority
        className="object-cover pointer-events-none z-[-2]"
      />
      <div className="absolute inset-0 bg-black opacity-50 z-[-1]"></div>
      {children}
    </div>
  );

  return (
    <BackgroundWrapper>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700"> {/* Added styling to the inner content box */}
          <h1 className="font-serif text-5xl font-bold mb-4">Welcome to Constellaria!</h1>
          <p className="text-gray-300 text-lg mb-8">{message}</p>
          
          {/* Show loading indicator or button based on state */}
          {isLoading ? (
            <div className="text-fuchsia-400">
              <p>Loading...</p> {/* Or add a spinner here */}
            </div>
          ) : (
            // Only show button if redirectPath has been determined
            redirectPath && (
              <button
                onClick={handleProceed}
                className="font-sans font-bold text-white px-8 py-3 rounded-full bg-button-gradient hover:bg-button-gradient-hover transition-all duration-300 ease-in-out shadow-lg shadow-brand-red/20 transform hover:scale-105 inline-block"
              >
                {/* Dynamic button text based on redirect path */}
                {redirectPath === '/dashboard' ? 'Go to Dashboard' : 'Generate My Chart'}
              </button>
            )
          )}

          {/* Optional: Error message if something went wrong and redirectPath is null */}
          {redirectPath === null && !isLoading && (
            <p className="text-red-500 text-sm mt-4">An unexpected error occurred. Please try again.</p>
          )}
        </div>
      </div>
    </BackgroundWrapper>
  );
}