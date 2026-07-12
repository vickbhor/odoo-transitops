"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const [activeRole, setActiveRole] = useState("Fleet Manager");
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Vehicles", path: "/vehicles" },
    { name: "Trips", path: "/trips" },
    { name: "Maintenance", path: "/maintenance" },
    { name: "Fuel & Expenses", path: "/fuel-expenses" },
    { name: "Reports", path: "/reports" }
  ];

  const roles = ["Fleet Manager", "Operations Lead", "Dispatcher", "Admin"];

  const handleRoleChange = (role) => {
    setActiveRole(role);
    setShowRoleDropdown(false);
  };

  return (
    /* fixed hata kar shrink-0 aur sticky top-0 add kiya hai */
    <div className="w-64 shrink-0 bg-[#0f172a] text-white flex flex-col h-screen sticky top-0 z-50">
      <div className="p-6 text-xl font-bold border-b border-slate-800 relative">
        TransitOps
      </div>
      
      <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.path || pathname?.startsWith(item.path + '/');
          
          return (
            <Link key={item.name} href={item.path} className="block">
              <div 
                className={`px-4 py-3 rounded-lg transition-colors duration-200 cursor-pointer ${
                  isActive 
                    ? "bg-blue-600 text-white font-medium shadow-lg" 
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {item.name}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 relative">
        <div 
          className="flex items-center justify-between cursor-pointer hover:bg-slate-800 p-2 rounded-lg transition-colors"
          onClick={() => setShowRoleDropdown(!showRoleDropdown)}
        >
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold mr-3 text-white">
              {activeRole[0]}
            </div>
            <div className="text-sm">
              <p className="font-medium text-slate-200">{activeRole}</p>
              <p className="text-xs text-slate-400">Click to switch</p>
            </div>
          </div>
          <span className="text-slate-400 text-xs">^</span>
        </div>

        {showRoleDropdown && (
          <div className="absolute bottom-16 left-4 right-4 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => handleRoleChange(role)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-slate-700 ${
                  activeRole === role ? "text-blue-400 font-medium bg-slate-750" : "text-slate-200"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}