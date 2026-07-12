'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function RouteGuard({ children }) {
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session && pathname !== '/login') {
        router.push('/login');
      } else if (session && pathname === '/login') {
        router.push('/dashboard');
      } else {
        setAuthorized(true);
      }
    };
    checkAuth();
  }, [pathname, router]);

  if (!authorized) return <div className="min-h-screen bg-slate-900"></div>;
  return <>{children}</>;
}