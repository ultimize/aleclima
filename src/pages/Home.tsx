import React from "react";
import { useNavigate } from "react-router-dom";
import { Seo } from "../components/shared/Seo";
import { useDetrazione } from "../components/shared/DetrazioneContext";
import { Toggle } from "../components/shared/Toggle";
import { OfferCard, type KitType } from "../components/shared/OfferCard";
import { Band } from "../components/shared/Band";
import { I } from "../components/shared/Icons";

const TEL = "327 8975018";
const TEL_RAW = "393278975018";

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

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { net, setNet } = useDetrazione();

  const services = [
    { ic: I.snow, t: "Climatizzazione", d: "Condizionatori Samsung inverter installati a regola d'arte, chiavi in mano.", p: "/climatizzazione" },
    { ic: I.sun, t: "Fotovoltaico", d: "Impianti con accumulo per produrre, conservare e risparmiare ogni giorno.", p: "/fotovoltaico" },
    { ic: I.flame, t: "Caldaie & Riscaldamento", d: "Installazione, sostituzione e manutenzione di caldaie a condensazione.", p: "/caldaie-idraulica" },
    { ic: I.drop, t: "Idraulica", d: "Impianti idraulici civili e industriali, pronto intervento su Roma.", p: "/caldaie-idraulica" },
  ];

  const why = [
    { ic: I.euro, t: "Prezzo chiaro e chiavi in mano", d: "Nessun costo nascosto: preventivi trasparenti, tutto compreso." },
    { ic: I.shield, t: "Installazione certificata", d: "Impianti a norma con dichiarazione di conformità e libretto." },
    { ic: I.check, t: "Detrazione fiscale gestita", d: "Ci occupiamo noi della pratica ENEA e del recupero del 50%." },
    { ic: I.bolt, t: "Interventi rapidi a Roma", d: "Sopralluoghi veloci e assistenza tecnica qualificata in zona." },
    { ic: I.tools, t: "30+ anni di esperienza", d: "Dal 2006 al fianco di famiglie e aziende del territorio." },
    { ic: I.wa, t: "Finanziamento su misura", d: "Paghi a rate, prima rata anche dopo 4 mesi dall'impianto." },
  ];

  return (
    <>
      <Seo title="Aleclima e Impianti — Clima, Fotovoltaico e Riscaldamento a Roma"
           description="Climatizzatori, fotovoltaico con accumulo, caldaie e idraulica a Roma e provincia. Installazione chiavi in mano, detrazione 50% e preventivo gratuito." />
      <section className="hero">
        <div className="wrap">
          <div>
            <span className="eyebrow">
              <span className="dot" /> Roma e provincia · sopralluogo gratuito
            </span>
            <h1>Il risparmio a portata di <span className="hl">scelta</span>.</h1>
            <p className="lead">
              Climatizzazione, fotovoltaico e riscaldamento chiavi in mano. Consumare e consumare meglio: impianti efficienti che ti ripagano, con la detrazione fiscale gestita da noi.
            </p>
            <div className="hero-cta">
              <button className="btn btn-green" onClick={() => navigate("/contatti")} type="button">
                Richiedi preventivo gratuito {I.arrow}
              </button>
              <a 
                className="btn btn-ghost" 
                href={`tel:+${TEL_RAW}`} 
                style={{ background: "rgba(255,255,255,.08)", color: "#fff", borderColor: "rgba(255,255,255,.3)" }}
              >
                {I.phone} {TEL}
              </a>
            </div>
            <div className="hero-points">
              <span>{I.check} Installazione inclusa</span>
              <span>{I.check} Detrazione 50%</span>
              <span>{I.check} Finanziabile</span>
            </div>
          </div>
          <div className="hero-card">
            <span className="badge">Promo fotovoltaico</span>
            <h3>6 kW + 15 kWh di accumulo</h3>
            <div className="price">€ 9.800<small>,00</small></div>
            <div className="net">Recuperi € 4.900 con la detrazione fiscale del 50%</div>
            <ul>
              <li>{I.check} Installato e certificato</li>
              <li>{I.check} Pratica ENEA inclusa</li>
              <li>{I.check} Finanziabile, 1ª rata dopo 4 mesi</li>
            </ul>
            <button 
              className="btn btn-green" 
              style={{ width: "100%", justifyContent: "center" }} 
              onClick={() => navigate("/fotovoltaico")}
              type="button"
            >
              Scopri l'offerta {I.arrow}
            </button>
          </div>
        </div>
      </section>

      <section className="trust">
        <div className="wrap">
          {[
            ["Dal 2006", "Esperienza sul campo"], 
            ["1.000+", "Lavori completati"], 
            ["99%", "Clienti soddisfatti"], 
            ["Roma", "e tutta la provincia"]
          ].map((x, i) => (
            <div className="item" key={i}>
              <div className="n">{x[0]}</div>
              <div className="l">{x[1]}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="sec-head">
            <div className="kick">Cosa facciamo</div>
            <h2>Un solo interlocutore per la tua casa</h2>
            <p>Dal clima all'energia solare fino al riscaldamento e all'idraulica: progettiamo, installiamo e assistiamo.</p>
          </div>
          <div className="grid-s">
            {services.map((s, i) => (
              <div className="scard" key={i} onClick={() => navigate(s.p)}>
                <div className="ico">{s.ic}</div>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
                <span className="more">Scopri di più {I.arrow}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap">
          <div className="sec-head">
            <div className="kick">Offerte fotovoltaico</div>
            <h2>Investi nel tuo futuro, paga meno</h2>
            <p>Quasi la metà la recuperi grazie alle detrazioni fiscali. Un investimento che ti ripaga.</p>
          </div>
          <Toggle on={net} set={setNet} />
          <div className="offers">
            {fvKits.map((k, i) => (
              <OfferCard key={i} k={k} net={net} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="sec-head">
            <div className="kick">Perché Aleclima</div>
            <h2>Comfort oggi, risparmio sempre</h2>
          </div>
          <div className="why">
            {why.map((w, i) => (
              <div className="wcard" key={i}>
                <div className="wi">{w.ic}</div>
                <div>
                  <h4>{w.t}</h4>
                  <p>{w.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap">
          <div className="quote">
            <div className="q">«Intervento eseguito con competenza, precisione e nei tempi concordati. Azienda seria e altamente professionale.»</div>
            <div className="who">— Silvia Moreschi, cliente · impianto di riscaldamento</div>
          </div>
        </div>
      </section>

      <Band 
        title="Richiedi ora il tuo preventivo gratuito" 
        text="Sopralluogo senza impegno, prezzo chiaro e tutto compreso. Ti diciamo subito quanto risparmi e quanto recuperi." 
      />
    </>
  );
};
