import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminBar } from "@/components/admin/AdminBar";
import { ArticoloForm } from "@/components/admin/ArticoloForm";
import type { Articolo } from "@/lib/blog";

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
    <>
      <AdminBar email={user?.email} />
      <div className="admin-main">
        <div className="wrap">
          <div className="admin-head">
            <div>
              <Link href="/admin" style={{ fontSize: 14, color: "var(--blu)", textDecoration: "none" }}>
                ← Tutti gli articoli
              </Link>
              <h1>{articolo ? "Modifica articolo" : "Nuovo articolo"}</h1>
            </div>
            {articolo && (
              <span className={`badge ${articolo.stato}`}>
                {articolo.stato === "pubblicato" ? "Pubblicato" : "Bozza"}
              </span>
            )}
          </div>

          <ArticoloForm articolo={articolo} />
        </div>
      </div>
    </>
  );
}
