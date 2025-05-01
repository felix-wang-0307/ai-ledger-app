// lib/llm.ts

import Together from 'together-ai';
import { IChatMessage } from '@/types/chat';

const DEFAULT_MODEL = "Qwen/Qwen3-235B-A22B-fp8-tput";

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});


/**
 * Basic chat completion
 */
export async function getChatCompletion(messages: IChatMessage[] = [], model = DEFAULT_MODEL) {
  const response = await together.chat.completions.create({
    model,
    messages,
  });

  return response.choices[0]?.message?.content || '';
}

/**
 * Streaming chat completion
 */
export async function* streamChatCompletion(messages: IChatMessage[] = [], model = DEFAULT_MODEL) {
  const stream = await together.chat.completions.create({
    model,
    messages,
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      yield content;
    }
  }
}
