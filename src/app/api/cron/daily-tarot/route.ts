// src/app/api/cron/daily-tarot/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';
import { headers } from 'next/headers';

// Import your centralized types for user profiles
// NOTE: You'll need to update UserProfileWithEmail to match the view's structure
import { UserProfileWithEmail } from '@/types/astrology'; // We'll modify this interface next

import tarotCards from '@/data/tarot_cards.json';

const resend = new Resend(process.env.RESEND_API_KEY);

interface TarotCard {
  id: string;
  name: string;
  suit: string;
  value: number;
  keywords: string[];
  meaning_upright: string;
  meaning_reversed: string;
  image: string;
}

export async function GET() {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = headers().get('Authorization');

  console.log(`[DEBUG] CRON_SECRET from env: "${cronSecret}"`);
  console.log(`[DEBUG] Authorization Header: "${authHeader}"`);

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    console.error('Unauthorized attempt to access daily-tarot cron job.');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(true);
  let processedUsers = 0;
  let failedUsers = 0;

  try {
    // --- IMPORTANT CHANGE HERE: Use the new view 'auth_users_emails_view' ---
    const { data: users, error: fetchError } = await supabase
      .from('profiles')
      .select('id, sun_sign, auth_users_emails_view(email)') // <--- Changed the join
      .returns<UserProfileWithEmail[]>(); // This type might need adjustment

    if (fetchError) {
      console.error('CRITICAL ERROR: Supabase fetch failed in daily-tarot cron!');
      console.error('Supabase fetch error details:', JSON.stringify(fetchError, null, 2));
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    if (!users || users.length === 0) {
      console.log('No users found to send daily tarot notifications.');
      return NextResponse.json({ message: 'No users found' }, { status: 200 });
    }

    console.log(`Processing daily tarot notifications for ${users.length} users.`);

    for (const userProfile of users) {
      // Access email from the view's object
      const userEmail = userProfile.auth_users_emails_view?.email; // <--- Changed access
      const userSunSign = userProfile.sun_sign;

      if (!userEmail) {
        console.warn(`Skipping user ${userProfile.id}: No email found or linked (via view).`);
        failedUsers++;
        continue;
      }
      if (!userSunSign) {
        console.warn(`Skipping user ${userProfile.id} (${userEmail}): No sun sign found.`);
        failedUsers++;
        continue;
      }

      try {
        const randomIndex = Math.floor(Math.random() * tarotCards.length);
        const newDrawnCard: TarotCard = tarotCards[randomIndex] as TarotCard;

    // --- ADD THIS DEBUG LOG ---
    console.log(`[DEBUG] Attempting to fetch interpretation from: "${process.env.NEXT_PUBLIC_APP_URL}/api/interpret-tarot"`);
    // --- END DEBUG LOG ---


        const interpretationResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/interpret-tarot`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cardName: newDrawnCard.name,
            cardMeaningUpright: newDrawnCard.meaning_upright,
            userSunSign: userSunSign,
          }),
        });

        const interpretationData = await interpretationResponse.json();

        if (!interpretationResponse.ok) {
          throw new Error(interpretationData.error || 'Failed to get interpretation from proxy.');
        }

        const interpretation = interpretationData.interpretation;

        const emailSubject = `Your Daily Constellaria Insight Awaits!`;
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #e2e8f0; padding: 20px; border-radius: 8px;">
            <h1 style="color: #f9a8d4; text-align: center;">Hello Seeker,</h1>
            <p style="text-align: center; color: #a0aec0; margin-bottom: 20px;">
              A new cosmic message is ready for you in Constellaria.
            </p>
            <div style="text-align: center; margin-top: 20px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/daily-draw" style="display: inline-block; padding: 12px 24px; background-color: #ec4899; color: #ffffff; text-decoration: none; border-radius: 9999px; font-weight: bold;">
                Draw Your Card Now
              </a>
            </div>
            <p style="text-align: center; margin-top: 20px; font-size: 0.8em; color: #718096;">
              Sent by Constellaria. May your path be illuminated.
            </p>
          </div>
        `;

        await resend.emails.send({
          from: 'Constellaria <onboarding@theoracleunbound.com>',
          to: userEmail,
          subject: emailSubject,
          html: emailHtml,
        });

        console.log(`Successfully sent daily tarot notification to ${userEmail}`);
        processedUsers++;

      } catch (userError: any) {
        console.error(`Failed to send daily tarot notification to ${userEmail}:`, userError);
        failedUsers++;
      }
    }

    return NextResponse.json({
      message: 'Daily tarot notifications dispatch complete',
      processed: processedUsers,
      failed: failedUsers,
    }, { status: 200 });

  } catch (globalError: any) {
    console.error('Global error in daily-tarot cron job:', globalError);
    return NextResponse.json({ error: globalError.message || 'An unexpected error occurred' }, { status: 500 });
  }
}