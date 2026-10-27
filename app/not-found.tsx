import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WA } from "@/components/shared/Band";

export const metadata: Metadata = {
  title: { absolute: "Pagina non trovata — Aleclima e Impianti" },
  robots: { index: false },
};

// ponytail: fuori dal route group (site) il layout del sito non c'e', quindi header e footer li montiamo qui
export default function NotFound() {
  return (
    <div className="al-root">
      <Header />
      <main>
        <section className="phead nf">
          <div className="wrap">
            <div className="kick">Errore 404</div>
            <div className="nf-code">404</div>
            <h1>Questa pagina è andata in blackout</h1>
            <p>
              Il link potrebbe essere vecchio o la pagina è stata spostata. Nessun problema: ripristiniamo la corrente da qui.
            </p>
            <div className="nf-cta">
              <Link className="btn btn-green" href="/">Torna alla home</Link>
              <Link className="btn btn-ghost nf-ghost" href="/contatti">Richiedi un preventivo</Link>
              <a className="btn btn-wa" href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer">Scrivici su WhatsApp</a>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="wrap nf-links">
            <Link href="/climatizzazione">Climatizzazione</Link>
            <Link href="/fotovoltaico">Fotovoltaico</Link>
            <Link href="/caldaie-idraulica">Caldaie e idraulica</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/chi-siamo">Chi siamo</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
