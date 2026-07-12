import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabaseServer' // Assuming you have a server client, or just use a basic redirect to login

export default function Home() {
  redirect('/login')
}