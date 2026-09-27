import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // cover degli articoli servite da Supabase Storage
      { protocol: "https", hostname: "aurlsynzwvsquvjelusv.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // niente iframe del sito su domini altrui (clickjacking)
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          // CSP parziale: gli script restano liberi perche' li decide l'admin
          // (Analytics, Clarity...), ma si bloccano plugin, <base> e form verso
          // altri domini, e l'incorporamento in frame esterni
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'",
          },
        ],
      },
    ];
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
