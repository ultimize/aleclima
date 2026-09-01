import { getTraffico, durataLeggibile } from "@/lib/ga";
import { StatTile } from "./StatTile";

/**
 * Riquadro traffico in dashboard. Se Analytics non e' configurato non
 * scompare in silenzio: spiega cosa manca, altrimenti sembra rotto.
 */
export async function TrafficoCard() {
  const t = await getTraffico();

  if (!t) {
    return (
      <section className="card ga-setup">
        <div className="card-head">
          <h2>Traffico del sito</h2>
        </div>
        <p>
          Google Analytics non è ancora collegato a questa dashboard. Il tag sul sito
          funziona lo stesso: qui mancano solo le credenziali per rileggere i dati.
        </p>
        <p className="hint">
          Servono tre variabili d&apos;ambiente su Vercel — <code>GA_PROPERTY_ID</code>,{" "}
          <code>GA_CLIENT_EMAIL</code>, <code>GA_PRIVATE_KEY</code> — da un service
          account con ruolo Viewer sulla proprietà GA4.
        </p>
      </section>
    );
  }

  return (
    <>
      <div className="tiles">
        <StatTile
          etichetta="Visite, ultimi 30 giorni"
          valore={t.visite.toLocaleString("it-IT")}
          delta={t.deltaPercentuale}
          nota={t.deltaPercentuale === null ? "nessun confronto disponibile" : "rispetto ai 30 precedenti"}
        />
        <StatTile
          etichetta="Visitatori distinti"
          valore={t.utenti.toLocaleString("it-IT")}
          nota="persone, non sessioni"
        />
        <StatTile
          etichetta="Durata media visita"
          valore={durataLeggibile(t.durataMediaSec)}
          nota="quanto restano sul sito"
        />
      </div>

      <div className="due-colonne">
        <section className="card">
          <div className="card-head"><h2>Pagine più viste</h2></div>
          {t.pagine.length === 0 ? (
            <p className="vuoto">Ancora nessun dato.</p>
          ) : (
            <ul className="lista-secca">
              {t.pagine.map((p) => (
                <li key={p.percorso}>
                  <div>
                    <strong>{p.titolo || p.percorso}</strong>
                    <span className="sotto">{p.percorso}</span>
                  </div>
                  <div className="destra"><strong>{p.visualizzazioni.toLocaleString("it-IT")}</strong></div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card">
          <div className="card-head"><h2>Articoli più letti</h2></div>
          {t.articoli.length === 0 ? (
            <p className="vuoto">
              Nessun articolo ha ancora ricevuto visite. Normale finché il blog è nuovo:
              Google impiega qualche settimana a indicizzare.
            </p>
          ) : (
            <ul className="lista-secca">
              {t.articoli.map((p) => (
                <li key={p.percorso}>
                  <div>
                    <strong>{p.titolo || p.percorso}</strong>
                    <span className="sotto">{p.percorso}</span>
                  </div>
                  <div className="destra"><strong>{p.visualizzazioni.toLocaleString("it-IT")}</strong></div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
