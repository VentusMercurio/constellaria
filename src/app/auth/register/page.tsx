'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false); // New state for success message

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSuccess(false);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      // On success, we now show a message instead of redirecting
      setIsSuccess(true);
    }
  };

  // If sign-up is successful, show the success message
  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-center text-white">
        <h1 className="font-serif text-4xl mb-4">Account Created</h1>
        <p className="text-gray-300 mb-6">Your place in the cosmos has been reserved.</p>
        <Link href="/auth/login">
          <span className="font-sans font-bold text-white px-8 py-3 rounded-full bg-button-gradient hover:bg-button-gradient-hover">
            Proceed to Login
          </span>
        </Link>
      </div>
    );
  }

  // Otherwise, show the registration form
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900">
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
            value={password}
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
  );
}