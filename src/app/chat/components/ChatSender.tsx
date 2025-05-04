"use client";
import { Sender } from "@ant-design/x";

export default function ChatSender(props: {
  loading?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onPasteFile?: (file: File) => void;
  onCancel?: () => void;
}) {
  return (
    <Sender
      placeholder="Type your message here..."
      allowSpeech={true}
      {...props}
    />
  );
}