import { createClient } from "@/lib/supabase/server";
import { AdminBar } from "@/components/admin/AdminBar";
import { LeadTable, type Lead } from "@/components/admin/LeadTable";

export const dynamic = "force-dynamic";

export default async function LeadPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("lead_preventivi")
    .select(
      "id, created_at, nome, telefono, email, servizio, messaggio, fonte, stato, note_interne, hl_status, hl_contact_id, hl_error"
    )
    .order("created_at", { ascending: false });

  return (
    <>
      <AdminBar email={user?.email} />
      <div className="admin-main">
        <div className="wrap">
          <div className="admin-head">
            <h1>Richieste di preventivo</h1>
          </div>

          {error ? (
            <div className="admin-msg err">Errore nel caricamento: {error.message}</div>
          ) : (
            <LeadTable iniziali={(data ?? []) as Lead[]} />
          )}
        </div>
      </div>
    </>
  );
}
