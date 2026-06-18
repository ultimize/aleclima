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
              <a href="https://instagram.com/aleclimaeimpianti" target="_blank" rel="noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" stroke="none"/></svg>
              </a>
              <a href="https://facebook.com/share/1GqSGc1ccW/" target="_blank" rel="noreferrer" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.78-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z"/></svg>
              </a>
              <a href="https://tiktok.com/@aleclimaeimpianti" target="_blank" rel="noreferrer" aria-label="TikTok">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 0 1-2.59-2.59c0-1.42 1.16-2.59 2.59-2.59.27 0 .53.04.77.12v-3.16a5.7 5.7 0 0 0-.77-.05A5.75 5.75 0 0 0 4.1 15.4a5.75 5.75 0 0 0 5.75 5.75 5.75 5.75 0 0 0 5.75-5.75V9.01a7.36 7.36 0 0 0 4.3 1.38V7.3a4.28 4.28 0 0 1-3.3-1.48Z"/></svg>
              </a>
              <a href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.78a9.87 9.87 0 0 1-5.04-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.89-9.88 9.89Z"/></svg>
              </a>
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
          <div>
            <button className="cc-prefs-link" onClick={() => window.dispatchEvent(new Event('aleclima:cookie'))}>Preferenze cookie</button>
            {" · "}<a href="/privacy-policy">Privacy</a>{" · "}<a href="/cookie-policy">Cookie</a>{" · Tutti i diritti riservati"}
          </div>
        </div>
      </div>
    </footer>
  );
};
