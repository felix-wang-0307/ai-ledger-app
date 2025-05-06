'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import {
  createChatSession,
  getUserChatSessions,
  deleteChatSession,
} from '@/lib/chatSessionServices';
import { IChatSession } from '@/types/chat';

const LOCAL_STORAGE_KEY = 'spendWise_lastSessionId';

export function useUserSessions() {
  const user = useUser();
  const [sessions, setSessions] = useState<IChatSession[]>([]);
  const [activeKey, setActiveKey] = useState<string | undefined>();

  // Fetch user sessions on mount
  useEffect(() => {
    if (!user) return;

    getUserChatSessions().then((fetched) => {
      setSessions(fetched);

      const last = localStorage.getItem(LOCAL_STORAGE_KEY);
      const fallback = fetched[0]?.sessionId;
      const sessionToSelect = fetched.find((s) => s.sessionId === last)
        ? last
        : fallback;

      if (sessionToSelect) {
        setActiveKey(sessionToSelect);
      }
    });
  }, [user]);

  const selectSession = (sessionId: string) => {
    setActiveKey(sessionId);
    console.log('Selected session:', sessionId);
    localStorage.setItem(LOCAL_STORAGE_KEY, sessionId);
  };

  const createSession = async () => {
    if (!user) return null;
    const newSession = await createChatSession(user.id, null, 'New Ledger');
    if (newSession) {
      setSessions((prev) => [newSession, ...prev]);
      selectSession(newSession.sessionId);
    }
    return newSession;
  };

  const deleteSession = async (sessionId: string) => {
    const success = await deleteChatSession(sessionId);
    if (success) {
      setSessions((prev) => prev.filter((s) => s.sessionId !== sessionId));

      if (sessionId === activeKey) {
        const fallback = sessions.find((s) => s.sessionId !== sessionId)?.sessionId;
        if (fallback) {
          selectSession(fallback);
        } else {
          setActiveKey(undefined);
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      }
    }
    return success;
  };

  const renameSession = (sessionId: string, newTitle: string) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.sessionId === sessionId ? { ...s, title: newTitle } : s
      )
    );
  };

  return {
    sessions,
    activeKey,
    selectSession,
    createSession,
    deleteSession,
    renameSession,
  };
}
