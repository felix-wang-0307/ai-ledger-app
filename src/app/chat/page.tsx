// app/chat/page.tsx
"use client";

import React, { useEffect, useMemo } from "react";
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
import { useLLMRequest } from "./hooks/useLLMRequest";

const ChatPage: React.FC = () => {
  const { profile, loading: isUserProfileLoading } = useUserProfile();
  const { id: userId } = profile || {};
  const { activeKey } = useUserSessions();
  const [sessionId, setSessionId] = React.useState<string | null>(activeKey);

  const { requestLLM, loading: isLLMLoading, response, reset } = useLLMRequest();

  const {
    messages,
    loading: isSessionLoading,
    addMessage,
    setMessages,
  } = useSessionMessages(sessionId);

  const displayMessages = useMemo(() => {
    // Handle the partial response of the LLM (i.e. streaming)
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === "assistant") {
      return [
        ...messages.slice(0, -1),
        {
          ...lastMessage,
          content: response,
        },
      ];
    }
    const newMessage: IChatMessage = {
      role: "assistant",
      content: response,
    };
    return [...messages, newMessage];
  }, [response, messages]);

  console.log("sessionId", sessionId);
  console.log("messages", messages);

  const loading = useMemo(
    () => isSessionLoading || isUserProfileLoading,
    [isSessionLoading, isUserProfileLoading]
  );

  const sendMessage = async (message: string) => {
    try {
      const userMessage: IChatMessage = {
        role: "user",
        content: message,
      };

      await addMessage(userMessage);  // add to DB
      const content = await requestLLM({
        message,
        history: [...messages, userMessage],
        onStreamUpdate: (partial) => {
          setMessages((prev) => {
            return prev.map((msg, i) =>
              i === prev.length - 1 && msg.role === "assistant"
                ? { ...msg, content: partial } as IChatMessage
                : msg
            );
          });
        },
      });

      const assistantMessage: IChatMessage = {
        role: "assistant",
        content, 
      };

      await addMessage(assistantMessage);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    // TODO: add rendering for profile
    <div className="flex h-screen">
      {/* 左侧边栏 */}
      <aside className="w-64 bg-gray-100">
        <ChatSideBar onSelect={(sessionId) => {
          setSessionId(sessionId);
          reset();
        }} />
      </aside>

      {/* 右侧聊天主区域 */}
      <div className="flex flex-col flex-1">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Spin size="large" />
          </div>
        ) : (
          <>
            {/* 聊天标题 */}
            <div className="p-4 bg-white">
              <ChatTitle title="Chat" subTitle="Test" />
            </div>

            {/* 聊天内容区域（可滚动） */}
            <div className="flex-1 overflow-y-auto p-4">
              <ChatBubbles messages={displayMessages} />
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
          </>
        )}
      </div>
    </div>
  );
};

export default withAuth(ChatPage);
