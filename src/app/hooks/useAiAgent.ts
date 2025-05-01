'use client';

import { useXAgent } from '@ant-design/x';
import Together from 'together-ai';

const together = new Together({
  apiKey: process.env.NEXT_PUBLIC_TOGETHER_API_KEY,
});

export function useAiAgent(model = 'deepseek-ai/DeepSeek-V3') {
  const [agent] = useXAgent({
    request: async (info, callbacks) => {
      const { messages, message } = info;
      const { onSuccess, onUpdate, onError } = callbacks;

      try {
        const stream = await together.chat.completions.create({
          model,
          messages: [{ role: 'user', content: message }],
          stream: true,
        });

        let content: any = '';

        for await (const chunk of stream) {
          content += chunk.choices[0]?.delta?.content || '';
          onUpdate(content);
        }

        onSuccess(content);
      } catch (error) {
        console.error('Error during AI request:', error);
        onError?.(error);
      }
    },
  });

  return agent;
}
