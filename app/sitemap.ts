import type { MetadataRoute } from "next";
import { getSupabasePublic } from "@/lib/supabase/public";

const SITE = "https://www.aleclima.eu";

// un articolo appena pubblicato deve entrare subito nel sitemap:
// con un'ora di cache Google lo scopriva molto dopo
export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const oggi = new Date();
  const statiche: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, priority: 1.0, changeFrequency: "monthly", lastModified: oggi },
    { url: `${SITE}/climatizzazione`, priority: 0.9, changeFrequency: "monthly" , lastModified: oggi },
    { url: `${SITE}/fotovoltaico`, priority: 0.9, changeFrequency: "monthly" , lastModified: oggi },
    { url: `${SITE}/caldaie-idraulica`, priority: 0.8, changeFrequency: "monthly" , lastModified: oggi },
    { url: `${SITE}/chi-siamo`, priority: 0.6, changeFrequency: "yearly" , lastModified: oggi },
    { url: `${SITE}/contatti`, priority: 0.7, changeFrequency: "yearly" , lastModified: oggi },
    { url: `${SITE}/blog`, priority: 0.8, changeFrequency: "weekly" , lastModified: oggi },
  ];

  // se Supabase non e' configurato il sitemap resta alle sole pagine statiche
  const supabase = getSupabasePublic();
  if (!supabase) return statiche;

  const { data } = await supabase
    .from("articoli")
    .select("slug, updated_at, published_at")
    .eq("stato", "pubblicato")
    .order("published_at", { ascending: false });

  const articoli: MetadataRoute.Sitemap = (data ?? []).map((a) => ({
    url: `${SITE}/blog/${a.slug}`,
    lastModified: new Date(a.updated_at ?? a.published_at ?? Date.now()),
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  return [...statiche, ...articoli];
}
