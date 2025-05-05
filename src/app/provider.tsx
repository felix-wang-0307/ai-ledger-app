"use client";
import { supabase } from '@/lib/db';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <AntdRegistry>
        {children}
      </AntdRegistry>
    </SessionContextProvider>
  );
}