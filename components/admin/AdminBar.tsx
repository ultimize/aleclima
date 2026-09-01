"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase/browser";

export function AdminBar({ email }: { email?: string | null }) {
  const router = useRouter();

  const logout = async () => {
    await getSupabase().auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="admin-bar">
      <div className="wrap">
        <strong>Aleclima · Redazione</strong>
        <nav>
          <Link href="/admin">Articoli</Link>
          <Link href="/admin/lead">Richieste</Link>
          <Link href="/blog" target="_blank">Vedi il blog</Link>
          {email && <span style={{ color: "#7f97b3" }}>{email}</span>}
          <button onClick={logout} type="button">Esci</button>
        </nav>
      </div>
    </div>
  );
}
