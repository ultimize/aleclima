import { createClient } from "@supabase/supabase-js";

/**
 * Client di sola lettura, senza cookie di sessione.
 * Serve alle pagine pubbliche del blog: generateStaticParams e la rigenerazione
 * ISR girano fuori da una richiesta, quindi non possono leggere i cookie.
 * Usa la anon key: la RLS lascia passare solo gli articoli pubblicati.
 */
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false } }
);
