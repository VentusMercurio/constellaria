// src/app/auth/login/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // <--- Import Image component
import { createClient } from '@/lib/supabase/client';

// Import your antechamber background image
// Using the absolute path from public/
import antechamberBg from '/public/images/backgrounds/antechamber-bg.png'; // <--- Import your background image


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else if (data.user) {
      // THIS IS THE NEW LOGIC: After successful login, check for a profile.
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .single();
      
      if (profile) {
        // If profile exists, they are a returning user. Go to dashboard.
        router.push('/dashboard');
      } else {
        // If no profile, they are a new user. Go to onboarding.
        router.push('/onboarding/natal-chart');
      }
      router.refresh();
    }
  };

  return (
    // <--- 1. Outermost container with positioning for background image and text color
    <div className="relative min-h-screen text-white">

      {/* <--- 2. Background Image (fills parent, pushed to back) */}
      <Image
        src={antechamberBg} // The imported image
        alt="Antechamber Background"
        fill // Fills the parent element
        sizes="100vw" // Optimizes image loading for full viewport width
        priority // Optimizes for LCP (Largest Contentful Paint)
        className="object-cover pointer-events-none z-[-2]" // z-index to send it to the back
      />

      {/* <--- 3. Semi-transparent dark overlay (sits between image and content) */}
      <div className="absolute inset-0 bg-black opacity-50 z-[-1]"></div> {/* Ensure opacity-50, not opacity 50 */}

      {/* <--- 4. Content wrapper (positioned above overlay) */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4"> {/* Removed bg-gray-900 from here */}
        <div className="w-full max-w-md text-center">
          <h1 className="font-serif text-5xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-400 mb-8">Sign in to your account.</p>
          <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-2xl shadow-xl space-y-6">
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your Password"
              required
              className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            />
            <button type="submit" className="w-full font-sans font-bold text-white px-8 py-3 rounded-full bg-button-gradient hover:bg-button-gradient-hover">
              Log In
            </button>
            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          </form>
          <p className="text-gray-500 text-sm mt-6">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-fuchsia-500 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}