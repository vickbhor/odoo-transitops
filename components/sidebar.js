'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('role, name')
          .eq('id', user.id)
          .single();
          
        if (data) {
          setRole(data.role);
          setUserName(data.name);
        }
      }
    };
    fetchProfile();
  }, []);

  if (pathname === '/login') return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', roles: ['Fleet Manager', 'Driver', 'Safety Officer', 'Financial Analyst'] },
    { name: 'Vehicles', path: '/vehicles', roles: ['Fleet Manager', 'Safety Officer'] },
    { name: 'Drivers', path: '/drivers', roles: ['Fleet Manager'] },
    { name: 'Trips', path: '/trips', roles: ['Fleet Manager', 'Driver'] },
    { name: 'Maintenance', path: '/maintenance', roles: ['Fleet Manager'] },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-8 text-blue-400">TransitOps</h1>
      <nav className="flex-1 space-y-2">
        {navItems
          .filter(item => !role || item.roles.includes(role)) // Filter tabs by user role dynamically
          .map((item) => (
            <Link 
              key={item.name} 
              href={item.path} 
              className={`block px-4 py-2 rounded transition-colors ${
                pathname.startsWith(item.path) ? 'bg-blue-600' : 'hover:bg-slate-800'
              }`}
            >
              {item.name}
            </Link>
        ))}
      </nav>
      <div className="mt-auto border-t border-slate-700 pt-4">
        <p className="text-sm font-medium text-slate-300">{userName || 'Loading...'}</p>
        <p className="text-xs text-slate-500 mb-4">{role || '...'}</p>
        <button 
          onClick={handleLogout} 
          className="w-full text-left px-4 py-2 text-red-400 hover:bg-slate-800 rounded transition-colors"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}