import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const chartData = await request.json();

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  // Prepare the data for our 'profiles' table
  const sunSign = chartData.planets.find((p: any) => p.name === 'Sun')?.sign || 'Unknown';
  const profileData = {
    id: user.id,
    updated_at: new Date().toISOString(),
    sun_sign: sunSign,
    chart_data: chartData,
  };

  const { error } = await supabase.from('profiles').upsert(profileData);

  if (error) {
    console.error('Error saving profile:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'Profile saved.' });
}