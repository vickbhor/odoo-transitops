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
      // Get the current active session from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session && pathname !== '/login') {
        // No session? Kick them to login
        router.push('/login');
      } else if (session && pathname === '/login') {
        router.push('/dashboard');
      } else {
        setAuthorized(true);
      }
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') router.push('/login');
    });

    return () => authListener.subscription.unsubscribe();
  }, [pathname, router]);

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
        Authenticating...
      </div>
    );
  }

  return <>{children}</>;
}