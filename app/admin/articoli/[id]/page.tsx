import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { ArticoloForm } from "@/components/admin/ArticoloForm";
import { isProgrammato, type Articolo } from "@/lib/blog";

export const dynamic = "force-dynamic";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let articolo: Articolo | null = null;

  if (id !== "nuovo") {
    const { data } = await supabase.from("articoli").select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    articolo = data as Articolo;
  }

  return (
    <AdminShell
      email={user?.email}
      titolo={articolo ? "Modifica articolo" : "Nuovo articolo"}
      azione={
        articolo ? (
          <span className={`pill ${isProgrammato(articolo) ? "nuovo" : articolo.stato}`}>
            {isProgrammato(articolo) ? "programmato" : articolo.stato === "pubblicato" ? "pubblicato" : "bozza"}
          </span>
        ) : undefined
      }
    >
      <p className="torna">
        <Link href="/admin/articoli">← Tutti gli articoli</Link>
      </p>

      <ArticoloForm articolo={articolo} />
    </AdminShell>
  );
}
