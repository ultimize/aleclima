import React from "react";
import Image from "next/image";
import { I } from "@/components/shared/Icons";

export type Foto = { src: string; alt: string };
export type Faq = { q: string; a: string };

/** Foto di lavori reali, in /public/lavori (1050x1400). */
export const FOTO = {
  esterna: { src: "/lavori/climatizzatore-comfee-unita-esterna-balcone.jpg", alt: "Unità esterna Comfee installata su balcone con canalina bianca" },
  mansarda: { src: "/lavori/climatizzatore-haier-mansarda.jpg", alt: "Climatizzatore Haier installato in mansarda" },
  camera: { src: "/lavori/climatizzatore-camera-da-letto.jpg", alt: "Split a parete installato in camera da letto" },
  corridoio: { src: "/lavori/climatizzatore-comfee-corridoio.jpg", alt: "Climatizzatore Comfee installato sopra una porta nel corridoio" },
  caldaia: { src: "/lavori/caldaia-vaillant-ecotec-intro.jpg", alt: "Caldaia a condensazione Vaillant ecoTEC intro installata a parete" },
} satisfies Record<string, Foto>;

const CERTIFICAZIONI = [
  { t: "Dichiarazione di Conformità", d: "La DiCo che certifica l'impianto a norma di legge (DM 37/08)." },
  { t: "Libretto d'impianto", d: "Rilasciato o aggiornato, obbligatorio per impianti termici e di climatizzazione." },
  { t: "Abilitazione F-Gas", d: "Installazioni eseguite da tecnici certificati per i gas fluorurati." },
  { t: "Controllo fumi e bollino", d: "Per installazione e manutenzione delle caldaie." },
];

type Props = {
  servizio: string;
  incluso: string[];
  tempi: string;
  faq: Faq[];
  foto?: Foto[];
};

/**
 * Blocco comune alle pagine servizio: prezzo, tempi, documenti, lavori e FAQ.
 * Il testo visibile e il FAQPage JSON-LD escono dallo stesso array, cosi'
 * non possono divergere (Google penalizza FAQ markup non presenti in pagina).
 */
export const ServizioDettagli: React.FC<Props> = ({ servizio, incluso, tempi, faq, foto }) => {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: servizio,
      provider: { "@id": "https://www.aleclima.eu/#azienda" },
      areaServed: [
        { "@type": "City", name: "Roma" },
        { "@type": "AdministrativeArea", name: "Provincia di Roma" },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="section">
        <div className="wrap">
          <div className="sec-head">
            <div className="kick">Prezzo tutto compreso</div>
            <h2>Cosa è incluso</h2>
            <p>Nessun costo nascosto: il preventivo che firmi è quello che paghi.</p>
          </div>
          <ul className="incl">
            {incluso.map((x, i) => (
              <li key={i}>
                {I.check}
                <span>{x}</span>
              </li>
            ))}
          </ul>
          <p style={{ textAlign: "center", color: "var(--grigio)", marginTop: 24, fontSize: 15 }}>
            <b style={{ color: "var(--notte)" }}>Tempi di installazione:</b> {tempi}
          </p>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap">
          <div className="sec-head">
            <div className="kick">Tutto a norma</div>
            <h2>Certificazioni e documenti rilasciati</h2>
            <p>Lavoriamo solo con tecnici qualificati e ti consegniamo tutta la documentazione obbligatoria per legge.</p>
          </div>
          <div className="why" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
            {CERTIFICAZIONI.map((c) => (
              <div className="wcard" key={c.t}>
                <div className="wi">{I.shield}</div>
                <div>
                  <h4>{c.t}</h4>
                  <p>{c.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {foto && foto.length > 0 && (
        <section className="section">
          <div className="wrap">
            <div className="sec-head">
              <div className="kick">Lavori realizzati</div>
              <h2>Alcune nostre installazioni</h2>
            </div>
            <div className="lavori">
              {foto.map((f) => (
                <Image key={f.src} src={f.src} alt={f.alt} width={1050} height={1400} sizes="(max-width: 900px) 50vw, 25vw" />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="wrap wrap-narrow">
          <div className="article-faq" style={{ marginTop: 0, borderTop: 0, paddingTop: 0 }}>
            <h2>Domande frequenti</h2>
            {faq.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
