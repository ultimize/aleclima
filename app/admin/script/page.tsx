import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { ScriptManager } from "@/components/admin/ScriptManager";
import type { Impostazioni, ScriptSito } from "@/lib/script-sito";

export const dynamic = "force-dynamic";

export default async function ScriptPage() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  const [{ data: script, error }, { data: imp }] = await Promise.all([
    sb.from("script_sito").select("id, nome, posizione, categoria, codice, attivo").order("created_at"),
    sb.from("impostazioni_sito").select("verifica_google, verifica_bing").eq("id", 1).maybeSingle(),
  ]);

  return (
    <AdminShell email={user?.email} titolo="Script del sito">
      {error ? (
        <div className="admin-msg err">Errore nel caricamento: {error.message}</div>
      ) : (
        <ScriptManager
          script={(script ?? []) as ScriptSito[]}
          impostazioni={(imp ?? { verifica_google: null, verifica_bing: null }) as Impostazioni}
        />
      )}
    </AdminShell>
  );
}
