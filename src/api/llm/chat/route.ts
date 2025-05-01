// app/api/llm/chat/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Together from 'together-ai';

const together = new Together({
  apiKey: process.env.NEXT_PUBLIC_TOGETHER_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages, model = 'Qwen/Qwen3-235B-A22B-fp8-tput' } = await req.json();

    const response = await together.chat.completions.create({
      model,
      messages,
    });

    const content = response.choices[0]?.message?.content || '';

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error in chat completion:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
