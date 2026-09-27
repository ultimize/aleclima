import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/shared/FloatingWhatsApp";
import { CookieConsent } from "@/components/shared/CookieConsent";
import { DetrazioneProvider } from "@/components/shared/DetrazioneContext";
import { PageViewTracker } from "@/components/shared/PageViewTracker";
import { ScriptSito } from "@/components/shared/ScriptSito";
import { getImpostazioni, getScriptAttivi } from "@/lib/script-sito";
import type { Metadata } from "next";

/** Codici di verifica Search Console / Bing, gestiti da admin > Script del sito. */
export async function generateMetadata(): Promise<Metadata> {
  const imp = await getImpostazioni();
  return {
    verification: {
      google: imp.verifica_google ?? undefined,
      other: imp.verifica_bing ? { "msvalidate.01": imp.verifica_bing } : undefined,
    },
  };
}

/** Dati strutturati dell'attivita': erano inline in index.html, ora vivono qui. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HVACBusiness",
  "@id": "https://www.aleclima.eu/#azienda",
  name: "Aleclima e Impianti S.r.l.s",
  image: "https://www.aleclima.eu/og-image.jpg",
  logo: "https://www.aleclima.eu/aleclima-logo.png",
  url: "https://www.aleclima.eu/",
  telephone: "+39 352 283 8561",
  email: "aleclimaimpiantisrls@gmail.com",
  priceRange: "€€",
  vatID: "IT15597681004",
  foundingDate: "2006",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Via Colle Pallone Nuovo 26",
    addressLocality: "Zagarolo",
    postalCode: "00039",
    addressRegion: "RM",
    addressCountry: "IT",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00",
    },
  ],
  hasMap: "https://www.google.com/maps?cid=13575034310260101372",
  areaServed: [
    { "@type": "City", name: "Roma" },
    { "@type": "City", name: "Zagarolo" },
    { "@type": "AdministrativeArea", name: "Provincia di Roma" },
  ],
  sameAs: [
    "https://www.instagram.com/aleclimaeimpianti",
    "https://www.facebook.com/aleclima.impiantisrls",
    "https://www.tiktok.com/@aleclimaeimpianti",
  ],
};

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const script = await getScriptAttivi();
  return (
    <DetrazioneProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="al-root">
        <Header />
        <main>{children}</main>
        <Footer />
        <FloatingWhatsApp />
        <CookieConsent />
        <PageViewTracker />
        <ScriptSito script={script} />
      </div>
    </DetrazioneProvider>
  );
}
