import { supabase } from '@/lib/supabaseClient';

export async function getProfile() {
  console.log("🔍 [AUTH] 1. Checking local session...");
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) console.error("🚨 [AUTH] Session Error:", sessionError);
  
  if (!session) {
    console.warn("⚠️ [AUTH] No active session found in browser. Returning null.");
    return null;
  }

  console.log("✅ [AUTH] Session found for ID:", session.user.id);
  console.log("🔍 [AUTH] 2. Querying 'profiles' table...");
  
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('name, role')
    .eq('id', session.user.id)
    .maybeSingle();

  if (profileError) {
    console.error("🚨 [AUTH] Database Fetch Error:", profileError);
  } else {
    console.log("✅ [AUTH] Profile data fetched:", profile);
  }

  if (!profile) return null;

  return { 
    id: session.user.id, 
    email: session.user.email, 
    name: profile.name, 
    role: profile.role 
  };
}