"use client";

import { useState, useTransition } from "react";
import { eliminaScript, salvaScript, salvaVerifiche, type DatiScript } from "@/app/admin/script/actions";
import type { Impostazioni, ScriptSito } from "@/lib/script-sito";

const POSIZIONE = {
  head: "Head (dentro <head>)",
  body: "Inizio body (subito dopo <body>)",
  footer: "Footer (prima di </body>)",
} as const;

const CATEGORIA = {
  necessari: "Necessari: sempre attivi",
  statistiche: "Statistiche: dopo il consenso (es. Analytics, Clarity)",
  marketing: "Marketing: dopo il consenso (es. Meta Pixel, Google Ads)",
} as const;

const VUOTO: DatiScript = { nome: "", posizione: "head", categoria: "statistiche", codice: "", attivo: true };

export function ScriptManager({ script, impostazioni }: { script: ScriptSito[]; impostazioni: Impostazioni }) {
  const [msg, setMsg] = useState<{ ok: boolean; testo: string } | null>(null);
  const [pending, start] = useTransition();
  const [modifica, setModifica] = useState<{ id: string | null; d: DatiScript } | null>(null);
  const [google, setGoogle] = useState(impostazioni.verifica_google ?? "");
  const [bing, setBing] = useState(impostazioni.verifica_bing ?? "");

  const esegui = (fn: () => Promise<{ ok: boolean; testo: string }>, poi?: () => void) =>
    start(async () => {
      const r = await fn();
      setMsg(r);
      if (r.ok) poi?.();
    });

  const set = <K extends keyof DatiScript>(k: K, v: DatiScript[K]) =>
    setModifica((m) => (m ? { ...m, d: { ...m.d, [k]: v } } : m));

  return (
    <>
      {msg && <div className={`admin-msg ${msg.ok ? "ok" : "err"}`} style={{ marginBottom: 14 }}>{msg.testo}</div>}

      <div className="admin-card admin-form" style={{ marginBottom: 22 }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Verifica proprietà del sito</h2>
        <div>
          <label htmlFor="v-google">Google Search Console</label>
          <input
            id="v-google"
            value={google}
            onChange={(e) => setGoogle(e.target.value)}
            placeholder='<meta name="google-site-verification" content="..."> oppure solo il codice'
          />
        </div>
        <div>
          <label htmlFor="v-bing">Bing Webmaster Tools</label>
          <input
            id="v-bing"
            value={bing}
            onChange={(e) => setBing(e.target.value)}
            placeholder='<meta name="msvalidate.01" content="..."> oppure solo il codice'
          />
        </div>
        <div className="admin-actions">
          <button className="btn btn-green" type="button" disabled={pending} onClick={() => esegui(() => salvaVerifiche(google, bing))}>
            Salva verifiche
          </button>
        </div>
      </div>

      <div className="admin-actions" style={{ marginBottom: 14 }}>
        <button className="btn btn-green" type="button" onClick={() => setModifica({ id: null, d: VUOTO })}>
          + Aggiungi script
        </button>
      </div>

      {modifica && (
        <div className="admin-card admin-form" style={{ marginBottom: 22 }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>{modifica.id ? "Modifica script" : "Nuovo script"}</h2>
          <div>
            <label htmlFor="s-nome">Nome</label>
            <input id="s-nome" value={modifica.d.nome} onChange={(e) => set("nome", e.target.value)} placeholder="Es. Google Analytics 4" />
          </div>
          <div>
            <label htmlFor="s-pos">Posizione</label>
            <select id="s-pos" value={modifica.d.posizione} onChange={(e) => set("posizione", e.target.value)}>
              {Object.entries(POSIZIONE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="s-cat">Categoria cookie</label>
            <select id="s-cat" value={modifica.d.categoria} onChange={(e) => set("categoria", e.target.value)}>
              {Object.entries(CATEGORIA).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <div className="hint">
              Per il GDPR, strumenti che tracciano i visitatori vanno in Statistiche o Marketing:
              partono solo se il visitatore li accetta nel banner cookie.
            </div>
          </div>
          <div>
            <label htmlFor="s-codice">Codice</label>
            <textarea
              id="s-codice"
              rows={10}
              spellCheck={false}
              style={{ fontFamily: "monospace", fontSize: 13 }}
              value={modifica.d.codice}
              onChange={(e) => set("codice", e.target.value)}
              placeholder="Incolla qui lo snippet completo, compresi i tag <script>"
            />
          </div>
          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="checkbox" checked={modifica.d.attivo} onChange={(e) => set("attivo", e.target.checked)} />
            Attivo
          </label>
          <div className="admin-actions">
            <button
              className="btn btn-green"
              type="button"
              disabled={pending}
              onClick={() => esegui(() => salvaScript(modifica.id, modifica.d), () => setModifica(null))}
            >
              {pending ? "Salvataggio…" : "Salva script"}
            </button>
            <button className="btn btn-ghost" type="button" onClick={() => setModifica(null)}>Annulla</button>
          </div>
        </div>
      )}

      {script.length === 0 ? (
        <div className="admin-card"><p>Nessuno script. Aggiungi Google Analytics, Clarity o altri strumenti.</p></div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Posizione</th>
              <th>Categoria</th>
              <th>Stato</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {script.map((s) => (
              <tr key={s.id}>
                <td><strong>{s.nome}</strong></td>
                <td>{s.posizione}</td>
                <td>{s.categoria}</td>
                <td>
                  <span className={`pill ${s.attivo ? "pubblicato" : "bozza"}`}>{s.attivo ? "attivo" : "spento"}</span>
                </td>
                <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                  <button type="button" className="link-btn" onClick={() => setModifica({ id: s.id, d: { ...s } })}>
                    Modifica
                  </button>{" "}
                  <button
                    type="button"
                    className="link-btn"
                    style={{ color: "#a12525" }}
                    disabled={pending}
                    onClick={() => {
                      if (window.confirm(`Eliminare lo script "${s.nome}"?`)) esegui(() => eliminaScript(s.id));
                    }}
                  >
                    Elimina
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
