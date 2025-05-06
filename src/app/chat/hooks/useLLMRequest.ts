"use client";
import { useState } from "react";
import { togetherClient } from "@/lib/llm/together";
import { ILLMConfig } from "@/types/llm";
import { IChatMessage } from "@/types/chat";

export function useLLMRequest({
  model = "deepseek-ai/DeepSeek-V3",
  config = {},
}: {
  model?: string;
  config?: Partial<ILLMConfig>;
} = {}) {
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const defaultConfig: ILLMConfig = {
    temperature: 0.7,
    top_p: 0.9,
    top_k: 50,
    // max_length: 200,
    // min_length: 10,
    // stop: ["\n"],
    // presence_penalty: 0,
    // frequency_penalty: 0,
    ...config,
  };

  const requestLLM = async ({
    message,
    history,
    onStreamUpdate,
    onComplete,
  }: {
    message: string;
    history: IChatMessage[];
    onStreamUpdate?: (partial: string) => void;
    onComplete?: (final: string) => void;
  }) => {
    setLoading(true);
    setError(null);
    setResponse("");

    let content = "";

    try {
      const stream = await togetherClient.chat.completions.create({
        model,
        messages: [...history, { role: "user", content: message }],
        ...defaultConfig,
        stream: true,
      });

      for await (const chunk of stream) {
        content += chunk.choices[0]?.delta?.content || "";
        setResponse(content);
        onStreamUpdate?.(content);
      }

      onComplete?.(content);
    } catch (err) {
      console.error("Error during LLM request:", err);
      setError("An error occurred while fetching the response.");
    } finally {
      setLoading(false);
    }

    return content;  // return the final content
  };

  const reset = () => {
    setResponse("");
    setLoading(false);
    setError(null);
  };

  const cancel = () => { 
    // Cancel while streaming. TODO: implement this
    setLoading(false);
  };

  return { response, loading, error, requestLLM, reset, cancel };
}
