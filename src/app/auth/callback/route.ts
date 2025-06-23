import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // The 'next' parameter is used for other flows, like password reset
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
        // This is the new logic:
        // After successful session exchange, we redirect to the welcome page
        // which will then lead to the natal chart page.
        return NextResponse.redirect(`${origin}/onboarding/welcome`);
    }
  }

  // If there's an error or no code, redirect to an error page or home
  console.error("Error in callback or no code found.");
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}