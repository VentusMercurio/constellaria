// src/app/auth/register/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // <--- 1. Import Image component
import { createClient } from '@/lib/supabase/client';

// <--- 2. Import your antechamber background image
// This path is CRITICAL. Adjust '../../public/' depending on how deep your 'register' file is.
// If register/page.tsx is in src/app/auth, then ../../../public/ is correct.
import antechamberBg from '/public/images/backgrounds/antechamber-bg.png';


export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSuccess(false);

        // --- ADD THIS CONSOLE LOG ---
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/onboarding/welcome`;
    console.log(`[DEBUG RegisterPage] emailRedirectTo value being sent: ${redirectUrl}`);
    // --- END CONSOLE LOG ---
    
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
            options: {
        // This is the URL Supabase will redirect the user to AFTER they click the email verification link
        // Use APP_URL from your environment variables to make this dynamic for local/production
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding/welcome`,
      },
    });


    
    if (error) {
      setError(error.message);
    } else {
      setIsSuccess(true);
    }
  };

  // --- JSX for Success Message ---
  if (isSuccess) {
    return (
      // <--- 3. Outermost container with positioning and text color
      <div className="relative min-h-screen text-white">

        {/* <--- 4. Background Image (fills parent, pushed to back) */}
        <Image
          src={antechamberBg} // The imported image
          alt="Antechamber Background"
          fill // Fills the parent element
          sizes="100vw" // Optimizes image loading for full viewport width
          priority // Optimizes for LCP (Largest Contentful Paint)
          className="object-cover pointer-events-none z-[-2]" // z-index to send it to the back
        />

        {/* <--- 5. Semi-transparent dark overlay (sits between image and content) */}
        <div className="absolute inset-0 bg-black opacity-50 z-[-1]"></div> {/* Ensure opacity-50, not opacity 50 */}

        {/* <--- 6. Content wrapper (positioned above overlay) */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 text-center">
          <h1 className="font-serif text-4xl mb-4">Account Created</h1>
          <p className="text-gray-300 mb-6">Please check your email for a login link.</p>
          <Link href="/auth/login">
            <span className="font-sans font-bold text-white px-8 py-3 rounded-full bg-button-gradient hover:bg-button-gradient-hover">
              Proceed to Login
            </span>
          </Link>
        </div>
      </div>
    );
  }

  // --- JSX for Registration Form ---
  return (
    // <--- 3. Outermost container with positioning and text color
    <div className="relative min-h-screen text-white">

      {/* <--- 4. Background Image (fills parent, pushed to back) */}
      <Image
        src={antechamberBg} // The imported image
        alt="Antechamber Background"
        fill // Fills the parent element
        sizes="100vw" // Optimizes image loading for full viewport width
        priority // Optimizes for LCP (Largest Contentful Paint)
        className="object-cover pointer-events-none z-[-2]" // z-index to send it to the back
      />

      {/* <--- 5. Semi-transparent dark overlay (sits between image and content) */}
      <div className="absolute inset-0 bg-black opacity-50 z-[-1]"></div> {/* Ensure opacity-50, not opacity 50 */}

      {/* <--- 6. Content wrapper (positioned above overlay) */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4"> {/* Removed bg-gray-900 from here */}
        <div className="w-full max-w-md text-center">
          <h1 className="font-serif text-5xl font-bold mb-2">Join Constellaria</h1>
          <p className="text-gray-400 mb-8">Create your account to begin.</p>
          <form onSubmit={handleSignUp} className="bg-gray-800 p-8 rounded-2xl shadow-xl space-y-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
              required
              className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            />
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose a Password"
              required
              className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            />
            <button type="submit" className="w-full font-sans font-bold text-white px-8 py-3 rounded-full bg-button-gradient hover:bg-button-gradient-hover">
              Create Account
            </button>
            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          </form>
          <p className="text-gray-500 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-fuchsia-500 hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}