import { getSupabasePublic } from "@/lib/supabase/public";

export type Posizione = "head" | "body" | "footer";
export type Categoria = "necessari" | "statistiche" | "marketing";

export interface ScriptSito {
  id: string;
  nome: string;
  posizione: Posizione;
  categoria: Categoria;
  codice: string;
  attivo: boolean;
}

export interface Impostazioni {
  verifica_google: string | null;
  verifica_bing: string | null;
}

/** Script attivi (la RLS restituisce al pubblico solo quelli). */
export async function getScriptAttivi(): Promise<Pick<ScriptSito, "id" | "posizione" | "categoria" | "codice">[]> {
  const sb = getSupabasePublic();
  if (!sb) return [];
  const { data, error } = await sb
    .from("script_sito")
    .select("id, posizione, categoria, codice")
    .eq("attivo", true)
    .order("created_at");
  if (error) console.error("getScriptAttivi:", error.message);
  return data ?? [];
}

export async function getImpostazioni(): Promise<Impostazioni> {
  const sb = getSupabasePublic();
  const vuote = { verifica_google: null, verifica_bing: null };
  if (!sb) return vuote;
  const { data } = await sb.from("impostazioni_sito").select("verifica_google, verifica_bing").eq("id", 1).maybeSingle();
  return data ?? vuote;
}
