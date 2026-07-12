"use client";

import './globals.css';
import Sidebar from '@/components/sidebar';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <html lang="en">
      <head>
        <title>TransitOps</title>
      </head>
      {/* Container ko w-full aur flex banaya hai */}
      <body className="bg-slate-50 text-slate-900 flex min-h-screen w-full">
        {!isLoginPage && <Sidebar />}
        
        {/* Main content automatically sidebar ke aage se shuru hoga */}
        <main className="flex-1 min-w-0 bg-slate-50">
          {children}
        </main>
      </body>
    </html>
  );
}