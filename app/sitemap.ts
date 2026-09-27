import type { MetadataRoute } from "next";
import { getSupabasePublic } from "@/lib/supabase/public";

const SITE = "https://www.aleclima.eu";

// un articolo appena pubblicato deve entrare subito nel sitemap. Con
// revalidate = 60 Vercel continuava a servire la versione del deploy (ferma
// per settimane); gli articoli si salvano dal browser, quindi non c'e' un
// revalidatePath da chiamare. ponytail: una query a Supabase per ogni lettura
// del sitemap, trascurabile ai volumi dei crawler.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const statiche: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, priority: 1.0, changeFrequency: "monthly" },
    { url: `${SITE}/climatizzazione`, priority: 0.9, changeFrequency: "monthly" },
    { url: `${SITE}/fotovoltaico`, priority: 0.9, changeFrequency: "monthly" },
    { url: `${SITE}/caldaie-idraulica`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${SITE}/chi-siamo`, priority: 0.6, changeFrequency: "yearly" },
    { url: `${SITE}/contatti`, priority: 0.7, changeFrequency: "yearly" },
    { url: `${SITE}/blog`, priority: 0.8, changeFrequency: "weekly" },
  ];

  // se Supabase non e' configurato il sitemap resta alle sole pagine statiche
  const supabase = getSupabasePublic();
  if (!supabase) return statiche;

  const { data } = await supabase
    .from("articoli")
    .select("slug, updated_at, published_at")
    .eq("stato", "pubblicato")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });

  const articoli: MetadataRoute.Sitemap = (data ?? []).map((a) => ({
    url: `${SITE}/blog/${a.slug}`,
    lastModified: new Date(a.updated_at ?? a.published_at ?? Date.now()),
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  return [...statiche, ...articoli];
}
