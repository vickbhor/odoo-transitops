'use client'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function SignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    // 1. Tell Supabase to clear the token
    await supabase.auth.signOut()
    
    // 2. IMPORTANT: Refresh the router state to wipe local data
    router.refresh()
    
    // 3. Force redirect to the login page immediately
    router.push('/login')
  }

  return (
    <button 
      onClick={handleSignOut}
      className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded transition-colors"
    >
      Sign Out
    </button>
  )
}