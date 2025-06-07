import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Add these for better session handling
    storageKey: "supabase.auth.token", // Unique key to avoid conflicts
    flowType: "pkce", // More secure auth flow
    debug: process.env.NODE_ENV === "development", // Enable debug logging in dev
  },
  // Add global options for better error handling
  global: {
    headers: {
      "x-my-custom-header": "my-app-name",
    },
  },
});
