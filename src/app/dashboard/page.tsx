import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SignOutButton from './SignOutButton'; // We'll create this button in the next step

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // If no user is logged in, redirect to the login page.
    return redirect('/auth/login');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-gray-900">
      <div className="w-full max-w-4xl">
        <h1 className="font-serif text-5xl font-bold mb-4">Your Mystical Dashboard</h1>
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl space-y-4">
          <p className="text-lg text-gray-300">Welcome, Seeker.</p>
          <p className="text-md text-gray-400">
            You are logged in as: <span className="font-bold text-fuchsia-400">{user.email}</span>
          </p>
          <div className="pt-4">
            <SignOutButton />
          </div>
        </div>
      </div>
    </div>
  );
}