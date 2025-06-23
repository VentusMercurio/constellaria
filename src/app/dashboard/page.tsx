import { createClient } from '@/lib/supabase/server'; // We will create this server client next
import { redirect } from 'next/navigation';
import SignOutButton from './SignOutButton';

// Define a type for our profile data for better type safety
interface Profile {
  id: string;
  sun_sign: string;
  chart_data: any; 
}

export default async function DashboardPage() {
  // This now correctly uses the server client from '@supabase/ssr'
  const supabase = createClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If no user is logged in, protect the page by redirecting to login
  if (!user) {
    return redirect('/auth/login');
  }

  // Fetch the user's profile from our 'profiles' table
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id) // Use the correct user id from the new method
    .single();

  // If there's an error or the profile doesn't exist, handle it gracefully
  if (error || !profile) {
    console.error("Error fetching profile or profile not found:", error);
    return redirect('/onboarding/natal-chart');
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-4 pt-16 text-center bg-gray-900">
      <div className="w-full max-w-2xl mx-auto">
        <div className="mb-12">
            <h1 className="font-serif text-5xl font-bold mb-2">Your Mystical Dashboard</h1>
            <p className="text-gray-400">
                Welcome, Seeker. Your Sun shines in <span className="font-bold text-amber-400">{profile.sun_sign}</span>.
            </p>
        </div>
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 text-center">
            <h2 className="font-serif text-3xl text-fuchsia-400 mb-4">Daily Divination</h2>
            <p className="text-gray-300 mb-6">
                The cosmos has a message for you. Draw your card to receive Sophia's insight for the day.
            </p>
            <button
              className="font-sans font-bold text-white px-8 py-3 rounded-full bg-button-gradient hover:bg-button-gradient-hover transition-all duration-300 ease-in-out shadow-lg shadow-brand-red/20 transform hover:scale-105"
            >
              Draw My Daily Card
            </button>
        </div>
        <div className="mt-8">
            <SignOutButton />
        </div>
      </div>
    </div>
  );
}