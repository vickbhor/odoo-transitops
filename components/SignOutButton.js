'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignOutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSignOut() {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="w-full rounded px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 text-left disabled:opacity-50"
    >
      {loading ? 'Signing out…' : 'Sign out'}
    </button>
  )
}