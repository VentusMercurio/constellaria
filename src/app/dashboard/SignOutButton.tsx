'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/'); // Redirect to home page after sign out
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className="bg-gray-700 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-gray-600 transition-colors"
    >
      Sign Out
    </button>
  );
}