import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Updated to use the correct URL format that works with nginx proxy
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://localhost';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiZXhwIjoyMDYyMjkyNjY5fQ.d6vrflZp0t-UiselJIUtzQ4xez6xxAVg_9UA352TOts';

if (!supabaseUrl) {
  console.warn("Supabase URL is not defined. Using default localhost value. Set VITE_SUPABASE_URL in your .env file for a custom URL.");
}

if (!supabaseAnonKey) {
  console.warn("Supabase Anon Key is not defined. Using default value. Set VITE_SUPABASE_ANON_KEY in your .env file for a custom key.");
}

// Create client with options that work with our nginx proxy
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // This helps ensure the auth requests go through our nginx proxy correctly
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
}); 