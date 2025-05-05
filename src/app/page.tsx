"use client";
// import Image from "next/image";
import { withAuth } from "@/lib/auth/withAuth";
import ChatPage from "./chat/page";

function Home() {
  return (
    <ChatPage />
  );
}

export default withAuth(Home);

