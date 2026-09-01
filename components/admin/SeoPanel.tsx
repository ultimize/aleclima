"use client";

import { useMemo } from "react";
import { analizza, punteggio, linkInterniMancanti, titoloEffettivo, type DatiArticolo } from "@/lib/seo";

const SITE = "www.aleclima.eu";

export function SeoPanel({ dati }: { dati: DatiArticolo }) {
  const controlli = useMemo(() => analizza(dati), [dati]);
  const score = punteggio(controlli);
  const mancanti = useMemo(() => linkInterniMancanti(dati.contenutoHtml), [dati.contenutoHtml]);

  const titleAnteprima = titoloEffettivo(dati.titolo || "Titolo dell'articolo", dati.metaTitle).slice(0, 60);
  const descAnteprima = (dati.metaDescription || dati.sommario || "").slice(0, 155);

  const livello = score >= 80 ? "buono" : score >= 55 ? "medio" : "scarso";

  return (
    <div className="seo-panel">
      <div className="seo-head">
        <h3>Controllo SEO</h3>
        <span className={`seo-score ${livello}`}>{score}/100</span>
      </div>

      <div className="serp">
        <div className="serp-url">{SITE} › blog › {dati.slug || "…"}</div>
        <div className="serp-title">{titleAnteprima}</div>
        <div className="serp-desc">
          {descAnteprima || "Nessuna descrizione: Google ne estrarrà una dal testo."}
        </div>
      </div>

      <ul className="seo-lista">
        {controlli.map((c) => (
          <li key={c.id} className={c.esito}>
            <span className="seo-pallino" aria-hidden="true" />
            <div>
              <strong>{c.etichetta}</strong>
              <p>{c.dettaglio}</p>
            </div>
          </li>
        ))}
      </ul>

      {mancanti.length > 0 && (
        <div className="seo-suggerimenti">
          <strong>Link interni da aggiungere</strong>
          <p>
            L&apos;articolo parla di questi argomenti ma non ci porta. Seleziona la parola nel
            testo e usa il pulsante Link della barra dell&apos;editor:
          </p>
          <ul>
            {mancanti.map((m) => (
              <li key={m.href}>
                <code>{m.href}</code> — hai scritto &ldquo;{m.termine}&rdquo;, collega a{" "}
                <strong>{m.nome}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
