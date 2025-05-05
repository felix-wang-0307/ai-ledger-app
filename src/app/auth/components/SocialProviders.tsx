"use client";
import { Provider } from "@supabase/supabase-js";
import ContinueWith from "./ContinueWith";

export default function SocialProviders({ providers }: { providers: Provider[] }) {
  return (
    <div className="flex-col items-center justify-between my-4 max-w-md mx-auto gap-1">
      {providers.map(
        (
          provider: Provider
        ) => (
          <ContinueWith provider={provider} key={provider} />
        )
      )}
    </div>
  );
}
