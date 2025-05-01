// import Image from "next/image";
import ChatInterface from "./chat/components/ChatInterface";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-2xl h-[80vh]">
        <ChatInterface />
      </div>
    </div>
  );
}
