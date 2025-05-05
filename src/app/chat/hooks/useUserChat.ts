import { useUser } from "@supabase/auth-helpers-react";
import { IChatSession } from "@/types/chat";
import { useEffect, useState } from "react";

export function useUserChat() {
  const { id: userId } = useUser();
  const [userChatSessions, setUserChatSessions] = useState<IChatSession[]>([]);

  useEffect(() => {
    
  }, [userId]);
}