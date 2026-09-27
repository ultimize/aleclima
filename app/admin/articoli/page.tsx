import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { formatData, isProgrammato } from "@/lib/blog";

export const dynamic = "force-dynamic";

export default async function ArticoliPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: articoli, error } = await supabase
    .from("articoli")
    .select("id, slug, titolo, stato, published_at, updated_at")
    .order("updated_at", { ascending: false });

  return (
    <AdminShell
      email={user?.email}
      titolo="Articoli del blog"
      azione={
        <Link className="btn btn-green" href="/admin/articoli/nuovo">
          + Nuovo articolo
        </Link>
      }
    >
      {error && <div className="admin-msg err">Errore nel caricamento: {error.message}</div>}

      {!error && (!articoli || articoli.length === 0) ? (
        <div className="card vuoto-grande">
          <h2>Non c&apos;è ancora nessun articolo</h2>
          <p>
            Il blog è pronto: manca solo il primo pezzo. Parti da una domanda che i
            clienti fanno spesso al telefono — quelle si posizionano da sole.
          </p>
          <Link className="btn btn-green" href="/admin/articoli/nuovo">
            Scrivi il primo articolo
          </Link>
        </div>
      ) : (
        <div className="card senza-padding">
          <table className="tabella">
            <thead>
              <tr>
                <th>Titolo</th>
                <th>Stato</th>
                <th>Pubblicato il</th>
                <th>Ultima modifica</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {(articoli ?? []).map((a) => (
                <tr key={a.id}>
                  <td>
                    <Link href={`/admin/articoli/${a.id}`} className="titolo-riga">{a.titolo}</Link>
                    <div className="sotto">/blog/{a.slug}</div>
                  </td>
                  <td>
                    <span className={`pill ${isProgrammato(a) ? "nuovo" : a.stato}`}>
                      {isProgrammato(a) ? "programmato" : a.stato === "pubblicato" ? "pubblicato" : "bozza"}
                    </span>
                  </td>
                  <td>{a.published_at ? formatData(a.published_at) : "—"}</td>
                  <td>{formatData(a.updated_at)}</td>
                  <td className="destra">
                    {a.stato === "pubblicato" && !isProgrammato(a) && (
                      <Link href={`/blog/${a.slug}`} target="_blank">Vedi ↗</Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
