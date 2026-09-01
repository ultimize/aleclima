"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Singleton del client Supabase per il browser.
 * Sostituisce il vecchio src/lib/supabase.ts (che usava import.meta.env di Vite).
 */
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
