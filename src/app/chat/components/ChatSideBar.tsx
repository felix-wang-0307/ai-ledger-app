'use client';

import React, { useEffect, useState } from 'react';
import { Conversations } from '@ant-design/x';
import type { ConversationsProps } from '@ant-design/x';
import { App, theme, Button, Space } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useUser } from '@supabase/auth-helpers-react';

import { IChatSession } from '@/types/chat';
import {
  createChatSession,
  getUserChatSessions,
  deleteChatSession,
} from '@/lib/chatSessionServices';
import { supabase } from '@/lib/db';

const LOCAL_STORAGE_KEY = 'lastSessionId';

const ChatSideBar = ({ onSelect }: { onSelect?: (sessionId: string) => void }) => {
  const user = useUser();
  const { token } = theme.useToken();
  const { message: antdMessage } = App.useApp();
  const [sessions, setSessions] = useState<IChatSession[]>([]);
  const [activeKey, setActiveKey] = useState<string | undefined>();

  // Fetch user sessions
  useEffect(() => {
    if (!user) return;

    getUserChatSessions().then((fetched) => {
      setSessions(fetched);

      // Try to auto-select last session
      const last = localStorage.getItem(LOCAL_STORAGE_KEY);
      const fallback = fetched[0]?.sessionId;
      const sessionToSelect = fetched.find((s) => s.sessionId === last)
        ? last
        : fallback;

      if (sessionToSelect) {
        setActiveKey(sessionToSelect);
        onSelect?.(sessionToSelect);
      }
    });
  }, [onSelect, user]);

  // Create new session
  const handleNewChat = async () => {
    if (!user) return;

    const newSession = await createChatSession(user.id);
    if (newSession) {
      const updatedSessions = [newSession, ...sessions];
      setSessions(updatedSessions);
      setActiveKey(newSession.sessionId);
      onSelect?.(newSession.sessionId);
      localStorage.setItem(LOCAL_STORAGE_KEY, newSession.sessionId);
    }
  };

  const handleSelect = (key: string) => {
    setActiveKey(key);
    onSelect?.(key);
    localStorage.setItem(LOCAL_STORAGE_KEY, key);
  };

  const menuConfig: ConversationsProps['menu'] = (conversation) => ({
    items: [
      {
        label: 'Rename',
        key: 'rename',
        icon: <EditOutlined />,
      },
      {
        label: 'Delete',
        key: 'delete',
        icon: <DeleteOutlined />,
        danger: true,
      },
    ],
    onClick: async (menuInfo) => {
      menuInfo.domEvent.stopPropagation();

      if (menuInfo.key === 'delete') {
        const success = await deleteChatSession(conversation.key);
        if (success) {
          antdMessage.success('Session deleted');
          setSessions((prev) => prev.filter((s) => s.sessionId !== conversation.key));

          // If the deleted one was active, switch to first
          if (activeKey === conversation.key) {
            const fallback = sessions.find((s) => s.sessionId !== conversation.key)?.sessionId;
            if (fallback) {
              setActiveKey(fallback);
              onSelect?.(fallback);
              localStorage.setItem(LOCAL_STORAGE_KEY, fallback);
            }
          }
        }
      }

      if (menuInfo.key === 'rename') {
        const newTitle = prompt('Rename this session:');
        if (newTitle?.trim()) {
          const { error } = await supabase
            .from('chat_histories')
            .update({ title: newTitle })
            .eq('session_id', conversation.key);

          if (!error) {
            setSessions((prev) =>
              prev.map((s) =>
                s.sessionId === conversation.key ? { ...s, title: newTitle } : s
              )
            );
            antdMessage.success('Renamed');
          }
        }
      }
    },
  });

  const items: ConversationsProps['items'] = sessions.map((s) => ({
    key: s.sessionId,
    label: s.title,
    description: s.description,
  }));

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          block
          onClick={handleNewChat}
        >
          New Chat
        </Button>
      </div>
      <div className="flex-1 overflow-auto">
        <Conversations
          items={items}
          menu={menuConfig}
          activeKey={activeKey}
          onActiveChange={handleSelect}
          style={{ borderRadius: token.borderRadius }}
        />
      </div>
    </div>
  );
};

export default ChatSideBar;
