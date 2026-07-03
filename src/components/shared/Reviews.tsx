import React, { useEffect } from "react";

const SCRIPT_SRC = "https://reputationhub.site/reputation/assets/review-widget.js";
const WIDGET_SRC =
  "https://reputationhub.site/reputation/widgets/review_widget/0xDsSoPWzkunXMmuAcVI?widgetId=6a47920a53a465f9ad6cbf98";

/**
 * Widget recensioni Reputation/HighLevel (LeadConnector).
 * L'iframe mostra le recensioni; lo script esterno ne gestisce l'auto-resize.
 * Lo script viene caricato una sola volta (idempotente).
 */
export const Reviews: React.FC = () => {
  useEffect(() => {
    if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;
    const s = document.createElement("script");
    s.type = "text/javascript";
    s.src = SCRIPT_SRC;
    s.async = true;
    document.body.appendChild(s);
  }, []);

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
