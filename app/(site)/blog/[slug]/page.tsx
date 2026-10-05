import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Band } from "@/components/shared/Band";
import { getSupabasePublic } from "@/lib/supabase/public";
import { getArticolo, formatData, tempoLettura } from "@/lib/blog";
import { titoloEffettivo } from "@/lib/seo";
import { OG_IMAGE } from "@/lib/meta";

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
    .eq("stato", "pubblicato")
    .lte("published_at", new Date().toISOString());
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

  const title = titoloEffettivo(a.titolo, a.meta_title);
  const description = a.meta_description || a.sommario || undefined;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/blog/${a.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/blog/${a.slug}`,
      publishedTime: a.published_at ?? undefined,
      modifiedTime: a.updated_at,
      images: [a.cover_url ? { url: a.cover_url } : OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [a.cover_url ?? OG_IMAGE.url],
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
    // Local SEO: autore ed editore sono la stessa HVACBusiness del layout
    // (@id), cosi' Google lega l'articolo a indirizzo, zona servita e scheda
    author: { "@type": "HVACBusiness", "@id": `${SITE}/#azienda`, name: "Aleclima e Impianti S.r.l.s", url: SITE },
    publisher: {
      "@type": "HVACBusiness",
      "@id": `${SITE}/#azienda`,
      name: "Aleclima e Impianti S.r.l.s",
      logo: { "@type": "ImageObject", url: `${SITE}/aleclima-logo.png` },
    },
    spatialCoverage: [
      { "@type": "City", name: "Roma" },
      { "@type": "AdministrativeArea", name: "Città metropolitana di Roma Capitale" },
    ],
    inLanguage: "it-IT",
  };

  // FAQPage: e' cio' che porta l'articolo nei riquadri di Google e nelle risposte AI
  const faq = Array.isArray(a.faq)
    ? a.faq.filter((q) => q?.domanda?.trim() && q?.risposta?.trim())
    : [];

  const faqLd = faq.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((q) => ({
          "@type": "Question",
          name: q.domanda,
          acceptedAnswer: { "@type": "Answer", text: q.risposta },
        })),
      }
    : null;

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
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}

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
          {faq.length > 0 && (
            <section className="article-faq">
              <h2>Domande frequenti</h2>
              {faq.map((q, i) => (
                <details key={i}>
                  <summary>{q.domanda}</summary>
                  <p>{q.risposta}</p>
                </details>
              ))}
            </section>
          )}

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
