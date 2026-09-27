"use client";

import { useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabase/browser";

export interface Lead {
  id: string;
  created_at: string;
  nome: string;
  telefono: string;
  email: string;
  servizio: string;
  messaggio: string | null;
  fonte: string;
  stato: "nuovo" | "contattato" | "chiuso";
  note_interne: string | null;
  hl_status: string | null;
  hl_contact_id: string | null;
  hl_error: string | null;
}

const STATI = ["nuovo", "contattato", "chiuso"] as const;

const PERIODI = [
  { id: "tutti", label: "Sempre", giorni: 0 },
  { id: "7", label: "Ultimi 7 giorni", giorni: 7 },
  { id: "30", label: "Ultimi 30 giorni", giorni: 30 },
  { id: "90", label: "Ultimi 3 mesi", giorni: 90 },
];

function dataOra(iso: string) {
  return new Date(iso).toLocaleString("it-IT", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

/** Il lead è arrivato su GoHighLevel? null = precedente all'introduzione del tracciamento. */
function consegna(l: Lead): { testo: string; classe: string } {
  if (l.hl_status === "ok") return { testo: "Consegnato", classe: "ok" };
  if (l.hl_status === "error") return { testo: "NON consegnato", classe: "ko" };
  if (l.hl_status === "pending") return { testo: "In corso…", classe: "warn" };
  return { testo: "—", classe: "muted" };
}

function csvEscape(v: unknown): string {
  const s = v == null ? "" : String(v);
  return `"${s.replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
}

export function LeadTable({ iniziali }: { iniziali: Lead[] }) {
  const [lead, setLead] = useState<Lead[]>(iniziali);
  const [q, setQ] = useState("");
  const [servizio, setServizio] = useState("tutti");
  const [stato, setStato] = useState("tutti");
  const [periodo, setPeriodo] = useState("tutti");
  const [aperto, setAperto] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const servizi = useMemo(
    () => Array.from(new Set(iniziali.map((l) => l.servizio))).sort(),
    [iniziali]
  );

  const filtrati = useMemo(() => {
    const giorni = PERIODI.find((p) => p.id === periodo)?.giorni ?? 0;
    const limite = giorni ? Date.now() - giorni * 86400000 : 0;
    const testo = q.trim().toLowerCase();

    return lead.filter((l) => {
      if (giorni && new Date(l.created_at).getTime() < limite) return false;
      if (servizio !== "tutti" && l.servizio !== servizio) return false;
      if (stato !== "tutti" && l.stato !== stato) return false;
      if (testo) {
        const blob = `${l.nome} ${l.email} ${l.telefono} ${l.messaggio ?? ""}`.toLowerCase();
        if (!blob.includes(testo)) return false;
      }
      return true;
    });
  }, [lead, q, servizio, stato, periodo]);

  const nonConsegnati = lead.filter((l) => l.hl_status === "error").length;

  const aggiorna = async (id: string, patch: Partial<Lead>) => {
    setLead((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
    const { error } = await getSupabase().from("lead_preventivi").update(patch).eq("id", id);
    if (error) {
      setMsg(`Salvataggio non riuscito: ${error.message}`);
      setLead(iniziali);
    } else {
      setMsg(null);
    }
  };

  const elimina = async (l: Lead) => {
    if (!window.confirm(`Eliminare definitivamente la richiesta di ${l.nome}? Non si può annullare.`)) return;
    // .select(): se la RLS blocca il DELETE non c'e' errore, solo 0 righe cancellate
    const { data, error } = await getSupabase().from("lead_preventivi").delete().eq("id", l.id).select("id");
    if (error || !data?.length) {
      setMsg(`Eliminazione non riuscita: ${error?.message ?? "permesso negato dal database"}`);
      return;
    }
    setLead((prev) => prev.filter((x) => x.id !== l.id));
    setAperto(null);
    setMsg(null);
  };

  const esportaCsv = () => {
    const intestazioni = [
      "Data", "Nome", "Telefono", "Email", "Servizio", "Messaggio",
      "Stato", "Note interne", "Consegna GoHighLevel", "ID contatto",
    ];
    const righe = filtrati.map((l) =>
      [
        dataOra(l.created_at), l.nome, l.telefono, l.email, l.servizio,
        l.messaggio, l.stato, l.note_interne, consegna(l).testo, l.hl_contact_id,
      ].map(csvEscape).join(",")
    );
    // BOM: senza, Excel in italiano sbaglia gli accenti
    const csv = "﻿" + [intestazioni.map(csvEscape).join(","), ...righe].join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `lead-aleclima-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {nonConsegnati > 0 && (
        <div className="admin-msg err" style={{ marginBottom: 18 }}>
          <strong>{nonConsegnati} {nonConsegnati === 1 ? "richiesta non è arrivata" : "richieste non sono arrivate"} su GoHighLevel.</strong>{" "}
          Sono segnate in rosso qui sotto: vanno inserite a mano nel CRM.
        </div>
      )}

      <div className="lead-filtri">
        <input
          type="text"
          placeholder="Cerca per nome, email, telefono o testo…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select value={servizio} onChange={(e) => setServizio(e.target.value)}>
          <option value="tutti">Tutti i servizi</option>
          {servizi.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={stato} onChange={(e) => setStato(e.target.value)}>
          <option value="tutti">Tutti gli stati</option>
          {STATI.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
          {PERIODI.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>
        <button type="button" className="btn btn-ghost" onClick={esportaCsv} disabled={filtrati.length === 0}>
          Esporta CSV ({filtrati.length})
        </button>
      </div>

      {msg && <div className="admin-msg err" style={{ marginBottom: 14 }}>{msg}</div>}

      {filtrati.length === 0 ? (
        <div className="admin-card"><p>Nessuna richiesta con questi filtri.</p></div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Chi</th>
              <th>Servizio</th>
              <th>Stato</th>
              <th>Consegna</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtrati.map((l) => {
              const c = consegna(l);
              const espanso = aperto === l.id;
              return (
                <tr key={l.id} className={c.classe === "ko" ? "riga-ko" : undefined}>
                  <td style={{ whiteSpace: "nowrap" }}>{dataOra(l.created_at)}</td>
                  <td>
                    <strong>{l.nome}</strong>
                    <div style={{ fontSize: 13 }}>
                      <a href={`tel:${l.telefono}`}>{l.telefono}</a>
                      {" · "}
                      <a href={`mailto:${l.email}`}>{l.email}</a>
                    </div>
                    {espanso && (
                      <div className="lead-dettaglio">
                        <p><em>{l.messaggio || "Nessun messaggio."}</em></p>
                        <label htmlFor={`note-${l.id}`}>Note interne</label>
                        <textarea
                          id={`note-${l.id}`}
                          rows={2}
                          defaultValue={l.note_interne ?? ""}
                          onBlur={(e) => {
                            if (e.target.value !== (l.note_interne ?? "")) {
                              aggiorna(l.id, { note_interne: e.target.value || null });
                            }
                          }}
                        />
                        {l.hl_error && (
                          <p className="lead-errore">Errore consegna: {l.hl_error}</p>
                        )}
                        <button
                          type="button"
                          className="link-btn"
                          style={{ color: "#a12525", marginTop: 10 }}
                          onClick={() => elimina(l)}
                        >
                          Elimina richiesta
                        </button>
                      </div>
                    )}
                  </td>
                  <td>{l.servizio}</td>
                  <td>
                    <select
                      value={l.stato}
                      onChange={(e) => aggiorna(l.id, { stato: e.target.value as Lead["stato"] })}
                      className={`stato-sel ${l.stato}`}
                    >
                      {STATI.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td><span className={`consegna ${c.classe}`}>{c.testo}</span></td>
                  <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    <button type="button" className="link-btn" onClick={() => setAperto(espanso ? null : l.id)}>
                      {espanso ? "Chiudi" : "Dettagli"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
}
