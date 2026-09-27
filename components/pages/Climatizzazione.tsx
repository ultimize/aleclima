"use client";

import React from "react";
import { useDetrazione } from "@/components/shared/DetrazioneContext";
import { PageHead } from "@/components/shared/PageHead";
import { Toggle } from "@/components/shared/Toggle";
import { OfferCard, type KitType } from "@/components/shared/OfferCard";
import { Band } from "@/components/shared/Band";
import { Reviews } from "@/components/shared/Reviews";
import { ServizioDettagli, FOTO } from "@/components/shared/ServizioDettagli";

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
      
      <ServizioDettagli
        servizio="Installazione climatizzatori"
        incluso={[
          "Sopralluogo gratuito per scegliere potenza e posizione",
          "Fornitura del climatizzatore scelto",
          "Montaggio di unità interna ed esterna, fino a 3 metri di linea frigorifera",
          "Staffa, tubazioni in rame e collegamento elettrico",
          "Dichiarazione di conformità, libretto d'impianto e registrazione F-Gas",
          "Pratica ENEA per la detrazione fiscale del 50%",
          "IVA ed ecotassa già calcolate nel preventivo",
          "Installazione pulita e assistenza post-vendita",
        ]}
        tempi="per uno split standard basta mezza giornata, circa 3-5 ore. Multisplit e installazioni su misura li pianifichiamo al sopralluogo."
        foto={[FOTO.esterna, FOTO.mansarda, FOTO.camera, FOTO.corridoio]}
        faq={[
          { q: "Quanto tempo serve per installare un climatizzatore?", a: "Per un climatizzatore split standard l'installazione si completa in mezza giornata, circa 3-5 ore, riducendo al minimo il disagio in casa." },
          { q: "Cosa comprende il prezzo chiavi in mano?", a: "Sopralluogo, fornitura del climatizzatore, montaggio di unità interna ed esterna fino a 3 metri di linea frigorifera, staffa, rame e cavo elettrico, certificazioni di legge, pratica ENEA per la detrazione, IVA ed ecotassa. Nessun costo nascosto." },
          { q: "Posso avere la detrazione del 50% sul climatizzatore?", a: "Sì, per i climatizzatori in pompa di calore che rispettano i requisiti di legge. La pratica ENEA è inclusa nel prezzo e la gestiamo noi." },
          { q: "Quali certificazioni rilasciate a fine lavoro?", a: "Dichiarazione di conformità dell'impianto, libretto d'impianto e registrazione F-Gas: i nostri tecnici sono abilitati per i gas fluorurati, requisito necessario anche per la garanzia del produttore." },
          { q: "Cosa succede se servono più di 3 metri di linea?", a: "Lo verifichiamo al sopralluogo gratuito e lo indichiamo nel preventivo prima di iniziare, così sai esattamente quanto spendi." },
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
        title="Vuoi il clima perfetto in casa?" 
        text="Garanzia ufficiale Samsung, installazione rapida e pulita, assistenza post-vendita dedicata." 
      />
    </>
  );
};
