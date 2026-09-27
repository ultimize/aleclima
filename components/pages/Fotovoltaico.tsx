"use client";

import React from "react";
import { useDetrazione } from "@/components/shared/DetrazioneContext";
import { PageHead } from "@/components/shared/PageHead";
import { Toggle } from "@/components/shared/Toggle";
import { OfferCard, type KitType } from "@/components/shared/OfferCard";
import { Band } from "@/components/shared/Band";
import { I } from "@/components/shared/Icons";
import { Reviews } from "@/components/shared/Reviews";
import { ServizioDettagli, FOTO } from "@/components/shared/ServizioDettagli";

const fvKits: KitType[] = [
  { 
    name: "Essenziale", 
    spec: "4 kW + 5 kWh", 
    price: 5690, 
    feat: false,
    pts: ["Installazione, IVA e collaudo inclusi", "Energia anche di notte con accumulo", "Più risparmio e indipendenza", "Pratica detrazione fiscale"] 
  },
  { 
    name: "Comfort", 
    spec: "6 kW + 10 kWh", 
    price: 8290, 
    feat: false,
    pts: ["Tutto compreso, IVA inclusa", "Certificazione di conformità", "Pratica ENEA per detrazione 50%", "Sopralluogo gratuito"] 
  },
  { 
    name: "Indipendenza", 
    spec: "6 kW + 15 kWh", 
    price: 9800, 
    feat: true,
    pts: ["Installato e certificato", "Pratica ENEA inclusa, recupero 50%", "Finanziabile, prima rata dopo 4 mesi", "Massima autonomia energetica"] 
  },
];

export const Fotovoltaico: React.FC = () => {
  const { net, setNet } = useDetrazione();

  const advantages = [
    { label: "Certificazione di conformità", icon: I.shield },
    { label: "Pratica ENEA inclusa", icon: I.check },
    { label: "50% di recupero fiscale", icon: I.euro },
    { label: "Finanziabile, 1ª rata dopo 4 mesi", icon: I.wa },
    { label: "Rate su misura per te", icon: I.bolt },
    { label: "Pratica veloce e semplice", icon: I.tools }
  ];

  return (
    <>
      <PageHead 
        crumb="Fotovoltaico" 
        kick="Il sole lavora per te"
        title="Fotovoltaico con accumulo"
        sub="Energia pulita e rinnovabile, indipendenza energetica e bollette più basse. Produci di giorno, usi anche di notte grazie all'accumulo." 
      />
      <section className="section">
        <div className="wrap">
          <Toggle on={net} set={setNet} />
          <div className="offers">
            {fvKits.map((k, i) => (
              <OfferCard key={i} k={k} net={net} />
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap">
          <div className="sec-head">
            <div className="kick">Tutto incluso</div>
            <h2>Zero pensieri, solo vantaggi</h2>
          </div>
          <div className="why">
            {advantages.map((w, i) => (
              <div className="wcard" key={i}>
                <div className="wi">{w.icon}</div>
                <div>
                  <h4>{w.label}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServizioDettagli
        servizio="Installazione impianti fotovoltaici con accumulo"
        incluso={[
          "Sopralluogo gratuito e dimensionamento sui tuoi consumi",
          "Fornitura di pannelli, inverter e batteria di accumulo",
          "Installazione, collaudo e messa in servizio",
          "Dichiarazione di conformità dell'impianto",
          "Pratica ENEA per la detrazione fiscale del 50%",
          "IVA inclusa, nessun costo nascosto",
          "Finanziamento con prima rata dopo 4 mesi",
          "Energia anche di notte grazie all'accumulo",
        ]}
        tempi="un impianto fotovoltaico con accumulo si installa in 1-2 giorni lavorativi, in base al tetto e al numero di moduli."
        faq={[
          { q: "Quanto tempo serve per installare il fotovoltaico?", a: "Generalmente tra 1 e 2 giorni lavorativi, a seconda della complessità del tetto e del numero di moduli da posare." },
          { q: "Cosa è incluso nel prezzo?", a: "Sopralluogo, pannelli, inverter e accumulo, installazione, collaudo, dichiarazione di conformità, pratica ENEA per la detrazione e IVA. Il prezzo del preventivo è quello finale." },
          { q: "Come funziona la detrazione del 50%?", a: "Recuperi metà della spesa in rate annuali sulle tasse. La pratica ENEA è inclusa e la gestiamo noi: su un impianto da 9.800 euro recuperi 4.900 euro." },
          { q: "Posso pagare a rate?", a: "Sì, l'impianto è finanziabile con rate su misura e la prima rata arriva dopo 4 mesi dall'installazione." },
          { q: "A cosa serve la batteria di accumulo?", a: "Conserva l'energia prodotta di giorno e non consumata, così la usi anche la sera e di notte: più autoconsumo e bollette più basse." },
          { q: "In quali zone installate?", a: "Roma e tutta la provincia. La nostra sede è a Zagarolo, in Via Colle Pallone Nuovo 26." },
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
        title="Quasi la metà la recuperi" 
        text="Un investimento che ti ripaga. Richiedi uno studio di fattibilità gratuito per la tua casa." 
      />
    </>
  );
};
