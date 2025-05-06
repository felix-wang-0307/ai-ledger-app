'use client';

import React from 'react';
import { Conversations } from '@ant-design/x';
import type { ConversationsProps } from '@ant-design/x';
import { theme, Button, message } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { supabase } from '@/lib/db';
import { useUserSessions } from '../hooks/useUserSessions';

const ChatSideBar = ({ onSelect }: { onSelect?: (sessionId: string) => void }) => {
  const { token } = theme.useToken();
  const [antdMessage, contextHolder] = message.useMessage();

  const {
    sessions,
    activeKey,
    selectSession,
    createSession,
    deleteSession,
    renameSession,
  } = useUserSessions();

  const handleNewChat = async () => {
    const session = await createSession();
    if (session) {
      onSelect?.(session.sessionId);
      antdMessage.success('New session created');
    } else {
      antdMessage.error('Failed to create new session');
    }
  };

  const handleSelect = (key: string) => {
    selectSession(key);
    onSelect?.(key);
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

      const sessionId = conversation.key;

      if (menuInfo.key === 'delete') {
        const success = await deleteSession(sessionId);
        if (success) {
          antdMessage.success('Session deleted');
          onSelect?.(sessionId); // Update parent
        }
      }

      if (menuInfo.key === 'rename') {
        const newTitle = prompt('Rename this session:');
        if (newTitle?.trim()) {
          const { error } = await supabase
            .from('chat_histories')
            .update({ title: newTitle })
            .eq('session_id', sessionId);

          if (!error) {
            renameSession(sessionId, newTitle);
            antdMessage.success('Session renamed');
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
      {contextHolder}
      <div className="p-3">
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
