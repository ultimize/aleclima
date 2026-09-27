"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
import { getSupabase } from "@/lib/supabase/browser";
import { RichEditor, uploadImmagine } from "./RichEditor";
import { SeoPanel } from "./SeoPanel";
import { FaqEditor } from "./FaqEditor";
import { isProgrammato, type Articolo, type FaqItem } from "@/lib/blog";

/** Titolo -> slug: minuscolo, senza accenti, parole separate da trattino. */
export function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

type Bozza = Partial<Articolo> & { titolo: string; slug: string };

function dataLeggibile(iso: string): string {
  return new Date(iso).toLocaleString("it-IT", { dateStyle: "full", timeStyle: "short" });
}

/** ISO -> valore per <input type="datetime-local"> nell'ora locale del browser. */
function toLocalInput(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

export function ArticoloForm({ articolo }: { articolo: Articolo | null }) {
  const router = useRouter();
  const isNuovo = !articolo;

  const [f, setF] = useState<Bozza>({
    titolo: articolo?.titolo ?? "",
    slug: articolo?.slug ?? "",
    sommario: articolo?.sommario ?? "",
    contenuto_html: articolo?.contenuto_html ?? "",
    cover_url: articolo?.cover_url ?? "",
    cover_alt: articolo?.cover_alt ?? "",
    meta_title: articolo?.meta_title ?? "",
    meta_description: articolo?.meta_description ?? "",
    keyword: articolo?.keyword ?? "",
    faq: articolo?.faq ?? [],
    stato: articolo?.stato ?? "bozza",
  });

  // programmazione: stato "pubblicato" + published_at futura (vedi isProgrammato)
  const [programmatoIl, setProgrammatoIl] = useState<string | null>(
    articolo && isProgrammato(articolo) ? articolo.published_at : null
  );
  const [apriProgramma, setApriProgramma] = useState(false);
  const [quando, setQuando] = useState(() => {
    if (programmatoIl) return toLocalInput(programmatoIl);
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(9, 0, 0, 0);
    return toLocalInput(d.toISOString());
  });

  const [msg, setMsg] = useState<{ tipo: "ok" | "err"; testo: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [slugToccato, setSlugToccato] = useState(!isNuovo);

  const set = <K extends keyof Bozza>(k: K, v: Bozza[K]) => setF((p) => ({ ...p, [k]: v }));

  const onTitolo = (v: string) => {
    setF((p) => ({ ...p, titolo: v, slug: slugToccato ? p.slug : slugify(v) }));
  };

  const onCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImmagine(file);
      set("cover_url", url);
    } catch (err) {
      setMsg({ tipo: "err", testo: `Caricamento cover non riuscito: ${(err as Error).message}` });
    } finally {
      e.target.value = "";
    }
  };

  /** dataIso presente = programma l'uscita a quella data. */
  const salva = async (stato: "bozza" | "pubblicato", dataIso?: string) => {
    setMsg(null);

    if (!f.titolo.trim()) return setMsg({ tipo: "err", testo: "Il titolo è obbligatorio." });
    const slug = (f.slug || slugify(f.titolo)).trim();
    if (!slug) return setMsg({ tipo: "err", testo: "Lo slug è obbligatorio." });
    if (stato === "pubblicato" && !f.contenuto_html?.replace(/<[^>]*>/g, "").trim()) {
      return setMsg({ tipo: "err", testo: "Non puoi pubblicare un articolo vuoto." });
    }
    if (dataIso && new Date(dataIso) <= new Date()) {
      return setMsg({ tipo: "err", testo: "Scegli una data e un'ora nel futuro." });
    }

    setSaving(true);

    const payload = {
      titolo: f.titolo.trim(),
      slug,
      sommario: f.sommario?.trim() || null,
      contenuto_html: f.contenuto_html ?? "",
      cover_url: f.cover_url || null,
      cover_alt: f.cover_alt?.trim() || null,
      meta_title: f.meta_title?.trim() || null,
      meta_description: f.meta_description?.trim() || null,
      keyword: f.keyword?.trim() || null,
      // scarta le righe lasciate a meta'
      faq: (f.faq ?? []).filter((q) => q.domanda.trim() && q.risposta.trim()),
      stato,
      // la bozza non tocca la data; "Pubblica" tiene quella originale se l'articolo
      // era gia' uscito, altrimenti (nuovo o programmato) esce adesso
      ...(stato === "pubblicato" && {
        published_at:
          dataIso ??
          (articolo?.published_at && !programmatoIl ? articolo.published_at : new Date().toISOString()),
      }),
    };

    const res = isNuovo
      ? await getSupabase().from("articoli").insert(payload).select("id").single()
      : await getSupabase().from("articoli").update(payload).eq("id", articolo!.id).select("id").single();

    setSaving(false);

    if (res.error) {
      const dup = res.error.code === "23505";
      setMsg({
        tipo: "err",
        testo: dup
          ? "Esiste già un articolo con questo slug: cambialo."
          : `Salvataggio non riuscito: ${res.error.message}`,
      });
      return;
    }

    setMsg({
      tipo: "ok",
      testo:
        stato === "bozza"
          ? "Bozza salvata."
          : dataIso
            ? `Articolo programmato: uscirà ${dataLeggibile(dataIso)}.`
            : "Articolo pubblicato.",
    });
    set("stato", stato);
    setProgrammatoIl(stato === "pubblicato" ? dataIso ?? null : null);
    setApriProgramma(false);

    if (isNuovo && res.data?.id) {
      router.replace(`/admin/articoli/${res.data.id}`);
    }
    router.refresh();
  };

  const elimina = async () => {
    if (!articolo) return;
    if (!window.confirm(`Eliminare definitivamente "${articolo.titolo}"?`)) return;
    const { error } = await getSupabase().from("articoli").delete().eq("id", articolo.id);
    if (error) return setMsg({ tipo: "err", testo: `Eliminazione non riuscita: ${error.message}` });
    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="admin-form">
      <div className="admin-card admin-form">
        <div>
          <label htmlFor="titolo">Titolo</label>
          <input
            id="titolo"
            type="text"
            value={f.titolo}
            onChange={(e) => onTitolo(e.target.value)}
            placeholder="Es. Quanto si risparmia davvero con il fotovoltaico a Roma"
          />
        </div>

        <div>
          <label htmlFor="slug">Indirizzo dell&apos;articolo</label>
          <input
            id="slug"
            type="text"
            value={f.slug}
            onChange={(e) => { setSlugToccato(true); set("slug", slugify(e.target.value)); }}
          />
          <div className="hint">
            www.aleclima.eu/blog/<strong>{f.slug || "…"}</strong>
            {!isNuovo && " — cambiarlo dopo la pubblicazione fa perdere il posizionamento su Google."}
          </div>
        </div>

        <div>
          <label htmlFor="sommario">Sommario</label>
          <textarea
            id="sommario"
            rows={2}
            value={f.sommario ?? ""}
            onChange={(e) => set("sommario", e.target.value)}
            placeholder="Una o due righe che compaiono nella lista del blog."
          />
        </div>

        <div>
          <label htmlFor="keyword">Parola chiave principale</label>
          <input
            id="keyword"
            type="text"
            value={f.keyword ?? ""}
            onChange={(e) => set("keyword", e.target.value)}
            placeholder="Es. climatizzatore Roma"
          />
          <div className="hint">
            La ricerca su cui vuoi posizionarti. Non viene mostrata ai lettori: serve
            ai controlli qui sotto.
          </div>
        </div>
      </div>

      <div className="admin-card">
        <label>Immagine di copertina</label>
        {f.cover_url ? (
          <div style={{ marginBottom: 12 }}>
            <NextImage
              src={f.cover_url}
              alt={f.cover_alt || "Anteprima copertina"}
              width={480}
              height={270}
              style={{ borderRadius: 10, objectFit: "cover", width: "100%", maxWidth: 480, height: "auto" }}
            />
          </div>
        ) : (
          <p className="hint" style={{ marginBottom: 12 }}>Nessuna copertina caricata.</p>
        )}
        <div className="admin-actions">
          <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={onCover} />
          {f.cover_url && (
            <button type="button" className="btn btn-ghost" onClick={() => set("cover_url", "")}>
              Rimuovi
            </button>
          )}
        </div>
        <div style={{ marginTop: 14 }}>
          <label htmlFor="cover_alt">Descrizione dell&apos;immagine (alt)</label>
          <input
            id="cover_alt"
            type="text"
            value={f.cover_alt ?? ""}
            onChange={(e) => set("cover_alt", e.target.value)}
            placeholder="Cosa si vede nella foto — serve a Google e a chi usa screen reader."
          />
        </div>
      </div>

      <div>
        <label>Contenuto</label>
        <RichEditor
          value={articolo?.contenuto_html ?? ""}
          onChange={(html) => set("contenuto_html", html)}
        />
      </div>

      <div className="admin-card">
        <FaqEditor faq={f.faq ?? []} onChange={(faq) => set("faq", faq)} />
      </div>

      <SeoPanel
        dati={{
          titolo: f.titolo,
          slug: f.slug,
          keyword: f.keyword ?? "",
          sommario: f.sommario ?? "",
          metaTitle: f.meta_title ?? "",
          metaDescription: f.meta_description ?? "",
          contenutoHtml: f.contenuto_html ?? "",
          coverAlt: f.cover_alt ?? "",
          hasCover: Boolean(f.cover_url),
        }}
      />

      <div className="admin-card admin-form">
        <div>
          <label htmlFor="meta_title">Titolo per Google</label>
          <input
            id="meta_title"
            type="text"
            value={f.meta_title ?? ""}
            onChange={(e) => set("meta_title", e.target.value)}
            placeholder="Lascia vuoto per usare il titolo dell'articolo"
          />
          <div className="hint">{(f.meta_title || f.titolo).length} caratteri — sotto i 60 è l&apos;ideale.</div>
        </div>
        <div>
          <label htmlFor="meta_description">Descrizione per Google</label>
          <textarea
            id="meta_description"
            rows={2}
            value={f.meta_description ?? ""}
            onChange={(e) => set("meta_description", e.target.value)}
            placeholder="Lascia vuoto per usare il sommario"
          />
          <div className="hint">{(f.meta_description || f.sommario || "").length} caratteri — l&apos;ideale è 120-155.</div>
        </div>
      </div>

      {msg && <div className={`admin-msg ${msg.tipo}`}>{msg.testo}</div>}

      <div className="admin-actions">
        <button className="btn btn-ghost" type="button" disabled={saving} onClick={() => salva("bozza")}>
          {saving ? "Salvataggio…" : "Salva bozza"}
        </button>
        <button className="btn btn-green" type="button" disabled={saving} onClick={() => salva("pubblicato")}>
          {programmatoIl ? "Pubblica subito" : f.stato === "pubblicato" ? "Aggiorna pubblicato" : "Pubblica"}
        </button>
        <button className="btn btn-ghost" type="button" disabled={saving} onClick={() => setApriProgramma((v) => !v)}>
          {programmatoIl ? "Cambia programmazione" : "Programma"}
        </button>
        {!isNuovo && (
          <button
            type="button"
            className="btn btn-ghost"
            style={{ marginLeft: "auto", color: "#a12525" }}
            onClick={elimina}
          >
            Elimina
          </button>
        )}
      </div>

      {programmatoIl && !apriProgramma && (
        <div className="hint">
          Programmato: uscirà <strong>{dataLeggibile(programmatoIl)}</strong>. Fino ad allora non è visibile sul sito.
        </div>
      )}

      {apriProgramma && (
        <div className="admin-card admin-form">
          <div>
            <label htmlFor="quando">Quando deve uscire?</label>
            <input
              id="quando"
              type="datetime-local"
              value={quando}
              min={toLocalInput(new Date().toISOString())}
              onChange={(e) => setQuando(e.target.value)}
            />
            <div className="hint">
              Fino a quell&apos;ora l&apos;articolo resta nascosto, poi compare da solo sul blog e nel
              sitemap entro un minuto. Per salvare modifiche a un articolo programmato, conferma di nuovo qui.
            </div>
          </div>
          <div className="admin-actions">
            <button
              className="btn btn-green"
              type="button"
              disabled={saving || !quando}
              onClick={() => salva("pubblicato", new Date(quando).toISOString())}
            >
              {saving ? "Salvataggio…" : "Conferma programmazione"}
            </button>
            <button className="btn btn-ghost" type="button" onClick={() => setApriProgramma(false)}>
              Annulla
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
