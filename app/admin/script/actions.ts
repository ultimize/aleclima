"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type Esito = { ok: boolean; testo: string };

const POSIZIONI = ["head", "body", "footer"];
const CATEGORIE = ["necessari", "statistiche", "marketing"];

/** Le server action sono endpoint pubblici: ognuna verifica il login da sola. */
async function clientLoggato() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  return user ? sb : null;
}

const NON_AUTORIZZATO: Esito = { ok: false, testo: "Sessione scaduta: accedi di nuovo." };

// le pagine pubbliche sono statiche: vanno rigenerate perche' il nuovo
// script (o codice di verifica) finisca nell'HTML servito
function rigenera() {
  revalidatePath("/", "layout");
}

export type DatiScript = { nome: string; posizione: string; categoria: string; codice: string; attivo: boolean };

function valida(d: DatiScript): string | null {
  if (!d.nome.trim() || d.nome.length > 80) return "Dai un nome allo script (max 80 caratteri).";
  if (!POSIZIONI.includes(d.posizione)) return "Posizione non valida.";
  if (!CATEGORIE.includes(d.categoria)) return "Categoria non valida.";
  if (!d.codice.trim()) return "Incolla il codice dello script.";
  if (d.codice.length > 20000) return "Codice troppo lungo (max 20.000 caratteri).";
  return null;
}

// scrittura col client dell'utente: anche la RLS rifiuta chi non e' loggato
export async function salvaScript(id: string | null, d: DatiScript): Promise<Esito> {
  const sb = await clientLoggato();
  if (!sb) return NON_AUTORIZZATO;
  const errore = valida(d);
  if (errore) return { ok: false, testo: errore };

  const riga = {
    nome: d.nome.trim(),
    posizione: d.posizione,
    categoria: d.categoria,
    codice: d.codice.trim(),
    attivo: d.attivo,
    updated_at: new Date().toISOString(),
  };
  const { error } = id
    ? await sb.from("script_sito").update(riga).eq("id", id)
    : await sb.from("script_sito").insert(riga);
  if (error) return { ok: false, testo: `Salvataggio non riuscito: ${error.message}` };
  rigenera();
  return { ok: true, testo: "Script salvato. Sul sito entro pochi secondi." };
}

export async function eliminaScript(id: string): Promise<Esito> {
  const sb = await clientLoggato();
  if (!sb) return NON_AUTORIZZATO;
  const { error } = await sb.from("script_sito").delete().eq("id", id);
  if (error) return { ok: false, testo: `Eliminazione non riuscita: ${error.message}` };
  rigenera();
  return { ok: true, testo: "Script eliminato." };
}

/** Accetta il solo codice o l'intero <meta ... content="...">: ne estrae il valore. */
function codiceVerifica(v: string): string | null {
  const m = v.match(/content=["']([^"']+)["']/i);
  const c = (m ? m[1] : v).trim();
  return c ? c.slice(0, 200) : null;
}

export async function salvaVerifiche(google: string, bing: string): Promise<Esito> {
  const sb = await clientLoggato();
  if (!sb) return NON_AUTORIZZATO;
  const g = codiceVerifica(google);
  const b = codiceVerifica(bing);
  if ([g, b].some((c) => c && !/^[\w-]+$/.test(c))) {
    return { ok: false, testo: "Il codice di verifica contiene caratteri non validi." };
  }
  const { error } = await sb
    .from("impostazioni_sito")
    .update({ verifica_google: g, verifica_bing: b, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) return { ok: false, testo: `Salvataggio non riuscito: ${error.message}` };
  rigenera();
  return { ok: true, testo: "Codici di verifica salvati." };
}
