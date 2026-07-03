import React from "react";
import { Seo } from "../components/shared/Seo";
import { useDetrazione } from "../components/shared/DetrazioneContext";
import { PageHead } from "../components/shared/PageHead";
import { Toggle } from "../components/shared/Toggle";
import { OfferCard, type KitType } from "../components/shared/OfferCard";
import { Band } from "../components/shared/Band";
import { Reviews } from "../components/shared/Reviews";

const climaKits: KitType[] = [
  { 
    name: "Samsung AR", 
    spec: "9.000 BTU", 
    price: 1180,
    pts: [
      "Installazione standard entro 3 metri",
      "Staffa, rame e cavo elettrico",
      "Certificazione conformità di legge",
      "Libretto impianto",
      "Registrazione F-gas per garanzia",
      "Possibilità detrazione fiscale"
    ]
  },
  { 
    name: "Samsung AR", 
    spec: "12.000 BTU", 
    price: 1270,
    pts: [
      "Installazione standard entro 3 metri",
      "Staffa, rame e cavo elettrico",
      "Certificazione conformità di legge",
      "Libretto impianto",
      "Registrazione F-gas per garanzia",
      "Possibilità detrazione fiscale"
    ]
  },
];

export const Climatizzazione: React.FC = () => {
  const { net, setNet } = useDetrazione();

  return (
    <>
      <Seo title="Climatizzatori Samsung a Roma — Installazione chiavi in mano | Aleclima"
           description="Climatizzatori Samsung 9.000 e 12.000 BTU installati a regola d'arte a Roma e provincia. Prezzo chiavi in mano, certificazione di legge e detrazione fiscale." />
      <PageHead 
        crumb="Climatizzazione" 
        kick="Comfort che fa la differenza"
        title="Climatizzatori Samsung chiavi in mano"
        sub="Aria pulita e salubre, funzionamento silenzioso, basso consumo e controllo smart Wi-Fi. Installazione professionale inclusa nel prezzo." 
      />
      <section className="section">
        <div className="wrap">
          <Toggle on={net} set={setNet} />
          <div className="offers two">
            {climaKits.map((k, i) => (
              <OfferCard key={i} k={k} net={net} />
            ))}
          </div>
          <p style={{ textAlign: "center", color: "var(--grigio)", marginTop: 30, fontSize: 14 }}>
            Prezzi riferiti a installazione standard. Soluzioni multisplit e su misura su richiesta.
          </p>
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
        title="Vuoi il clima perfetto in casa?" 
        text="Garanzia ufficiale Samsung, installazione rapida e pulita, assistenza post-vendita dedicata." 
      />
    </>
  );
};
