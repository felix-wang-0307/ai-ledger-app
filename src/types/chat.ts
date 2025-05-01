
export interface IChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  imgUrl?: string;
  createdAt?: string; // ISO date
  updatedAt?: string; // ISO date
}
