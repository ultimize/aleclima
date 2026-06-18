import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "../shared/Logo";

const EMAIL = "aleclimaimpiantisrls@gmail.com";
const TEL = "327 8975018";
const TEL_RAW = "393278975018";
const WA = "393479576619";

export const Footer: React.FC = () => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer>
      <div className="wrap">
        <div className="fgrid">
          <div>
            <Logo light />
            <p className="small" style={{ marginTop: 14 }}>
              Climatizzazione, fotovoltaico, caldaie e idraulica a Roma e provincia.
              <br />
              Consumare e consumare meglio.
            </p>
            <div className="fsoc">
              <a href="https://instagram.com/aleclimaeimpianti" target="_blank" rel="noreferrer" aria-label="Instagram">IG</a>
              <a href="https://facebook.com/share/1GqSGc1ccW/" target="_blank" rel="noreferrer" aria-label="Facebook">FB</a>
              <a href="https://tiktok.com/@aleclimaeimpianti" target="_blank" rel="noreferrer" aria-label="TikTok">TT</a>
              <a href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer" aria-label="WhatsApp">WA</a>
            </div>
          </div>
          <div>
            <h4>Servizi</h4>
            <ul>
              <li><Link to="/climatizzazione" onClick={handleScrollToTop}>Climatizzazione</Link></li>
              <li><Link to="/fotovoltaico" onClick={handleScrollToTop}>Fotovoltaico</Link></li>
              <li><Link to="/caldaie-idraulica" onClick={handleScrollToTop}>Caldaie & Riscaldamento</Link></li>
              <li><Link to="/caldaie-idraulica" onClick={handleScrollToTop}>Idraulica</Link></li>
            </ul>
          </div>
          <div>
            <h4>Azienda</h4>
            <ul>
              <li><Link to="/chi-siamo" onClick={handleScrollToTop}>Chi siamo</Link></li>
              <li><Link to="/contatti" onClick={handleScrollToTop}>Contatti</Link></li>
              <li><a href={`tel:+${TEL_RAW}`}>{TEL}</a></li>
            </ul>
          </div>
          <div>
            <h4>Contatti</h4>
            <p className="small">
              Via Casilina 2187, 00132 Roma
              <br />
              Sede legale: Via Colle Pallone Nuovo 26, Zagarolo (RM)
              <br />
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              <br />
              Ufficio: 06 86764589
            </p>
          </div>
        </div>
        <div className="fbot">
          <div>© 2026 Aleclima e Impianti S.r.l.s · P. IVA 15597681004</div>
          <div>Privacy · Cookie · Tutti i diritti riservati</div>
        </div>
      </div>
    </footer>
  );
};
