// src/app/api/interpret-tarot/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Parse the incoming request body from the cron job
    const { cardName, cardMeaningUpright, userSunSign } = await request.json();

    if (!cardName || !cardMeaningUpright || !userSunSign) {
      return NextResponse.json({ error: 'Missing required interpretation parameters' }, { status: 400 });
    }

    // Call your Python FastAPI endpoint for interpretation
    // IMPORTANT: Replace 'http://127.0.0.1:8000' with your deployed Python API URL
    const pythonApiUrl = process.env.PYTHON_API_URL || 'http://127.0.0.1:8000'; // Define PYTHON_API_URL in .env.local
    const pythonEndpoint = `${pythonApiUrl}/interpret-tarot`; // This will be the new endpoint in your Python app

    const pythonApiResponse = await fetch(pythonEndpoint, {
      method: 'POST', // This will be a POST request to your Python backend
      headers: {
        'Content-Type': 'application/json',
        // If your Python API needs an API key or secret, add it here:
        // 'X-API-Key': process.env.PYTHON_API_KEY,
      },
      body: JSON.stringify({
        card_name: cardName, // Match Python's expected payload keys
        card_meaning_upright: cardMeaningUpright,
        user_sun_sign: userSunSign,
      }),
    });

    const data = await pythonApiResponse.json();

    if (!pythonApiResponse.ok) {
      // Forward the error from the Python API
      console.error('Python Tarot Interpretation API Error:', data.detail || data.error);
      return NextResponse.json({ error: data.detail || data.error || 'Python API error for tarot interpretation' }, { status: pythonApiResponse.status });
    }

    // Return the interpretation from the Python API
    return NextResponse.json({ interpretation: data.interpretation });

  } catch (error: any) {
    console.error("Interpret Tarot Proxy API Error:", error);
    return NextResponse.json({ error: "An internal server error occurred during tarot interpretation." }, { status: 500 });
  }
}