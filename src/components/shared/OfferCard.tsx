import React from "react";
import { useNavigate } from "react-router-dom";
import { I } from "./Icons";

export const eur = (n: number) => "€ " + n.toLocaleString("it-IT");

export interface KitType {
  name: string;
  spec: string;
  price: number;
  feat?: boolean;
  pts?: string[];
}

interface OfferCardProps {
  k: KitType;
  net: boolean;
}

export const OfferCard: React.FC<OfferCardProps> = ({ k, net }) => {
  const navigate = useNavigate();
  const show = net ? Math.round(k.price / 2) : k.price;

  return (
    <div className={`ocard${k.feat ? " feat" : ""}${net ? " net" : ""}`}>
      {k.feat && <span className="tag">Più scelto</span>}
      <div className="oname">{k.name}</div>
      <div className="spec">{k.spec}</div>
      
      <div className="priceb">
        <div className="pre">{net ? "Costo reale dopo detrazione" : "Prezzo chiavi in mano"}</div>
        <div className="price">
          {eur(show)}
          <small>,00</small>
        </div>
        {net ? (
          <div className="save">Recuperi {eur(k.price - show)} con la detrazione fiscale</div>
        ) : (
          <div className="save">Quasi la metà la recuperi: ~{eur(Math.round(k.price / 2))} di detrazione</div>
        )}
      </div>

      {k.pts && (
        <ul>
          {k.pts.map((p, i) => (
            <li key={i}>
              {I.check}
              <span>{p}</span>
            </li>
          ))}
        </ul>
      )}

      <button 
        className="btn btn-green" 
        onClick={() => navigate("/contatti", { state: { servizio: k.pts ? "Fotovoltaico con accumulo" : "Climatizzazione" } })}
        type="button"
      >
        Richiedi preventivo {I.arrow}
      </button>
    </div>
  );
};
