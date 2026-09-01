"use client";

import { useState } from "react";

export interface PuntoMese {
  /** etichetta breve, es. "gen" */
  mese: string;
  /** etichetta estesa per il tooltip, es. "gennaio 2026" */
  meseEsteso: string;
  valore: number;
}

const HUE = "#1668C7";      // serie unica: un solo colore, nessuna legenda
const SUPERFICIE = "#ffffff";
const GRIGLIA = "#E2E9F2";
const INCHIOSTRO_TENUE = "#5A6B7B";

const W = 720;
const H = 220;
const PAD = { top: 18, right: 8, bottom: 28, left: 30 };

/** Tick arrotondati: 0, poi passi puliti fino sopra il massimo. */
function ticks(max: number): number[] {
  if (max <= 4) return [0, 1, 2, 3, 4].slice(0, Math.max(2, max + 1));
  const passo = Math.ceil(max / 4 / 5) * 5 || 1;
  const out: number[] = [];
  for (let v = 0; v <= max + passo - 1; v += passo) out.push(v);
  return out;
}

export function LeadChart({ dati }: { dati: PuntoMese[] }) {
  const [hover, setHover] = useState<number | null>(null);

  const max = Math.max(1, ...dati.map((d) => d.valore));
  const scala = ticks(max);
  const cima = scala[scala.length - 1];

  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const banda = plotW / dati.length;
  // barra sottile: mai riempire la banda, il resto e' aria
  const larghezza = Math.min(24, Math.max(8, banda - 10));

  const y = (v: number) => PAD.top + plotH - (v / cima) * plotH;

  const indiceMax = dati.reduce((b, d, i) => (d.valore > dati[b].valore ? i : b), 0);
  const ultimo = dati.length - 1;

  return (
    <figure className="chart">
      <figcaption>
        <strong>Richieste per mese</strong>
        <span>Ultimi {dati.length} mesi</span>
      </figcaption>

      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Richieste di preventivo per mese">
        {/* griglia sottile e arretrata */}
        {scala.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke={GRIGLIA} strokeWidth="1" />
            <text x={PAD.left - 7} y={y(t) + 4} textAnchor="end" fontSize="11" fill={INCHIOSTRO_TENUE}>
              {t}
            </text>
          </g>
        ))}

        {dati.map((d, i) => {
          const cx = PAD.left + banda * i + banda / 2;
          const x = cx - larghezza / 2;
          const altezza = d.valore === 0 ? 0 : Math.max(3, plotH - (plotH - (y(0) - y(d.valore))));
          const yBar = y(d.valore);
          const attivo = hover === i;
          // etichetta diretta solo sul massimo e sull'ultimo mese
          const etichettato = d.valore > 0 && (i === indiceMax || i === ultimo);

          return (
            <g key={d.mese + i}>
              {/* area di aggancio piu' larga della barra */}
              <rect
                x={PAD.left + banda * i}
                y={PAD.top}
                width={banda}
                height={plotH}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
              {d.valore > 0 && (
                <rect
                  x={x}
                  y={yBar}
                  width={larghezza}
                  height={Math.max(3, y(0) - yBar)}
                  rx="4"
                  fill={HUE}
                  opacity={hover === null || attivo ? 1 : 0.45}
                  pointerEvents="none"
                />
              )}
              {/* estremita' quadrata sulla linea di base */}
              {d.valore > 0 && (
                <rect x={x} y={y(0) - 4} width={larghezza} height="4" fill={HUE}
                      opacity={hover === null || attivo ? 1 : 0.45} pointerEvents="none" />
              )}
              {etichettato && !attivo && (
                <text x={cx} y={yBar - 7} textAnchor="middle" fontSize="12" fontWeight="600" fill={INCHIOSTRO_TENUE}>
                  {d.valore}
                </text>
              )}
              {attivo && (
                <>
                  <rect x={cx - 30} y={Math.max(0, yBar - 34)} width="60" height="24" rx="6"
                        fill="#0A2540" stroke={SUPERFICIE} strokeWidth="2" pointerEvents="none" />
                  <text x={cx} y={Math.max(0, yBar - 34) + 16} textAnchor="middle" fontSize="12"
                        fill="#fff" pointerEvents="none">
                    {d.valore} {d.valore === 1 ? "rich." : "rich."}
                  </text>
                </>
              )}
              <text x={cx} y={H - 8} textAnchor="middle" fontSize="11"
                    fill={INCHIOSTRO_TENUE} fontWeight={attivo ? 700 : 400}>
                {d.mese}
              </text>
            </g>
          );
        })}

        <line x1={PAD.left} x2={W - PAD.right} y1={y(0)} y2={y(0)} stroke={GRIGLIA} strokeWidth="1" />
      </svg>

      {hover !== null && (
        <p className="chart-legenda-hover">
          {dati[hover].meseEsteso}: <strong>{dati[hover].valore}</strong>{" "}
          {dati[hover].valore === 1 ? "richiesta" : "richieste"}
        </p>
      )}

      {/* i valori restano leggibili anche senza il grafico */}
      <details className="chart-tabella">
        <summary>Vedi i dati in tabella</summary>
        <table>
          <thead><tr><th>Mese</th><th>Richieste</th></tr></thead>
          <tbody>
            {dati.map((d, i) => (
              <tr key={i}><td>{d.meseEsteso}</td><td>{d.valore}</td></tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
