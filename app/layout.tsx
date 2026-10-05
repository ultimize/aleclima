import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { OG_IMAGE } from "@/lib/meta";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.aleclima.eu"),
  title: {
    default: "Aleclima e Impianti — Climatizzazione, Fotovoltaico e Riscaldamento a Roma",
    template: "%s — Aleclima e Impianti",
  },
  description:
    "Aleclima e Impianti S.r.l.s: climatizzatori, fotovoltaico con accumulo, caldaie e idraulica a Roma e provincia. Installazione chiavi in mano, detrazione fiscale 50% e preventivo gratuito.",
  authors: [{ name: "Aleclima e Impianti S.r.l.s" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    siteName: "Aleclima e Impianti",
    locale: "it_IT",
    url: "/",
    title: "Aleclima e Impianti — Clima, Fotovoltaico e Riscaldamento a Roma",
    description:
      "Impianti chiavi in mano a Roma e provincia. Fotovoltaico con accumulo, climatizzatori Samsung e caldaie, con detrazione fiscale 50% e preventivo gratuito.",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aleclima e Impianti — Clima, Fotovoltaico e Riscaldamento a Roma",
    description: "Impianti chiavi in mano a Roma e provincia. Detrazione fiscale 50% e preventivo gratuito.",
    images: [OG_IMAGE.url],
  },
};

export const viewport = {
  themeColor: "#0A2540",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        {/* Google Consent Mode v2: tutto negato finche' l'utente non sceglie.
            beforeInteractive perche' deve girare prima di qualsiasi tag. */}
        <Script id="consent-mode-default" strategy="beforeInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{
  ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied',
  analytics_storage:'denied', functionality_storage:'granted',
  security_storage:'granted', wait_for_update:500
});`}
        </Script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
