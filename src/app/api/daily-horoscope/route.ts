import { NextResponse } from 'next/server';

export async function GET() {
  // This proxy route runs on the server, so it can safely call our Python API.
  try {
    const pythonApiResponse = await fetch('http://127.0.0.1:8000/daily-horoscope', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Cache this result for a few hours so we don't call OpenAI too often
      next: { revalidate: 3600 * 4 }, 
    });

    const data = await pythonApiResponse.json();

    if (!pythonApiResponse.ok) {
      return NextResponse.json({ error: data.detail || 'Python API error for horoscope' }, { status: pythonApiResponse.status });
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Horoscope Proxy API Error:", error);
    return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
  }
}