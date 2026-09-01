"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Client Supabase del browser, creato al primo uso e non all'import.
 *
 * La differenza conta: questi moduli vengono valutati anche durante il
 * prerender lato server, e un client costruito a module-scope fa fallire
 * l'intero build quando le variabili d'ambiente non ci sono ancora.
 * Cosi' invece l'errore arriva solo a chi prova davvero a usarlo.
 */
let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase non configurato: mancano NEXT_PUBLIC_SUPABASE_URL e/o NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  client = createBrowserClient(url, key);
  return client;
}
