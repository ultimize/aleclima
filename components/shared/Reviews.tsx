"use client";

import React, { useEffect, useState } from "react";
import { EVENTO_CONSENSO } from "./Clarity";

const SCRIPT_SRC = "https://reputationhub.site/reputation/assets/review-widget.js";
const WIDGET_SRC =
  "https://reputationhub.site/reputation/widgets/review_widget/0xDsSoPWzkunXMmuAcVI?widgetId=6a47920a53a465f9ad6cbf98";

function marketingConsentito(): boolean {
  try {
    return !!JSON.parse(localStorage.getItem("aleclima_cookie_consent") ?? "{}").marketing;
  } catch {
    return false;
  }
}

/**
 * Widget recensioni Reputation/HighLevel (LeadConnector).
 * E' contenuto di terza parte che puo' leggere IP e impostare cookie: si carica
 * solo con il consenso marketing, oppure se il visitatore lo chiede col pulsante.
 */
export const Reviews: React.FC = () => {
  const [attivo, setAttivo] = useState(false);

  useEffect(() => {
    const verifica = () => marketingConsentito() && setAttivo(true);
    verifica();
    window.addEventListener(EVENTO_CONSENSO, verifica);
    return () => window.removeEventListener(EVENTO_CONSENSO, verifica);
  }, []);

  useEffect(() => {
    if (!attivo || document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;
    const s = document.createElement("script");
    s.type = "text/javascript";
    s.src = SCRIPT_SRC;
    s.async = true;
    document.body.appendChild(s);
  }, [attivo]);

  if (!attivo) {
    return (
      <div className="rev-gate">
        <p>
          Le recensioni dei nostri clienti sono fornite da un servizio esterno (HighLevel) che può usare cookie.
          Vedi la <a href="/cookie-policy">Cookie Policy</a>.
        </p>
        <button className="btn btn-blue" onClick={() => setAttivo(true)}>
          Mostra le recensioni
        </button>
      </div>
    );
  }

  return (
    <iframe
      className="lc_reviews_widget"
      src={WIDGET_SRC}
      frameBorder="0"
      scrolling="no"
      style={{ minWidth: "100%", width: "100%" }}
      title="Recensioni dei clienti Aleclima"
    />
  );
};
