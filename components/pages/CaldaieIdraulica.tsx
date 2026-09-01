"use client";

import React from "react";
import { PageHead } from "@/components/shared/PageHead";
import { Band } from "@/components/shared/Band";
import { I } from "@/components/shared/Icons";
import { Reviews } from "@/components/shared/Reviews";

export const CaldaieIdraulica: React.FC = () => {
  const blocks = [
    { 
      t: "Caldaie & riscaldamento", 
      items: [
        "Sostituzione caldaia con smaltimento del vecchio impianto", 
        "Caldaie a condensazione e tradizionali", 
        "Manutenzione e controllo combustione (bollino)", 
        "Adeguamento canna fumaria e scarico condensa", 
        "Impianti di riscaldamento completi"
      ] 
    },
    { 
      t: "Impianti idraulici civili e industriali", 
      items: [
        "Rifacimento e ristrutturazione impianti", 
        "Ricerca perdite", 
        "Sostituzione tubazioni", 
        "Adeguamento impianti a norma", 
        "Pronto intervento guasti e perdite"
      ] 
    },
  ];

  return (
    <>
      <PageHead 
        crumb="Caldaie & Idraulica" 
        kick="Termoidraulica a Roma"
        title="Caldaie, riscaldamento e idraulica"
        sub="Interventi rapidi, impianti a norma e massima efficienza energetica, per abitazioni, condomini e attività commerciali." 
      />
      <section className="section">
        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 36 }}>
          {blocks.map((b, i) => (
            <div key={i}>
              <h2 style={{ color: "var(--notte)", fontSize: 28, marginBottom: 16 }}>{b.t}</h2>
              <ul className="incl">
                {b.items.map((x, j) => (
                  <li key={j}>
                    {I.check}
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      
      <section className="section alt">
        <div className="wrap">
          <div className="sec-head">
            <div className="kick">Dicono di noi</div>
            <h2>Le recensioni dei nostri clienti</h2>
            <p>Competenza, precisione e tempi rispettati: ecco l'esperienza di chi ha già scelto Aleclima.</p>
          </div>
          <Reviews />
        </div>
      </section>

      <Band 
        title="Caldaia in blocco? Perdita in casa?" 
        text="Pronto intervento e preventivi chiari su Roma e provincia. Chiamaci, interveniamo in fretta." 
      />
    </>
  );
};
