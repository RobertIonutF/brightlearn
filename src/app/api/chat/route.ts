// src/app/api/chat/route.ts
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const model = openai('gpt-4o-2024-08-06');

  const result = await streamText({
    model,
    messages,
    maxTokens: 1024,
    temperature: 0.7,
    topP: 1,
  });

  return result.toAIStreamResponse();
}