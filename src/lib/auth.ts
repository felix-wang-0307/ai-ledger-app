import { supabase } from "@/lib/db";

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signInWith(provider: 'google' | 'github' | 'apple' | 'twitter') {
  const { error } = await supabase.auth.signInWithOAuth({
    provider
  });
  if (error) console.error(`Error signing in with ${provider}:`, error);
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}