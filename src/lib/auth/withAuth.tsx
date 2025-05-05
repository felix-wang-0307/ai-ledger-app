'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/db';

export function withAuth(Component: React.FC) {
  return function ProtectedComponent(props: any) {
    const [isLoading, setIsLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          setAuthenticated(true);
        } else {
          router.push(`/auth/login?redirectTo=${encodeURIComponent(pathname)}`);
        }
        setIsLoading(false);
      };

      checkAuth();
    }, [pathname, router]);

    if (isLoading) return <div className="p-6">Checking authentication...</div>;
    if (!authenticated) return null;

    return <Component {...props} />;
  };
}
