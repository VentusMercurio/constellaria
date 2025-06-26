// src/lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient(isCronJob: boolean = false) {
  const cookieStore = cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const keyToUse = isCronJob ? serviceRoleKey : anonKey;

  // --- ADD THESE LOGS FOR DEBUGGING ---
  console.log(`[Supabase Client Init] isCronJob: ${isCronJob}`);
  console.log(`[Supabase Client Init] Using key type: ${isCronJob ? "SERVICE_ROLE" : "ANON"}`);
  console.log(`[Supabase Client Init] Key prefix: ${keyToUse.substring(0, 10)}...`); // Log first 10 chars
  // --- END DEBUG LOGS ---

  return createServerClient(
    supabaseUrl,
    keyToUse, // This is the key being used
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // The `remove` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}