import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { locationQuery } = await request.json();

    if (!locationQuery) {
      return NextResponse.json({ error: 'Location query is required.' }, { status: 400 });
    }

    // --- 1. Geocoding using a free, public service (Nominatim) ---
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationQuery)}&format=json&limit=1`;
    
    const geocodeResponse = await fetch(geocodeUrl, {
      headers: { 'User-Agent': 'ConstellariaApp/1.0' } // Required by Nominatim
    });

    if (!geocodeResponse.ok) {
        throw new Error('Geocoding service failed.');
    }

    const geocodeData = await geocodeResponse.json();

    if (!geocodeData || geocodeData.length === 0) {
      return NextResponse.json({ error: 'Location not found.' }, { status: 404 });
    }

    const { lat, lon } = geocodeData[0];
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    // --- 2. Timezone Lookup using TimezoneDB ---
    const timezoneApiKey = process.env.TIMEZONEDB_API_KEY;
    if (!timezoneApiKey) {
      throw new Error('TimezoneDB API key is not configured.');
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const timezoneUrl = `http://api.timezonedb.com/v2.1/get-time-zone?key=${timezoneApiKey}&format=json&by=position&lat=${latitude}&lng=${longitude}&time=${timestamp}`;
    
    const timezoneResponse = await fetch(timezoneUrl);
    if (!timezoneResponse.ok) {
      throw new Error('TimezoneDB service failed.');
    }

    const timezoneData = await timezoneResponse.json();
    if (timezoneData.status !== 'OK') {
      throw new Error(timezoneData.message || 'Failed to get timezone.');
    }

    // --- 3. Return the combined data ---
    return NextResponse.json({
      latitude,
      longitude,
      timezone: timezoneData.zoneName,
    });

  } catch (error: any) {
    console.error("Error in lookup-location API:", error);
    return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
  }
}