"use client";

import React from "react";
import { PageHead } from "@/components/shared/PageHead";
import { Band } from "@/components/shared/Band";
import { I } from "@/components/shared/Icons";
import { Reviews } from "@/components/shared/Reviews";

export const ChiSiamo: React.FC = () => {
  const advantages = [
    { title: "Installazione certificata", text: "Impianti a norma con dichiarazione di conformità.", icon: I.shield },
    { title: "Interventi rapidi a Roma", text: "Sopralluoghi veloci e assistenza tecnica qualificata.", icon: I.bolt },
    { title: "Preventivi senza sorprese", text: "Costi trasparenti e consulenza personalizzata.", icon: I.euro }
  ];

  return (
    <>
      <PageHead 
        crumb="Chi siamo" 
        kick="La nostra storia"
        title="Aleclima e Impianti"
        sub="Una realtà nata nel 2006 per diffondere un nuovo concetto di riscaldamento e climatizzazione." 
      />
      <section className="section">
        <div className="wrap" style={{ maxWidth: 820 }}>
          <p style={{ fontSize: 18, color: "#33485e", marginBottom: 20 }}>
            Con oltre <b>30 anni di esperienza</b> nel settore, ci siamo distinti per la capacità di offrire prodotti e servizi
            che rispondono in modo efficace, innovativo e professionale alle esigenze sempre diverse dei nostri clienti.
          </p>
          <p style={{ fontSize: 18, color: "#33485e", marginBottom: 30 }}>
            Il nostro obiettivo è semplice: <b>consumare e consumare meglio</b>. Proponiamo climatizzatori inverter a pompa di calore,
            caldaie a condensazione e impianti fotovoltaici, perfetti per ridurre i consumi e investire in soluzioni utili,
            efficienti e rispettose dell'ambiente.
          </p>
          <div className="why">
            {advantages.map((w, i) => (
              <div className="wcard" key={i}>
                <div className="wi">{w.icon}</div>
                <div>
                  <h4>{w.title}</h4>
                  <p>{w.text}</p>
                </div>
              </div>
            ))}
          </div>
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
        title="Parliamo del tuo progetto" 
        text="Dal sopralluogo all'installazione, seguiamo ogni fase con professionalità e materiali di alta qualità." 
      />
    </>
  );
};
