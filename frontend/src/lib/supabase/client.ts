import { createClient } from '@supabase/supabase-js';

// 1. Récupérer l'URL et la clé Anon depuis les variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 2. Vérifier que les variables sont bien présentes
if (!supabaseUrl || !supabaseAnonKey) {
  let message = "Supabase URL and Anon Key must be provided in your .env file.";
  message += "\\nMissing: ";
  if (!supabaseUrl) message += "VITE_SUPABASE_URL ";
  if (!supabaseAnonKey) message += "VITE_SUPABASE_ANON_KEY";
  message += "\\nUpdate your .env file in the frontend directory (e.g., frontend/.env or frontend/.env.local)";
  console.error(message); // Log to console for visibility during development
  throw new Error(message); // Stop execution if critical config is missing
}

// 3. Créer et exporter le client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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