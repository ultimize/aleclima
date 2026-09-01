import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Client di sola lettura, senza cookie di sessione.
 * Serve alle pagine pubbliche del blog: generateStaticParams, il sitemap e la
 * rigenerazione ISR girano fuori da una richiesta, quindi non hanno cookie.
 * Usa la anon key: la RLS lascia passare solo gli articoli pubblicati.
 *
 * E' costruito in modo pigro e puo' tornare null: se le variabili d'ambiente
 * mancano (build su un ambiente non ancora configurato) il sito deve comunque
 * compilare, con il blog vuoto, invece di far fallire l'intero deploy.
 */
let cached: SupabaseClient | null | undefined;

export function getSupabasePublic(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error(
      "[supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY non impostate: " +
        "il blog verra' servito vuoto. Configurale nelle Environment Variables del progetto."
    );
    cached = null;
    return cached;
  }

  cached = createClient(url, key, { auth: { persistSession: false } });
  return cached;
}
