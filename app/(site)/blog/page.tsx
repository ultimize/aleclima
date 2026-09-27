import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import Link from "next/link";
import Image from "next/image";
import { PageHead } from "@/components/shared/PageHead";
import { Band } from "@/components/shared/Band";
import { getArticoliPubblicati, formatData } from "@/lib/blog";

export const revalidate = 60;

export const metadata: Metadata = pageMeta(
  "Blog — Consigli su clima, fotovoltaico e riscaldamento | Aleclima",
  "Guide e consigli pratici su climatizzazione, fotovoltaico con accumulo, caldaie e detrazioni fiscali, dagli installatori Aleclima e Impianti di Roma.",
  "/blog"
);

export default async function BlogPage() {
  const articoli = await getArticoliPubblicati();

  return (
    <>
      <PageHead
        crumb="Blog"
        kick="Guide e consigli"
        title="Il blog di Aleclima"
        sub="Quello che spieghiamo ogni giorno ai clienti, scritto qui: come scegliere un impianto, quanto si risparmia davvero e come funzionano le detrazioni."
      />

      <section className="section">
        <div className="wrap">
          {articoli.length === 0 ? (
            <p className="small">
              Non ci sono ancora articoli pubblicati. Torna a trovarci tra poco.
            </p>
          ) : (
            <div className="blog-grid">
              {articoli.map((a) => (
                <article className="bcard" key={a.id}>
                  <Link href={`/blog/${a.slug}`} className="bcard-link">
                    {a.cover_url && (
                      <div className="bcard-img">
                        <Image
                          src={a.cover_url}
                          alt={a.cover_alt ?? a.titolo}
                          width={800}
                          height={450}
                        />
                      </div>
                    )}
                    <div className="bcard-body">
                      {a.published_at && (
                        <time dateTime={a.published_at} className="bcard-date">
                          {formatData(a.published_at)}
                        </time>
                      )}
                      <h2>{a.titolo}</h2>
                      {a.sommario && <p>{a.sommario}</p>}
                      <span className="more">Leggi l&apos;articolo →</span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Band
        title="Hai un dubbio sul tuo impianto?"
        text="Un sopralluogo gratuito vale più di dieci articoli: veniamo a vedere e ti diciamo cosa conviene davvero."
      />
    </>
  );
}
