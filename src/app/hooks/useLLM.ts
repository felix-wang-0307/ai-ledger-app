'use client';
import { useState } from 'react';
import { togetherClient } from '@/lib/llm/together';

interface ILLMConfig {
  temperature?: number;
  top_p?: number;
  top_k?: number;
  max_length?: number;
  min_length?: number;
  stop?: string[];
  presence_penalty?: number;
  frequency_penalty?: number;
};

export function useLLM(model = 'deepseek-ai/DeepSeek-V3', config: ILLMConfig = {}) {
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const defaultConfig: ILLMConfig = {
    temperature: 0.7,
    top_p: 0.9,
    top_k: 50,
    max_length: 200,
    min_length: 10,
    stop: ['\n'],
    presence_penalty: 0,
    frequency_penalty: 0,
    ...config,
  };

  const requestLLM = async (message: string) => {
    setLoading(true);
    setError(null);
    setResponse('');

    try {
      const stream = await togetherClient.chat.completions.create({
        model,
        messages: [{ role: 'user', content: message }],
        ...defaultConfig,
        stream: true,
      });

      let content = '';

      for await (const chunk of stream) {
        content += chunk.choices[0]?.delta?.content || '';
        setResponse(content);
      }
    } catch (err) {
      console.error('Error during LLM request:', err);
      setError('An error occurred while fetching the response.');
    } finally {
      setLoading(false);
    }
  };

  return { response, loading, error, requestLLM };
}
