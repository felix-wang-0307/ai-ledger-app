// app/chat/page.tsx
"use client";

import React, { useMemo } from "react";
import ChatBubbles from "./components/ChatBubbles";
import ChatSender from "./components/ChatSender";
import { IChatMessage } from "@/types/chat";
import ChatSideBar from "./components/ChatSideBar";
import ChatTitle from "./components/ChatTitle";
import { withAuth } from "@/lib/auth/withAuth";
import { useUserProfile } from "../profile/hooks/useUserProfile";
import { useUserSessions } from "./hooks/useUserSessions";
import { useSessionMessages } from "./hooks/useSessionMessages";
import { Spin } from "antd";
import { useLLMSession } from "./hooks/useLLMSession";

const ChatPage: React.FC = () => {
  const { profile, loading: isUserProfileLoading } = useUserProfile();
  const { id: userId } = profile || {};
  const {
    activeKey,  // TODO: Fix activeKey not controlled problem
    ...sideBarProps
  } = useUserSessions();

  const {
    response,
    loading: isLLMLoading,
    error,
    history,
    handleRequest,
  } = useLLMSession({
    userId, 
    sessionId: activeKey,
  });

  const {
    messages,
    loading: isSessionLoading,
    addMessage,
    setMessages,
  } = useSessionMessages(activeKey);

  console.log("sessionId", activeKey);
  console.log("messages", messages);

  const loading = useMemo(
    () => isSessionLoading || isUserProfileLoading,
    [isSessionLoading, isUserProfileLoading]
  );

  const sendMessage = async (message: string) => {
    const newMessage: IChatMessage = {
      role: "user",
      content: message,
    };
    await addMessage(newMessage);
    await handleRequest(message);
  };
  

  if (loading) {
    return (
      <Spin></Spin>
    );
  }

  return (
    // TODO: add rendering for profile
    <div className="flex h-screen">
      {/* 左侧边栏 */}
      <aside className="w-64 bg-gray-100">
        <ChatSideBar />
      </aside>

      {/* 右侧聊天主区域 */}
      <div className="flex flex-col flex-1">
        {/* 聊天标题 */}
        <div className="p-4 bg-white">
          <ChatTitle title="Chat" subTitle="Test" />
        </div>

        {/* 聊天内容区域（可滚动） */}
        <div className="flex-1 overflow-y-auto p-4">
          <ChatBubbles messages={messages} />
        </div>

        {/* 固定底部输入框 */}
        <div className="p-4 bg-white">
          <ChatSender
            onChange={() => {}}
            onCancel={() => setMessages((prev) => prev.slice(0, -1))}
            onSubmit={sendMessage}
            onPasteFile={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default withAuth(ChatPage);
