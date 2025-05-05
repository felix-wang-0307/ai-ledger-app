import { supabase } from '@/lib/db';
import { IChatHistory, IChatMessage, IChatSession } from '@/types/chat'; // Adjust if paths differ
import { v4 } from 'uuid'; // UUID for session ID

// 🔵 CREATE a new session
export async function createChatSession(
  userId: string,
  sessionId?: string,
  title = 'New Chat',
  description?: string
): Promise<IChatSession | null> {
  const { data, error } = await supabase
    .from('chat_histories')
    .insert({
      user_id: userId,
      session_id: sessionId,
      title,
      description
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating chat session:', error);
    return null;
  }

  return {
    sessionId: data.session_id,
    title: data.title,
    description: data.description,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

// 🔵 FETCH all chat sessions for the current user
export async function getUserChatSessions(): Promise<IChatSession[]> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return [];

  const { data, error } = await supabase
    .from('chat_histories')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching chat sessions:', error);
    return [];
  }

  return data.map((s) => ({
    sessionId: s.session_id,
    title: s.title,
    description: s.description,
    createdAt: s.created_at,
    updatedAt: s.updated_at,
  }));
}


// 🔵 FETCH messages for a session
export async function getMessagesForSession(sessionId: string): Promise<IChatMessage[]> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }

  return data.map((m) => ({
    messageId: m.message_id,
    role: m.role,
    content: m.content,
    imgUrl: m.img_url,
    createdAt: m.created_at,
    updatedAt: m.updated_at,
  }));
}

// 🔵 FETCH a specific chat session by ID, if not exist, CREATE one
export async function getOrCreateChatSession(
  userId: string,
  sessionId?: string
): Promise<IChatHistory | null> {
  const id = sessionId ?? v4();

  const { data, error } = await supabase
    .from('chat_histories')
    .select('*')
    .eq('session_id', id)
    .single();

  if (!data || error) {
    const created = await createChatSession(userId, id);
    return created
      ? { sessionId: created.sessionId, messages: [] }
      : null;
  }

  const messages = await getMessagesForSession(id);

  return {
    sessionId: id,
    messages,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}


// 🔵 ADD a message to a session
export async function addMessageToSession(sessionId: string, message: Omit<IChatMessage, 'messageId' | 'createdAt' | 'updatedAt'>): Promise<IChatMessage | null> {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      session_id: sessionId,
      role: message.role,
      content: message.content,
      img_url: message.imgUrl ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding message:', error);
    return null;
  }

  return {
    messageId: data.message_id,
    role: data.role,
    content: data.content,
    imgUrl: data.img_url,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

// 🟡 DELETE a chat session (and cascade messages)
export async function deleteChatSession(sessionId: string): Promise<boolean> {
  const { error } = await supabase
    .from('chat_histories')
    .delete()
    .eq('session_id', sessionId);

  if (error) {
    console.error('Error deleting chat session:', error);
    return false;
  }

  return true;
}

// 🟢 UPDATE a message (e.g., content correction)
export async function updateChatMessage(messageId: string, updates: Partial<IChatMessage>): Promise<IChatMessage | null> {
  const { data, error } = await supabase
    .from('chat_messages')
    .update({
      content: updates.content,
      img_url: updates.imgUrl ?? null,
    })
    .eq('message_id', messageId)
    .select()
    .single();

  if (error) {
    console.error('Error updating message:', error);
    return null;
  }

  return {
    messageId: data.message_id,
    role: data.role,
    content: data.content,
    imgUrl: data.img_url,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}
