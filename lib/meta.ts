import type { Metadata } from "next";

export const OG_IMAGE = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "Aleclima e Impianti — fotovoltaico, clima e riscaldamento a Roma",
};

/**
 * Metadata di una pagina statica. Next non fonde openGraph/twitter col layout:
 * se la pagina li dichiara li sostituisce per intero, quindi immagine e testi
 * social vanno ripetuti qui, altrimenti la condivisione esce senza anteprima.
 */
export function pageMeta(title: string, description: string, path: string): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: "Aleclima e Impianti",
      locale: "it_IT",
      title,
      description,
      url: path,
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
  };
}
