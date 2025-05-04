"use client";
// app/components/ChatBubbles.tsx
import React from "react";
import { UserOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import { Bubble } from "@ant-design/x";
import { IChatMessage } from "@/types/chat";

const userAvatar: React.CSSProperties = {
  color: "#f56a00",
  backgroundColor: "#fde3cf",
};

const agentAvatar: React.CSSProperties = {
  color: "#fff",
  backgroundColor: "#87d068",
};

const hideAvatar: React.CSSProperties = {
  visibility: "hidden",
};

function ChatBubbles({ messages }: { messages: IChatMessage[] }) {
  return (
    <Flex gap="middle" vertical>
      {messages.map((message, index) => {
        const isUser = message.role === "user";
        const isAgent = message.role === "assistant";

        return (
          <Bubble
            key={index}
            placement={isUser ? "end" : "start"}
            content={message.content}
            avatar={{
              icon: <UserOutlined />,
              style: isUser ? userAvatar : agentAvatar,
            }}
            styles={{ avatar: isUser || isAgent ? {} : hideAvatar }}
          />
        );
      })}
    </Flex>
  );
}

export default ChatBubbles;
