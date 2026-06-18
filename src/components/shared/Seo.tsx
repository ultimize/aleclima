import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * SEO per-route senza dipendenze (React 18).
 * Aggiorna <title>, description, canonical e OG/Twitter al cambio rotta.
 * NOTA: gli scraper di WhatsApp/Facebook NON eseguono JS: per le anteprime
 * di condivisione valgono i meta statici in index.html. Questo componente
 * migliora titolo della tab e indicizzazione Google (che esegue il JS).
 */
const SITE = "https://www.aleclima.eu"; // <-- cambia se usi un dominio diverso
const DEFAULT_OG = `${SITE}/og-image.jpg`;

type Props = { title: string; description: string; image?: string };

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}
function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function Seo({ title, description, image = DEFAULT_OG }: Props) {
  const { pathname } = useLocation();
  useEffect(() => {
    const url = `${SITE}${pathname}`;
    document.title = title;
    setMeta("name", "description", description);
    setCanonical(url);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", image);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image);
  }, [pathname, title, description, image]);
  return null;
}
