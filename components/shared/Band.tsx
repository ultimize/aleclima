"use client";

import React from "react";
import Link from "next/link";
import { I } from "./Icons";

export const WA = "393479576619";

interface BandProps {
  title: string;
  text: string;
}

export const Band: React.FC<BandProps> = ({ title, text }) => {
  return (
    <div className="section">
      <div className="wrap">
        <div className="band">
          <div>
            <h2>{title}</h2>
            <p>{text}</p>
          </div>
          <div className="b-cta">
            <Link className="btn btn-ghost" href="/contatti">
              Preventivo gratuito {I.arrow}
            </Link>
            <a
              className="btn btn-wa"
              href={`https://wa.me/${WA}`}
              target="_blank"
              rel="noreferrer"
            >
              {I.wa} WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
