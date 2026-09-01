import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // cover degli articoli servite da Supabase Storage
      { protocol: "https", hostname: "aurlsynzwvsquvjelusv.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
  async redirects() {
    return [
      // 301 dai vecchi URL Webador (vedi wiki: da-fare-go-live-seo)
      { source: "/servizi", destination: "/", permanent: true },
      { source: "/sostituzione-caldaie-roma", destination: "/caldaie-idraulica", permanent: true },
    ];
  },
};

export default nextConfig;
