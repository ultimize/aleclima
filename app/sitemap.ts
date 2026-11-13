import type { MetadataRoute } from "next";
import { getSupabasePublic } from "@/lib/supabase/public";
import { dataModifica } from "@/lib/blog";

const SITE = "https://www.aleclima.eu";

// un articolo appena pubblicato deve entrare subito nel sitemap. Con
// revalidate = 60 Vercel continuava a servire la versione del deploy (ferma
// per settimane); gli articoli si salvano dal browser, quindi non c'e' un
// revalidatePath da chiamare. ponytail: una query a Supabase per ogni lettura
// del sitemap, trascurabile ai volumi dei crawler.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // lastmod delle pagine statiche: data dell'ultima modifica reale del contenuto.
  // ponytail: aggiornata a mano quando si tocca la pagina; git log al build se diventa scomodo
  const statiche: MetadataRoute.Sitemap = [
    // senza slash finale, come il canonical generato da metadataBase
    { url: SITE, lastModified: "2026-11-13", priority: 1.0, changeFrequency: "monthly" },
    { url: `${SITE}/climatizzazione`, lastModified: "2026-11-13", priority: 0.9, changeFrequency: "monthly" },
    { url: `${SITE}/fotovoltaico`, lastModified: "2026-11-13", priority: 0.9, changeFrequency: "monthly" },
    { url: `${SITE}/caldaie-idraulica`, lastModified: "2026-11-13", priority: 0.8, changeFrequency: "monthly" },
    { url: `${SITE}/chi-siamo`, lastModified: "2026-11-13", priority: 0.6, changeFrequency: "yearly" },
    { url: `${SITE}/contatti`, lastModified: "2026-11-13", priority: 0.7, changeFrequency: "yearly" },
    { url: `${SITE}/blog`, lastModified: "2026-11-13", priority: 0.8, changeFrequency: "weekly" },
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
    lastModified: new Date(dataModifica(a)),
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  // il blog cambia quando esce o si aggiorna un articolo
  const blog = statiche.find((s) => s.url === `${SITE}/blog`);
  if (blog && articoli[0]) {
    blog.lastModified = new Date(Math.max(...articoli.map((x) => new Date(x.lastModified!).getTime())));
  }

  return [...statiche, ...articoli];
}
