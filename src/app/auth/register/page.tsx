'use client'; // This is a client-side interactive component

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client'; // Using '@' for a cleaner import path

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the form from reloading the page
    setError(null); // Reset any previous errors

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.error('Sign-up Error:', error.message);
      setError(error.message); // Display error to the user
    } else if (data.user) {
      // Sign-up was successful!
      // Now we redirect to the next step of our onboarding.
      router.push('/onboarding/natal-chart');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900">
      <div className="w-full max-w-md text-center">
        <h1 className="font-serif text-5xl font-bold mb-2">Join Constellaria</h1>
        <p className="text-gray-400 mb-8">Create your account to begin.</p>

        <form onSubmit={handleSignUp} className="bg-gray-800 p-8 rounded-2xl shadow-xl space-y-6">
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
            required
            className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          />
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Choose a Password"
            required
            className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          />

          <button
            type="submit"
            className="w-full font-sans font-bold text-white px-8 py-3 rounded-full bg-button-gradient hover:bg-button-gradient-hover transition-all duration-300 ease-in-out shadow-lg shadow-brand-red/20 transform hover:scale-105"
          >
            Create Account
          </button>

          {error && (
            <p className="text-red-500 text-sm mt-4">{error}</p>
          )}
        </form>
        <p className="text-gray-500 text-sm mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-fuchsia-500 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}