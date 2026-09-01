import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
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
    <AdminShell email={user?.email} titolo="Richieste di preventivo">
      {error ? (
        <div className="admin-msg err">Errore nel caricamento: {error.message}</div>
      ) : (
        <LeadTable iniziali={(data ?? []) as Lead[]} />
      )}
    </AdminShell>
  );
}
