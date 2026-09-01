"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Segnala la visualizzazione di pagina alle analytics interne.
 * Nessuna libreria, nessun cookie, nessuno storage nel browser.
 */
export function PageViewTracker() {
  const pathname = usePathname();
  const ultimo = useRef<string | null>(null);

  useEffect(() => {
    // React in sviluppo monta due volte: evitiamo il doppio conteggio
    if (ultimo.current === pathname) return;
    ultimo.current = pathname;

    const corpo = JSON.stringify({ percorso: pathname, referrer: document.referrer || undefined });

    // keepalive: la richiesta sopravvive anche se l'utente cambia pagina subito
    fetch("/api/visita", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: corpo,
      keepalive: true,
    }).catch(() => {
      /* una visita persa non deve mai disturbare chi naviga */
    });
  }, [pathname]);

  return null;
}
