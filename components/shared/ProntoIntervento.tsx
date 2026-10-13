"use client";

import React, { useRef } from "react";
import { I } from "./Icons";
import { WA } from "./Band";

// ponytail: wa.me non allega file, foto/video li invia il cliente nella chat aperta
const CAMPI: [name: string, label: string][] = [
  ["nome", "Nome e cognome"],
  ["tel", "Numero di telefono"],
  ["indirizzo", "Indirizzo completo, Comune e CAP"],
];

export const ProntoIntervento: React.FC<{ className?: string }> = ({ className = "btn btn-red" }) => {
  const dlg = useRef<HTMLDialogElement>(null);

  const invia = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const riga = (label: string, k: string) => `*${label}:* ${String(d.get(k) || "-").trim()}`;
    const testo = [
      "🚨 *Richiesta di pronto intervento*",
      "",
      riga("Nome e cognome", "nome"),
      riga("Telefono", "tel"),
      riga("Indirizzo", "indirizzo"),
      riga("Tipo di problema", "tipo"),
      riga("Descrizione", "descrizione"),
      riga("Marca/modello/codice errore", "marca"),
      "",
      "Vi invio qui foto o video del problema, se disponibili.",
    ].join("\n");
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(testo)}`, "_blank", "noopener");
    dlg.current?.close();
  };

  return (
    <>
      <button type="button" className={className} onClick={() => dlg.current?.showModal()}>
        {I.bolt} Pronto intervento
      </button>

      <dialog
        ref={dlg}
        className="pi-dialog"
        aria-labelledby="pi-title"
        onClick={(e) => e.target === dlg.current && dlg.current.close()}
      >
        <form className="form" onSubmit={invia}>
          <button type="button" className="cc-close" aria-label="Chiudi" onClick={() => dlg.current?.close()}>
            ×
          </button>
          <h3 id="pi-title">Hai bisogno di un pronto intervento?</h3>
          <p className="fsub">
            Lasciaci queste informazioni: con questi dati possiamo verificare disponibilità e organizzare
            l&apos;intervento.
          </p>

          {CAMPI.map(([name, label]) => (
            <div className="field" key={name}>
              <label htmlFor={`pi-${name}`}>
                {label} <span className="req">*</span>
              </label>
              <input id={`pi-${name}`} name={name} required type={name === "tel" ? "tel" : "text"} />
            </div>
          ))}

          <div className="field">
            <label htmlFor="pi-tipo">
              Tipo di problema <span className="req">*</span>
            </label>
            <select id="pi-tipo" name="tipo" required defaultValue="">
              <option value="" disabled>Seleziona…</option>
              <option>Caldaia</option>
              <option>Climatizzatore</option>
              <option>Impianto idraulico</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="pi-descrizione">
              Breve descrizione del guasto e da quando si presenta <span className="req">*</span>
            </label>
            <textarea id="pi-descrizione" name="descrizione" required />
          </div>

          <div className="field">
            <label htmlFor="pi-marca">Marca, modello ed eventuale codice di errore</label>
            <input id="pi-marca" name="marca" />
          </div>

          <p className="fsub">📷 Foto o breve video del problema? Potrai inviarli direttamente nella chat WhatsApp.</p>

          <button className="btn btn-wa" type="submit">
            {I.wa} Invia su WhatsApp
          </button>
        </form>
      </dialog>
    </>
  );
};
