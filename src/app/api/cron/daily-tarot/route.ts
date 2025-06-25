// src/app/api/cron/daily-tarot/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';
import { headers } from 'next/headers';

// Import your centralized types for user profiles (still needed for email)
import { UserProfileWithEmail } from '@/types/astrology'; // Adjust path if needed

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = headers().get('Authorization');

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    console.error('Unauthorized attempt to access daily-tarot cron job.');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient();
  let processedUsers = 0;
  let failedUsers = 0;

  try {
    const { data: users, error: fetchError } = await supabase
      .from('profiles')
      .select('id, users(email)') // Only need ID and email now, sun_sign is not for the email content
      .returns<UserProfileWithEmail[]>();

    if (fetchError) {
      console.error('Error fetching users from Supabase:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    if (!users || users.length === 0) {
      console.log('No users found to send daily tarot notifications.');
      return NextResponse.json({ message: 'No users found' }, { status: 200 });
    }

    console.log(`Processing daily tarot notifications for ${users.length} users.`);

    for (const userProfile of users) {
      const userEmail = userProfile.users?.email;

      if (!userEmail) {
        console.warn(`Skipping user ${userProfile.id}: No email found or linked.`);
        failedUsers++;
        continue;
      }

      try {
        // Assemble simple email content
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

        // Send Email via Resend
        await resend.emails.send({
          from: 'Constellaria <onboarding@yourdomain.com>', // IMPORTANT: Replace with your verified sender domain
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