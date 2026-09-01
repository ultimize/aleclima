"use client";

export interface FaqItem {
  domanda: string;
  risposta: string;
}

/**
 * Le FAQ non sono decorazione: generano il JSON-LD FAQPage, che e' il modo
 * piu' diretto per finire nei riquadri di Google e nelle risposte AI.
 */
export function FaqEditor({
  faq,
  onChange,
}: {
  faq: FaqItem[];
  onChange: (f: FaqItem[]) => void;
}) {
  const set = (i: number, patch: Partial<FaqItem>) =>
    onChange(faq.map((f, k) => (k === i ? { ...f, ...patch } : f)));

  const aggiungi = () => onChange([...faq, { domanda: "", risposta: "" }]);
  const rimuovi = (i: number) => onChange(faq.filter((_, k) => k !== i));
  const sposta = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= faq.length) return;
    const copia = [...faq];
    [copia[i], copia[j]] = [copia[j], copia[i]];
    onChange(copia);
  };

  return (
    <div className="faq-editor">
      <div className="faq-intro">
        <strong>Domande frequenti</strong>
        <p className="hint">
          Scrivi le domande come le farebbe un cliente a voce. Finiscono in fondo
          all&apos;articolo e come dati strutturati per Google.
        </p>
      </div>

      {faq.length === 0 && (
        <p className="hint">Nessuna domanda. Due o tre bastano per fare la differenza.</p>
      )}

      {faq.map((f, i) => (
        <div className="faq-riga" key={i}>
          <div className="faq-campi">
            <input
              type="text"
              placeholder="Es. Quanto dura l'installazione di un climatizzatore?"
              value={f.domanda}
              onChange={(e) => set(i, { domanda: e.target.value })}
            />
            <textarea
              rows={2}
              placeholder="Risposta breve e diretta, 2-3 righe."
              value={f.risposta}
              onChange={(e) => set(i, { risposta: e.target.value })}
            />
          </div>
          <div className="faq-azioni">
            <button type="button" onClick={() => sposta(i, -1)} disabled={i === 0} title="Sposta su">↑</button>
            <button type="button" onClick={() => sposta(i, 1)} disabled={i === faq.length - 1} title="Sposta giù">↓</button>
            <button type="button" onClick={() => rimuovi(i)} title="Elimina" className="faq-del">✕</button>
          </div>
        </div>
      ))}

      <button type="button" className="btn btn-ghost" onClick={aggiungi}>
        + Aggiungi domanda
      </button>
    </div>
  );
}
