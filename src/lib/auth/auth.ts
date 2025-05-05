import { supabase } from "@/lib/db";
import { IUserProfile } from "@/types/user";
import { Provider } from "@supabase/supabase-js";
import { v4 } from "uuid";

export async function signUp(email: string, password: string, profile: IUserProfile) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  await supabase.from("profiles").upsert({
    id: data.user?.id,
    ...profile
  });  // upsert profile
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

export async function signInAsGuest() {
  const { data, error } = await supabase.auth.signInAnonymously();
  const displayName = `Guest-${v4().slice(0, 8)}`;
  // Create a profile for the guest user
  await supabase.from("profiles").upsert({
    id: data.user?.id,
    display_name: displayName,
  });
  if (error) throw error;
  return data;
}

export async function signInWith(provider: Provider) {
  // TODO: Implement this
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider
  });
  if (error) throw error;
  if (data?.url) {
    
  }
  return data;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}