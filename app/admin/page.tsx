import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatTile } from "@/components/admin/StatTile";
import { LeadChart, type PuntoMese } from "@/components/admin/LeadChart";
import { formatData } from "@/lib/blog";

export const dynamic = "force-dynamic";

const MESI = 12;

/** Conteggi per mese, ultimi 12 mesi, mesi vuoti inclusi. */
function perMese(date: string[]): PuntoMese[] {
  const oggi = new Date();
  const punti: PuntoMese[] = [];

  for (let i = MESI - 1; i >= 0; i--) {
    const d = new Date(oggi.getFullYear(), oggi.getMonth() - i, 1);
    const chiave = `${d.getFullYear()}-${d.getMonth()}`;
    const valore = date.filter((iso) => {
      const x = new Date(iso);
      return `${x.getFullYear()}-${x.getMonth()}` === chiave;
    }).length;

    punti.push({
      mese: d.toLocaleDateString("it-IT", { month: "short" }).replace(".", ""),
      meseEsteso: d.toLocaleDateString("it-IT", { month: "long", year: "numeric" }),
      valore,
    });
  }
  return punti;
}

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [leadRes, articoliRes] = await Promise.all([
    supabase
      .from("lead_preventivi")
      .select("id, created_at, nome, servizio, stato, hl_status")
      .order("created_at", { ascending: false }),
    supabase
      .from("articoli")
      .select("id, titolo, slug, stato, updated_at")
      .order("updated_at", { ascending: false }),
  ]);

  const lead = leadRes.data ?? [];
  const articoli = articoliRes.data ?? [];

  const ora = Date.now();
  const g30 = ora - 30 * 86400000;
  const g60 = ora - 60 * 86400000;

  const ultimi30 = lead.filter((l) => new Date(l.created_at).getTime() >= g30).length;
  const precedenti30 = lead.filter((l) => {
    const t = new Date(l.created_at).getTime();
    return t >= g60 && t < g30;
  }).length;

  const delta = precedenti30 === 0
    ? null
    : Math.round(((ultimi30 - precedenti30) / precedenti30) * 100);

  const daLavorare = lead.filter((l) => l.stato === "nuovo").length;
  const nonConsegnati = lead.filter((l) => l.hl_status === "error").length;
  const pubblicati = articoli.filter((a) => a.stato === "pubblicato").length;
  const bozze = articoli.filter((a) => a.stato === "bozza").length;

  const serie = perMese(lead.map((l) => l.created_at));

  return (
    <AdminShell
      email={user?.email}
      titolo="Dashboard"
      azione={
        <Link className="btn btn-green" href="/admin/articoli/nuovo">
          + Nuovo articolo
        </Link>
      }
    >
      {nonConsegnati > 0 && (
        <div className="avviso-grave">
          <strong>
            {nonConsegnati} {nonConsegnati === 1 ? "richiesta non è arrivata" : "richieste non sono arrivate"} su GoHighLevel.
          </strong>
          <Link href="/admin/lead">Vedi quali →</Link>
        </div>
      )}

      <div className="tiles">
        <StatTile
          etichetta="Richieste, ultimi 30 giorni"
          valore={ultimi30}
          delta={delta}
          nota={delta === null ? "nessun confronto disponibile" : "rispetto ai 30 precedenti"}
          href="/admin/lead"
        />
        <StatTile
          etichetta="Da ricontattare"
          valore={daLavorare}
          nota={daLavorare === 0 ? "tutto lavorato" : "ancora in stato «nuovo»"}
          tono={daLavorare > 0 ? "allarme" : "buono"}
          href="/admin/lead"
        />
        <StatTile
          etichetta="Articoli pubblicati"
          valore={pubblicati}
          nota={bozze > 0 ? `${bozze} ${bozze === 1 ? "bozza" : "bozze"} in lavorazione` : "nessuna bozza"}
          href="/admin/articoli"
        />
        <StatTile
          etichetta="Richieste totali"
          valore={lead.length}
          nota="da quando il sito è online"
          href="/admin/lead"
        />
      </div>

      <div className="card">
        <LeadChart dati={serie} />
      </div>

      <div className="due-colonne">
        <section className="card">
          <div className="card-head">
            <h2>Ultime richieste</h2>
            <Link href="/admin/lead">Tutte →</Link>
          </div>
          {lead.length === 0 ? (
            <p className="vuoto">Nessuna richiesta ancora.</p>
          ) : (
            <ul className="lista-secca">
              {lead.slice(0, 6).map((l) => (
                <li key={l.id}>
                  <div>
                    <strong>{l.nome}</strong>
                    <span className="sotto">{l.servizio}</span>
                  </div>
                  <div className="destra">
                    <span className={`pill ${l.stato}`}>{l.stato}</span>
                    <time>{formatData(l.created_at)}</time>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card">
          <div className="card-head">
            <h2>Ultimi articoli</h2>
            <Link href="/admin/articoli">Tutti →</Link>
          </div>
          {articoli.length === 0 ? (
            <p className="vuoto">
              Nessun articolo. <Link href="/admin/articoli/nuovo">Scrivi il primo →</Link>
            </p>
          ) : (
            <ul className="lista-secca">
              {articoli.slice(0, 6).map((a) => (
                <li key={a.id}>
                  <div>
                    <Link href={`/admin/articoli/${a.id}`}><strong>{a.titolo}</strong></Link>
                    <span className="sotto">/blog/{a.slug}</span>
                  </div>
                  <div className="destra">
                    <span className={`pill ${a.stato}`}>
                      {a.stato === "pubblicato" ? "pubblicato" : "bozza"}
                    </span>
                    <time>{formatData(a.updated_at)}</time>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
