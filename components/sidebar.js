// components/Sidebar.js
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SignOutButton from './SignOutButton'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', roles: ['Fleet Manager', 'Driver', 'Safety Officer', 'Financial Analyst'] },
  { href: '/vehicles', label: 'Vehicles', roles: ['Fleet Manager'] },
  { href: '/drivers', label: 'Driver Management', roles: ['Fleet Manager', 'Safety Officer'] },
  { href: '/trips', label: 'Trips', roles: ['Fleet Manager', 'Driver'] },
  { href: '/maintenance', label: 'Maintenance', roles: ['Fleet Manager', 'Safety Officer'] },
  { href: '/fuel-expenses', label: 'Fuel & Expenses', roles: ['Fleet Manager', 'Financial Analyst'] },
  { href: '/reports', label: 'Reports', roles: ['Fleet Manager', 'Financial Analyst'] },
]

export default function Sidebar({ role, name }) {
  const pathname = usePathname()
  // This line filters the links based on the role prop passed to the Sidebar
  const items = NAV_ITEMS.filter((item) => item.roles.includes(role))

  return (
    <aside className="w-64 shrink-0 bg-slate-900 text-slate-100 flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <p className="font-semibold">TransitOps</p>
        <p className="text-sm text-slate-400">{name}</p>
        <p className="text-xs text-slate-500">{role}</p>
      </div>

      {/* Unified Navigation List */}
      <nav className="flex-1 p-2 space-y-1 mt-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded px-3 py-2 text-sm transition-colors ${
              pathname === item.href 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-2 border-t border-slate-700">
        <SignOutButton />
      </div>
    </aside>
  )
}