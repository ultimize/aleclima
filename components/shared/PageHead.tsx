import React from "react";
import Link from "next/link";

const SITE = "https://www.aleclima.eu";

interface PageHeadProps {
  kick: string;
  title: string;
  sub?: string;
  crumb: string;
  /** percorso della pagina, per lo schema BreadcrumbList */
  path: string;
}

export const PageHead: React.FC<PageHeadProps> = ({ kick, title, sub, crumb, path }) => {
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: crumb, item: `${SITE}${path}` },
    ],
  };
  return (
    <section className="phead">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="wrap">
        <div className="crumb">
          <Link href="/" style={{ color: "#8fb0d4" }}>Home</Link>
          <span>/</span>
          <b>{crumb}</b>
        </div>
        <div className="kick">{kick}</div>
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
    </section>
  );
};
