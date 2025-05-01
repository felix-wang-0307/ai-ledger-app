// app/chat/page.tsx
"use client";

import React from 'react';
import ChatInterface from './components/ChatInterface';

const ChatPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-2xl h-[80vh]">
        <ChatInterface />
      </div>
    </div>
  );
};

export default ChatPage;
