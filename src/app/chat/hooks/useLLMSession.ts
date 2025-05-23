"use client";
import { useEffect, useState } from "react";
import { ILLMConfig } from "@/types/llm";
import { IChatMessage } from "@/types/chat";
import { useLLMRequest } from "./useLLMRequest";
import { addMessageToSession, getOrCreateChatSession } from "@/lib/chatSessionServices";

export function useLLMSession({
  userId,
  sessionId,
  model = "deepseek-ai/DeepSeek-V3",
  config,
}: {
  userId: string;
  sessionId: string;
  model?: string;
  config?: Partial<ILLMConfig>;
}) {
  const { response, loading, error, requestLLM } = useLLMRequest({
    model,
    config
  });
  const [history, setHistory] = useState<IChatMessage[]>([]);

  useEffect(() => {
    const getMessagesFromDB = async () => {
      getOrCreateChatSession(userId, sessionId)
        .then((session) => {
          if (session) {
            setHistory(session.messages);
          }
        })
        .catch((err) => {
          console.error("Error fetching chat session:", err);
        });
    };
    getMessagesFromDB();
  }, [userId, sessionId]);

  useEffect(() => {
    if (!response) return;
    const newMessage: IChatMessage = {
      role: "assistant",
      content: response,
    };
    const saveMessageToDB = async () => {
      await addMessageToSession(sessionId, newMessage);
    };
    saveMessageToDB();
    setHistory((prev) => {
      return [...prev, newMessage];
    });
  }, [sessionId, response]);

  const handleRequest = async (message: string) => {
    const newMessage: IChatMessage = {
      role: "user",
      content: message,
    };

    setHistory((prev) => [...prev, newMessage]);

    await requestLLM({
      message,
      history
    });
  };

  return {
    response,
    loading,
    error,
    history,
    handleRequest,
  };
}