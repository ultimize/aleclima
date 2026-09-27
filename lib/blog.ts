import { getSupabasePublic } from "@/lib/supabase/public";

export interface FaqItem {
  domanda: string;
  risposta: string;
}

export interface Articolo {
  id: string;
  slug: string;
  titolo: string;
  sommario: string | null;
  contenuto_html: string;
  cover_url: string | null;
  cover_alt: string | null;
  meta_title: string | null;
  meta_description: string | null;
  keyword: string | null;
  faq: FaqItem[];
  stato: "bozza" | "pubblicato";
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

/** Solo i campi che servono alla lista: non trasciniamo il corpo degli articoli. */
export type ArticoloCard = Pick<
  Articolo,
  "id" | "slug" | "titolo" | "sommario" | "cover_url" | "cover_alt" | "published_at"
>;

export async function getArticoliPubblicati(): Promise<ArticoloCard[]> {
  const supabase = getSupabasePublic();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("articoli")
    .select("id, slug, titolo, sommario, cover_url, cover_alt, published_at")
    .eq("stato", "pubblicato")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });

  if (error) {
    console.error("getArticoliPubblicati:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getArticolo(slug: string): Promise<Articolo | null> {
  const supabase = getSupabasePublic();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("articoli")
    .select("*")
    .eq("slug", slug)
    .eq("stato", "pubblicato")
    .lte("published_at", new Date().toISOString())
    .maybeSingle();

  if (error) {
    console.error("getArticolo:", error.message);
    return null;
  }
  return data;
}

/**
 * Un articolo "pubblicato" con data futura e' programmato: le query pubbliche
 * lo escludono finche' la data non passa, poi la rigenerazione ISR (60 s) lo
 * fa comparire da solo. Nessun cron.
 */
export function isProgrammato(a: Pick<Articolo, "stato" | "published_at">): boolean {
  return a.stato === "pubblicato" && !!a.published_at && new Date(a.published_at) > new Date();
}

export function formatData(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Stima di lettura: ~200 parole al minuto, minimo 1. */
export function tempoLettura(html: string): number {
  const parole = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(parole / 200));
}
