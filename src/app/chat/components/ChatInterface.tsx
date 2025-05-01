'use client';

import React from 'react';
import { useXChat, Sender, Bubble } from '@ant-design/x';
import { useAiAgent } from '@/app/hooks/useAiAgent';

const ChatInterface: React.FC = () => {
  const agent = useAiAgent();

  const { onRequest, messages } = useXChat({ agent });

  console.log(messages)

  const items = messages.map(({ message, id }) => ({
    key: id,
    content: message,
  }));

  return (
    <div className="flex flex-col h-full bg-white p-4 rounded shadow">
      <div className="flex-1 overflow-y-auto mb-4">
        <Bubble.List
          items={items}
        />
      </div>
      <Sender onSubmit={onRequest} placeholder="Type your message..." />
    </div>
  );
};

export default ChatInterface;
