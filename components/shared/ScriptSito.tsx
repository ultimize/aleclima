"use client";

import { useEffect } from "react";
import type { ScriptSito as Script } from "@/lib/script-sito";

const CONSENSO = "aleclima_cookie_consent";
export const EVENTO_CONSENSO = "aleclima-consenso";

function consenso(): { analytics: boolean; marketing: boolean } {
  try {
    const c = JSON.parse(localStorage.getItem(CONSENSO) ?? "{}");
    return { analytics: !!c.analytics, marketing: !!c.marketing };
  } catch {
    return { analytics: false, marketing: false };
  }
}

// sopravvive alle navigazioni client-side: ogni script parte una volta sola
const iniettati = new Set<string>();

/**
 * Inserisce gli script configurati in admin. Statistiche e marketing partono
 * solo col consenso relativo (GDPR); se il consenso arriva dopo, partono in
 * quel momento. createContextualFragment, a differenza di innerHTML, esegue
 * i <script> dello snippet.
 */
export function ScriptSito({ script }: { script: Pick<Script, "id" | "posizione" | "categoria" | "codice">[] }) {
  useEffect(() => {
    const carica = () => {
      const c = consenso();
      for (const s of script) {
        if (iniettati.has(s.id)) continue;
        if (s.categoria === "statistiche" && !c.analytics) continue;
        if (s.categoria === "marketing" && !c.marketing) continue;
        iniettati.add(s.id);
        const frammento = document.createRange().createContextualFragment(s.codice);
        if (s.posizione === "head") document.head.appendChild(frammento);
        else if (s.posizione === "body") document.body.prepend(frammento);
        else document.body.appendChild(frammento);
      }
    };
    carica();
    window.addEventListener(EVENTO_CONSENSO, carica);
    return () => window.removeEventListener(EVENTO_CONSENSO, carica);
  }, [script]);

  return null;
}
