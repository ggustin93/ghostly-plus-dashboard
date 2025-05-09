import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// --- DEBUGGING: Log the values being used ---
console.log('[supabaseClient.ts] Initializing Supabase client with:');
console.log('  URL:', supabaseUrl);
console.log('  Anon Key:', supabaseAnonKey);
// --- END DEBUGGING ---

if (!supabaseUrl) {
  throw new Error("VITE_SUPABASE_URL is not set in environment variables.");
}

if (!supabaseAnonKey) {
  throw new Error("VITE_SUPABASE_ANON_KEY is not set in environment variables.");
}

// Create Supabase client with auth configuration to prevent header conflicts
// This will help avoid issues with Nginx proxy for authentication
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

export default supabaseClient; 