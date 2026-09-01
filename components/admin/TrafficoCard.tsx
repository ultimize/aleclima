import { createClient } from "@/lib/supabase/server";
import { StatTile } from "./StatTile";

interface Riga { percorso: string; referrer_host: string | null; dispositivo: string | null; created_at: string }

function conta(righe: Riga[], chiave: (r: Riga) => string | null, limite = 5) {
  const m = new Map<string, number>();
  for (const r of righe) {
    const k = chiave(r);
    if (!k) continue;
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, limite);
}

/**
 * Traffico del sito, letto dalle analytics interne (tabella visite).
 * Stessa connessione Supabase del resto della dashboard: niente credenziali
 * aggiuntive, niente servizi esterni.
 */
export async function TrafficoCard() {
  const supabase = await createClient();

  const da = new Date(Date.now() - 60 * 86400000).toISOString();
  const { data, error } = await supabase
    .from("visite")
    .select("percorso, referrer_host, dispositivo, created_at")
    .gte("created_at", da)
    .order("created_at", { ascending: false })
    .limit(50000);

  if (error) {
    return (
      <section className="card">
        <div className="card-head"><h2>Traffico del sito</h2></div>
        <p className="vuoto">Errore nella lettura: {error.message}</p>
      </section>
    );
  }

  const righe = (data ?? []) as Riga[];
  const soglia30 = Date.now() - 30 * 86400000;

  const ultimi30 = righe.filter((r) => new Date(r.created_at).getTime() >= soglia30);
  const precedenti30 = righe.filter((r) => new Date(r.created_at).getTime() < soglia30);

  const delta = precedenti30.length === 0
    ? null
    : Math.round(((ultimi30.length - precedenti30.length) / precedenti30.length) * 100);

  const pagine = conta(ultimi30.filter((r) => !r.percorso.startsWith("/blog/")), (r) => r.percorso);
  const articoli = conta(ultimi30.filter((r) => r.percorso.startsWith("/blog/")), (r) => r.percorso);
  const provenienze = conta(ultimi30, (r) => r.referrer_host);
  const daMobile = ultimi30.filter((r) => r.dispositivo === "mobile").length;
  const quotaMobile = ultimi30.length ? Math.round((daMobile / ultimi30.length) * 100) : 0;

  if (righe.length === 0) {
    return (
      <section className="card">
        <div className="card-head"><h2>Traffico del sito</h2></div>
        <p className="vuoto">
          Nessuna visita registrata finora. Il conteggio parte dal momento in cui questa
          versione del sito va online.
        </p>
      </section>
    );
  }

  return (
    <>
      <div className="tiles">
        <StatTile
          etichetta="Pagine viste, ultimi 30 giorni"
          valore={ultimi30.length.toLocaleString("it-IT")}
          delta={delta}
          nota={delta === null ? "nessun confronto disponibile" : "rispetto ai 30 precedenti"}
        />
        <StatTile
          etichetta="Da telefono"
          valore={`${quotaMobile}%`}
          nota="delle pagine viste"
        />
        <StatTile
          etichetta="Articoli letti"
          valore={ultimi30.filter((r) => r.percorso.startsWith("/blog/")).length.toLocaleString("it-IT")}
          nota="pagine del blog"
        />
      </div>

      <div className="due-colonne">
        <section className="card">
          <div className="card-head"><h2>Pagine più viste</h2></div>
          <ul className="lista-secca">
            {pagine.map(([p, n]) => (
              <li key={p}>
                <div><strong>{p === "/" ? "Home" : p}</strong></div>
                <div className="destra"><strong>{n.toLocaleString("it-IT")}</strong></div>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <div className="card-head"><h2>Articoli più letti</h2></div>
          {articoli.length === 0 ? (
            <p className="vuoto">
              Nessun articolo ancora letto. Normale finché il blog è nuovo: Google
              impiega qualche settimana a indicizzare.
            </p>
          ) : (
            <ul className="lista-secca">
              {articoli.map(([p, n]) => (
                <li key={p}>
                  <div><strong>{p.replace("/blog/", "")}</strong><span className="sotto">{p}</span></div>
                  <div className="destra"><strong>{n.toLocaleString("it-IT")}</strong></div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {provenienze.length > 0 && (
        <section className="card">
          <div className="card-head"><h2>Da dove arrivano</h2></div>
          <ul className="lista-secca">
            {provenienze.map(([h, n]) => (
              <li key={h}>
                <div><strong>{h}</strong></div>
                <div className="destra"><strong>{n.toLocaleString("it-IT")}</strong></div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
