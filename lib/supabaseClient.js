import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Yahan dhyan rakhein, 'export const' hona zaroori hai
export const supabase = createClient(supabaseUrl, supabaseAnonKey);