// app/components/ChatPanel.tsx
'use client';

import { Bubble } from '@ant-design/x';
import { useXChat } from '@ant-design/x';

const ChatPanel = () => {
  const { messages } = useXChat();

  return <Bubble.List items={messages} />;
};

export default ChatPanel;
