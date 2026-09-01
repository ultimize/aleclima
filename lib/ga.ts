import "server-only";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

/**
 * Lettura dei dati di traffico da Google Analytics 4 (Data API).
 *
 * Serve un service account con ruolo Viewer sulla proprieta' GA4:
 *   GA_PROPERTY_ID       id numerico della proprieta' (non il G-XXXX)
 *   GA_CLIENT_EMAIL      email del service account
 *   GA_PRIVATE_KEY       chiave privata (i \n vanno lasciati come \n)
 *
 * Se manca la configurazione la funzione torna null e la dashboard mostra
 * un riquadro con le istruzioni: non deve mai rompere la pagina.
 */

export interface Pagina {
  percorso: string;
  titolo: string;
  visualizzazioni: number;
}

export interface Traffico {
  visite: number;
  utenti: number;
  visitePrecedenti: number;
  deltaPercentuale: number | null;
  durataMediaSec: number;
  pagine: Pagina[];
  articoli: Pagina[];
}

let client: BetaAnalyticsDataClient | null | undefined;

function getClient(): BetaAnalyticsDataClient | null {
  if (client !== undefined) return client;

  const email = process.env.GA_CLIENT_EMAIL;
  const key = process.env.GA_PRIVATE_KEY;
  const property = process.env.GA_PROPERTY_ID;

  if (!email || !key || !property) {
    client = null;
    return client;
  }

  client = new BetaAnalyticsDataClient({
    credentials: {
      client_email: email,
      // su Vercel la chiave si incolla in una riga sola: qui i \n tornano veri
      private_key: key.replace(/\\n/g, "\n"),
    },
  });
  return client;
}

const n = (v: string | null | undefined) => Number(v ?? 0);

export async function getTraffico(): Promise<Traffico | null> {
  const c = getClient();
  const property = process.env.GA_PROPERTY_ID;
  if (!c || !property) return null;

  try {
    const [totali, pagineRes] = await Promise.all([
      c.runReport({
        property: `properties/${property}`,
        // due periodi affiancati: cosi' la variazione la calcola GA, non noi
        dateRanges: [
          { startDate: "30daysAgo", endDate: "today", name: "corrente" },
          { startDate: "60daysAgo", endDate: "31daysAgo", name: "precedente" },
        ],
        metrics: [
          { name: "sessions" },
          { name: "totalUsers" },
          { name: "averageSessionDuration" },
        ],
      }),
      c.runReport({
        property: `properties/${property}`,
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 40,
      }),
    ]);

    const righe = totali[0].rows ?? [];
    const corrente = righe.find((r) => r.dimensionValues?.[0]?.value === "corrente") ?? righe[0];
    const precedente = righe.find((r) => r.dimensionValues?.[0]?.value === "precedente") ?? righe[1];

    const visite = n(corrente?.metricValues?.[0]?.value);
    const utenti = n(corrente?.metricValues?.[1]?.value);
    const durata = n(corrente?.metricValues?.[2]?.value);
    const visitePrecedenti = n(precedente?.metricValues?.[0]?.value);

    const tutte: Pagina[] = (pagineRes[0].rows ?? []).map((r) => ({
      percorso: r.dimensionValues?.[0]?.value ?? "",
      titolo: (r.dimensionValues?.[1]?.value ?? "").split("—")[0].trim(),
      visualizzazioni: n(r.metricValues?.[0]?.value),
    }));

    return {
      visite,
      utenti,
      visitePrecedenti,
      deltaPercentuale:
        visitePrecedenti === 0
          ? null
          : Math.round(((visite - visitePrecedenti) / visitePrecedenti) * 100),
      durataMediaSec: Math.round(durata),
      pagine: tutte.filter((p) => !p.percorso.startsWith("/blog/")).slice(0, 5),
      articoli: tutte.filter((p) => p.percorso.startsWith("/blog/")).slice(0, 5),
    };
  } catch (e) {
    console.error("[ga] lettura fallita:", (e as Error).message);
    return null;
  }
}

export function durataLeggibile(sec: number): string {
  if (!sec) return "—";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m ? `${m}m ${s}s` : `${s}s`;
}
