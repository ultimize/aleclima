"use client";

import { useEffect } from "react";

const PROGETTO = "yt0vev1tl8";
const CONSENSO = "aleclima_cookie_consent";
export const EVENTO_CONSENSO = "aleclima-consenso";

function statisticheConsentite(): boolean {
  try {
    return !!JSON.parse(localStorage.getItem(CONSENSO) ?? "{}").analytics;
  } catch {
    return false;
  }
}

/**
 * Microsoft Clarity: registra sessioni e heatmap, quindi per il GDPR parte solo
 * se il visitatore accetta i cookie statistici (subito o dal banner).
 */
export function Clarity() {
  useEffect(() => {
    const carica = () => {
      if (!statisticheConsentite() || document.getElementById("ms-clarity")) return;
      const w = window as unknown as { clarity?: { (...a: unknown[]): void; q?: unknown[] } };
      w.clarity = w.clarity || Object.assign((...a: unknown[]) => (w.clarity!.q = w.clarity!.q || []).push(a), {});
      const s = document.createElement("script");
      s.id = "ms-clarity";
      s.async = true;
      s.src = `https://www.clarity.ms/tag/${PROGETTO}`;
      document.head.appendChild(s);
    };
    carica();
    window.addEventListener(EVENTO_CONSENSO, carica);
    return () => window.removeEventListener(EVENTO_CONSENSO, carica);
  }, []);

  return null;
}
