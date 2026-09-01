import React from "react";
import Link from "next/link";

interface PageHeadProps {
  kick: string;
  title: string;
  sub?: string;
  crumb: string;
}

export const PageHead: React.FC<PageHeadProps> = ({ kick, title, sub, crumb }) => {
  return (
    <section className="phead">
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
