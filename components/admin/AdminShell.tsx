"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { getSupabase } from "@/lib/supabase/browser";

const VOCI = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/articoli", label: "Articoli" },
  { href: "/admin/lead", label: "Richieste" },
];

export function AdminShell({
  email,
  titolo,
  azione,
  children,
}: {
  email?: string | null;
  titolo: string;
  azione?: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuAperto, setMenuAperto] = useState(false);

  const attiva = (v: (typeof VOCI)[number]) =>
    v.exact ? pathname === v.href : pathname.startsWith(v.href);

  const logout = async () => {
    await getSupabase().auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="ash">
      <aside className={`ash-side${menuAperto ? " aperto" : ""}`}>
        <Link href="/admin" className="ash-brand">
          {/* piastra bianca come nel footer del sito: il logo e' a colori e
              sul blu notte non si leggerebbe */}
          <span className="ash-logo">
            <Image
              src="/aleclima-logo.png"
              alt="Aleclima e Impianti"
              width={922}
              height={473}
              priority
            />
          </span>
          <small>Redazione</small>
        </Link>

        <nav className="ash-nav">
          {VOCI.map((v) => (
            <Link
              key={v.href}
              href={v.href}
              className={attiva(v) ? "on" : ""}
              onClick={() => setMenuAperto(false)}
            >
              {v.label}
            </Link>
          ))}
        </nav>

        <div className="ash-side-foot">
          <Link href="/" target="_blank" className="ash-esterno">
            Vedi il sito ↗
          </Link>
          {email && <div className="ash-email" title={email}>{email}</div>}
          <button type="button" onClick={logout}>Esci</button>
        </div>
      </aside>

      <div className="ash-main">
        <header className="ash-top">
          <button
            type="button"
            className="ash-burger"
            onClick={() => setMenuAperto((v) => !v)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
          <h1>{titolo}</h1>
          {azione && <div className="ash-azione">{azione}</div>}
        </header>

        <div className="ash-body">{children}</div>
      </div>

      {menuAperto && (
        <button
          type="button"
          className="ash-overlay"
          aria-label="Chiudi menu"
          onClick={() => setMenuAperto(false)}
        />
      )}
    </div>
  );
}
