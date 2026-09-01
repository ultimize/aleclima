import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Band } from "@/components/shared/Band";
import { getSupabasePublic } from "@/lib/supabase/public";
import { getArticolo, formatData, tempoLettura } from "@/lib/blog";

export const revalidate = 60;
export const dynamicParams = true;

const SITE = "https://www.aleclima.eu";

/** Pre-genera al build gli articoli gia' pubblicati; i nuovi arrivano via ISR. */
export async function generateStaticParams() {
  const supabase = getSupabasePublic();
  if (!supabase) return [];

  const { data } = await supabase
    .from("articoli")
    .select("slug")
    .eq("stato", "pubblicato");
  return (data ?? []).map((a: { slug: string }) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArticolo(slug);
  if (!a) return { title: "Articolo non trovato" };

  const title = a.meta_title || a.titolo;
  const description = a.meta_description || a.sommario || undefined;

  return {
    title: { absolute: `${title} | Aleclima e Impianti` },
    description,
    alternates: { canonical: `/blog/${a.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/blog/${a.slug}`,
      publishedTime: a.published_at ?? undefined,
      modifiedTime: a.updated_at,
      images: a.cover_url ? [{ url: a.cover_url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: a.cover_url ? [a.cover_url] : undefined,
    },
  };
}

export default async function ArticoloPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = await getArticolo(slug);
  if (!a) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.titolo,
    description: a.meta_description || a.sommario || undefined,
    image: a.cover_url ? [a.cover_url] : undefined,
    datePublished: a.published_at ?? a.created_at,
    dateModified: a.updated_at,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}/blog/${a.slug}` },
    author: { "@type": "Organization", name: "Aleclima e Impianti S.r.l.s", url: SITE },
    publisher: {
      "@type": "Organization",
      name: "Aleclima e Impianti S.r.l.s",
      logo: { "@type": "ImageObject", url: `${SITE}/aleclima-logo.png` },
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` },
      { "@type": "ListItem", position: 3, name: a.titolo, item: `${SITE}/blog/${a.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <section className="phead">
        <div className="wrap">
          <div className="crumb">
            <Link href="/" style={{ color: "#8fb0d4" }}>Home</Link>
            <span>/</span>
            <Link href="/blog" style={{ color: "#8fb0d4" }}>Blog</Link>
            <span>/</span>
            <b>{a.titolo}</b>
          </div>
          <div className="kick">
            {a.published_at && (
              <time dateTime={a.published_at}>{formatData(a.published_at)}</time>
            )}
            {" · "}
            {tempoLettura(a.contenuto_html)} min di lettura
          </div>
          <h1>{a.titolo}</h1>
          {a.sommario && <p>{a.sommario}</p>}
        </div>
      </section>

      <section className="section">
        <div className="wrap wrap-narrow">
          {a.cover_url && (
            <div className="article-cover">
              <Image
                src={a.cover_url}
                alt={a.cover_alt ?? a.titolo}
                width={1200}
                height={675}
                priority
              />
            </div>
          )}
          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: a.contenuto_html }}
          />
          <p className="article-back">
            <Link href="/blog">← Torna a tutti gli articoli</Link>
          </p>
        </div>
      </section>

      <Band
        title="Vuoi un parere sul tuo caso?"
        text="Ogni casa è diversa. Un sopralluogo gratuito è il modo più rapido per capire cosa conviene."
      />
    </>
  );
}
