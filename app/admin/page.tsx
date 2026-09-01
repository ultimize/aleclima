import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AdminBar } from "@/components/admin/AdminBar";
import { formatData } from "@/lib/blog";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: articoli, error } = await supabase
    .from("articoli")
    .select("id, slug, titolo, stato, published_at, updated_at")
    .order("updated_at", { ascending: false });

  return (
    <>
      <AdminBar email={user?.email} />
      <div className="admin-main">
        <div className="wrap">
          <div className="admin-head">
            <h1>Articoli del blog</h1>
            <Link className="btn btn-green" href="/admin/articoli/nuovo">
              + Nuovo articolo
            </Link>
          </div>

          {error && <div className="admin-msg err">Errore nel caricamento: {error.message}</div>}

          {!error && (!articoli || articoli.length === 0) ? (
            <div className="admin-card">
              <p>Non c&apos;è ancora nessun articolo. Inizia con il primo.</p>
            </div>
          ) : (
            <table className="admin-table">
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
                      <Link href={`/admin/articoli/${a.id}`}>{a.titolo}</Link>
                      <div style={{ fontSize: 13, color: "var(--grigio)" }}>/blog/{a.slug}</div>
                    </td>
                    <td>
                      <span className={`badge ${a.stato}`}>
                        {a.stato === "pubblicato" ? "Pubblicato" : "Bozza"}
                      </span>
                    </td>
                    <td>{a.published_at ? formatData(a.published_at) : "—"}</td>
                    <td>{formatData(a.updated_at)}</td>
                    <td style={{ textAlign: "right" }}>
                      {a.stato === "pubblicato" && (
                        <Link href={`/blog/${a.slug}`} target="_blank">Vedi</Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
