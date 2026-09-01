import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // i bot AI sono ammessi di proposito: vedi wiki da-fare-go-live-seo (GEO)
      { userAgent: "*", allow: "/", disallow: ["/admin", "/admin/"] },
    ],
    sitemap: "https://www.aleclima.eu/sitemap.xml",
    host: "https://www.aleclima.eu",
  };
}
