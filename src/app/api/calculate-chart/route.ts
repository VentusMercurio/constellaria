import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();

    // The direct, unchanging URL to our locally running Python server
    const pythonApiUrl = 'http://127.0.0.1:8000/calculate-chart';

    const pythonApiResponse = await fetch(pythonApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    const data = await pythonApiResponse.json();

    if (!pythonApiResponse.ok) {
      return NextResponse.json({ error: data.detail || 'Python API error' }, { status: pythonApiResponse.status });
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Proxy API Error:", error);
    // This now correctly returns a JSON error response
    return NextResponse.json({ error: "Failed to connect to the Python calculation engine." }, { status: 500 });
  }
}