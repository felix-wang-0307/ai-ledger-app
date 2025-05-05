
export interface IChatMessage {
  messageId?: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  imgUrl?: string;
  createdAt?: string; // ISO date
  updatedAt?: string; // ISO date
}

export interface IChatHistory {
  sessionId: string;
  messages: IChatMessage[];
  createdAt?: string; // ISO date 
  updatedAt?: string; // ISO date
}

export interface IChatSession {
  sessionId: string;
  title: string;
  description?: string;
  createdAt?: string; // ISO date
  updatedAt?: string; // ISO date
}

export interface IChatBubbleItem extends IChatMessage {
  key: string;
};

