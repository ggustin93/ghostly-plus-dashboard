import { createClient, SupabaseClient } from '@supabase/supabase-js';

// 1. Récupérer l'URL et la clé Anon depuis les variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client or the real client based on available env vars
let supabase: SupabaseClient;

// 2. Check if Supabase is configured
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase is not configured. Using mock client. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file when you're ready to use Supabase.");
  
  // Create a mock client that does nothing but doesn't break the app
  // We cast this to SupabaseClient to satisfy TypeScript
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signIn: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
      signInWithPassword: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      resetPasswordForEmail: () => Promise.resolve({ data: null, error: null }),
    },
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: new Error("Supabase not configured") }),
      update: () => ({ data: null, error: new Error("Supabase not configured") }),
      delete: () => ({ data: null, error: new Error("Supabase not configured") }),
    }),
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
      }),
    },
  } as unknown as SupabaseClient;
} else {
  // 3. Create and export the real Supabase client
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    // Options de configuration globales du client Supabase si nécessaire
    // Par exemple, pour la persistance de la session :
    // auth: {
    //   persistSession: true,
    //   autoRefreshToken: true,
    //   detectSessionInUrl: true,
    // },
  });

  // Optionnel: Log pour confirmer quelle instance est utilisée au démarrage de l'app
  if (import.meta.env.DEV) { // Uniquement en mode développement
    console.log(`[Supabase Client] Initialized for URL: ${supabaseUrl.includes("localhost") || supabaseUrl.includes("127.0.0.1") ? "local Supabase instance" : supabaseUrl}`);
  } 
}

export { supabase }; 