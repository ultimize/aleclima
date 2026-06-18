import React from "react";
import { useNavigate } from "react-router-dom";
import { I } from "./Icons";

export const WA = "393479576619";

interface BandProps {
  title: string;
  text: string;
}

export const Band: React.FC<BandProps> = ({ title, text }) => {
  const navigate = useNavigate();

  return (
    <div className="section">
      <div className="wrap">
        <div className="band">
          <div>
            <h2>{title}</h2>
            <p>{text}</p>
          </div>
          <div className="b-cta">
            <button 
              className="btn btn-ghost" 
              onClick={() => navigate("/contatti")} 
              type="button"
            >
              Preventivo gratuito {I.arrow}
            </button>
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
