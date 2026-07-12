import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function getProfile() {
  const supabase = await createClient()

  const { data: { claims } } = await supabase.auth.getClaims()
  if (!claims) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, role')
    .eq('id', claims.sub)
    .single()

  if (!profile) redirect('/login')

  return { id: claims.sub, email: claims.email, name: profile.name, role: profile.role }
}

export async function requireRole(allowedRoles) {
  const profile = await getProfile()
  if (!allowedRoles.includes(profile.role)) redirect('/dashboard')
  return profile
}