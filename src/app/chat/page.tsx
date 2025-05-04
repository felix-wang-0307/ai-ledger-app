// app/chat/page.tsx
"use client";

import React from "react";
// import ChatInterface from './components/ChatInterface';
import ChatBubbles from "./components/ChatBubbles";
import ChatSender from "./components/ChatSender";
import { IChatMessage } from "@/types/chat";
import ChatSideBar from "./components/ChatSideBar";
import ChatTitle from "./components/ChatTitle";
import { withAuth } from "@/lib/withAuth";

const mockMessages: IChatMessage[] = [
  { role: "user", content: "Hello, how are you?" },
  { role: "assistant", content: "I am fine, thank you!" },
  { role: "user", content: "What can you do?" },
  { role: "assistant", content: "I can assist you with various tasks." },
  { role: "user", content: "Can you tell me a joke?" },
  { role: "assistant", content: "Why did the chicken cross the road? To get to the other side!" },
  { role: "user", content: "That's funny!" },
  { role: "assistant", content: "I'm glad you liked it!" },
  { role: "user", content: "What else can you do?" },
  { role: "assistant", content: "I can help with programming, writing, and more!" },
  { role: "user", content: "Can you help me with my homework?" },
  { role: "assistant", content: "Sure! What subject do you need help with?" },
  { role: "user", content: "I need help with math." },
  { role: "assistant", content: "I can help with that! What specific topic in math do you need help with?" },
  { role: "user", content: "I need help with calculus." },
  { role: "assistant", content: "Calculus is a branch of mathematics that studies continuous change." },
  { role: "user", content: "Can you explain derivatives?" },
  { role: "assistant", content: "A derivative represents the rate of change of a function." },
  { role: "user", content: "Can you give me an example?" },
];

const ChatPage: React.FC = () => {
  return (
    <div className="flex h-screen">
      {/* 左侧边栏 */}
      <aside className="w-64 bg-gray-100">
        <ChatSideBar />
      </aside>

      {/* 右侧聊天主区域 */}
      <div className="flex flex-col flex-1">
        {/* 聊天标题 */}
        <div className="p-4 bg-white">
          <ChatTitle title="Chat" subTitle="Test"/>
        </div>

        {/* 聊天内容区域（可滚动） */}
        <div className="flex-1 overflow-y-auto p-4">
          <ChatBubbles messages={mockMessages} />
        </div>

        {/* 固定底部输入框 */}
        <div className="p-4 bg-white">
          <ChatSender onChange={()=>{}} onCancel={()=>{}} onSubmit={()=>{}} onPasteFile={()=>{}}/>
        </div>
      </div>
    </div>
  );
};

export default withAuth(ChatPage);
