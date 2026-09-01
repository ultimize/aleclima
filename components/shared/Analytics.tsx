"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Google Analytics 4.
 *
 * Il tag viene caricato sempre, ma il Consent Mode v2 in app/layout.tsx ha gia'
 * impostato tutto su "denied": finche' l'utente non accetta, GA invia solo ping
 * senza cookie e senza identificatori. E' il consenso salvato dal banner
 * (CookieConsent) a fare il gtag('consent','update') che sblocca la misurazione.
 *
 * Se NEXT_PUBLIC_GA_ID non c'e', qui non viene caricato nulla.
 */
export function Analytics() {
  const pathname = usePathname();

  // App Router: il cambio pagina non ricarica il documento, quindi il page_view
  // dopo il primo va inviato a mano.
  useEffect(() => {
    if (!GA_ID) return;
    const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
    if (typeof g !== "function") return;
    g("event", "page_view", {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);

  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}', {
  anonymize_ip: true,
  send_page_view: true
});`}
      </Script>
    </>
  );
}
