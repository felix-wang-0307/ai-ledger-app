// hooks/useUserProfile.ts
import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/db";
import { IUserProfile } from "@/types/user";

export function useUserProfile() {
  const user = useUser();
  const [profile, setProfile] = useState<IUserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
      .then(({ data, error }) => {
        if (error) console.error("Profile fetch error:", error);
        setProfile(data ?? null);
        setLoading(false);
      });
  }, [user]);

  return { profile, loading };
}
