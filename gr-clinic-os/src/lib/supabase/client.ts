"use client";

import { createBrowserClient } from "@supabase/ssr";

// Cliente para Client Components. Só chamar depois de checar
// `isSupabaseConfigured()` — sem as variáveis de ambiente, isto lança.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
