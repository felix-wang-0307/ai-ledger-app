
import Together from 'together-ai';

export const togetherClient = new Together({
  apiKey: process.env.NEXT_PUBLIC_TOGETHER_API_KEY,
});