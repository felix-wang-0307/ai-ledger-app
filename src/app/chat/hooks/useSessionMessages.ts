import { addMessageToSession, getMessagesForSession } from '@/lib/chatSessionServices';
import { IChatMessage } from '@/types/chat';
import { useEffect, useState } from 'react';

export function useSessionMessages(sessionId?: string) {
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMessages([]);
    if (!sessionId) {
      return;
    }

    setLoading(true);
    getMessagesForSession(sessionId)
      .then(setMessages)
      .finally(() => setLoading(false));
    
    return () => {
      setMessages([]);  // cleanup to avoid memory leaks
    }
  }, [sessionId]);

  const addMessage = async (message: Omit<IChatMessage, 'messageId' | 'createdAt' | 'updatedAt'>) => {
    if (!sessionId) return;

    const saved = await addMessageToSession(sessionId, message);
    if (saved) setMessages((prev) => [...prev, saved]);
  };

  return {
    messages,
    loading,
    addMessage,
    setMessages, // useful for in-place edits or resets
  };
}
