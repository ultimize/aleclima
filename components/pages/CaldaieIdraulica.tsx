"use client";

import React from "react";
import { PageHead } from "@/components/shared/PageHead";
import { Band } from "@/components/shared/Band";
import { I } from "@/components/shared/Icons";
import { Reviews } from "@/components/shared/Reviews";
import { ServizioDettagli, FOTO } from "@/components/shared/ServizioDettagli";

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
      
      <ServizioDettagli
        servizio="Installazione e sostituzione caldaie"
        incluso={[
          "Sopralluogo gratuito e verifica di canna fumaria e scarichi",
          "Fornitura della caldaia: Vaillant, Ariston, Lamborghini",
          "Rimozione e smaltimento della vecchia caldaia",
          "Installazione e prima accensione",
          "Dichiarazione di conformità e libretto d'impianto",
          "Controllo fumi e bollino inclusi",
          "Consulenza sugli incentivi per sistemi ibridi e pompe di calore",
          "IVA già calcolata nel preventivo",
        ]}
        tempi="la sostituzione di una caldaia si completa di norma in mezza giornata, circa 3-5 ore: resti senza acqua calda il meno possibile."
        foto={[FOTO.caldaia]}
        faq={[
          { q: "Quanto tempo serve per sostituire una caldaia?", a: "Di norma mezza giornata, circa 3-5 ore, compresa la rimozione della vecchia caldaia e la prima accensione della nuova." },
          { q: "Con quali marche lavorate?", a: "Installiamo caldaie a condensazione dei principali marchi, tra cui Vaillant, Ariston e Lamborghini. Ti consigliamo il modello giusto al sopralluogo." },
          { q: "Il controllo fumi e il bollino sono inclusi?", a: "Sì. Con l'installazione o la manutenzione della caldaia eseguiamo il controllo fumi e rilasciamo il bollino, oltre a dichiarazione di conformità e libretto d'impianto." },
          { q: "Posso detrarre la sostituzione della caldaia?", a: "Dal 2025 le caldaie a gas installate da sole, anche a condensazione, non hanno più detrazioni fiscali (direttiva europea Case Green). Restano incentivati i sistemi ibridi caldaia più pompa di calore e le pompe di calore: al sopralluogo ti diciamo se conviene e ci occupiamo noi della pratica." },
          { q: "Fate anche pronto intervento idraulico?", a: "Sì: ricerca perdite, sostituzione tubazioni e guasti. Chiamaci al 352 283 8561 e ti diciamo subito quando possiamo intervenire." },
          { q: "In quali zone intervenite?", a: "Roma e tutta la provincia. La nostra sede è a Zagarolo, in Via Colle Pallone Nuovo 26." },
        ]}
      />

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
