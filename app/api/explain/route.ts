import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { tx } = await req.json();

    const prompt = `
Explain this Ethereum transaction in simple terms for a beginner.

Value: ${Number(tx.value) / 1e18} ETH
From: ${tx.from}
To: ${tx.to}
Gas Used: ${tx.gasUsed}

Keep it short (max 4 sentences).
`;

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: 500 });
    }

    const data = await res.json();

    return NextResponse.json({
      explanation: data.choices[0].message.content,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
