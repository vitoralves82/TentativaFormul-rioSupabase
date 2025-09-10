import { createClient } from "@supabase/supabase-js";

// Vite: use prefixo VITE_ no .env.local
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);
