/**
 * Controlli SEO per gli articoli del blog.
 * Funzioni pure: nessun accesso al DOM o alla rete, cosi' restano verificabili
 * e riutilizzabili anche fuori dall'editor.
 */

export type Esito = "ok" | "attenzione" | "errore";

export interface Controllo {
  id: string;
  etichetta: string;
  esito: Esito;
  dettaglio: string;
}

/** Pagine servizio verso cui ha senso creare link interni. */
export const PAGINE_INTERNE: { href: string; nome: string; termini: string[] }[] = [
  {
    href: "/climatizzazione",
    nome: "Climatizzazione",
    termini: ["climatizzator", "climatizzazione", "condizionator", "aria condizionata", "pompa di calore", "split", "btu"],
  },
  {
    href: "/fotovoltaico",
    nome: "Fotovoltaico",
    termini: ["fotovoltaic", "pannelli solari", "accumulo", "inverter", "autoconsumo", "batteria"],
  },
  {
    href: "/caldaie-idraulica",
    nome: "Caldaie & Idraulica",
    termini: ["caldaia", "caldaie", "condensazione", "riscaldamento", "idraulic", "termosifon", "bollino"],
  },
  {
    href: "/contatti",
    nome: "Contatti",
    termini: ["preventivo", "sopralluogo"],
  },
];

export const BRAND = "Aleclima e Impianti";

/**
 * Il titolo che finisce davvero nel tag <title>.
 * Il brand si aggiunge solo se non c'e' gia': altrimenti si ottiene
 * "... | Aleclima | Aleclima e Impianti", che spreca i caratteri utili
 * in SERP e sembra sciatto.
 * Usata sia dalla pagina pubblica sia dal controllo SEO, cosi' l'editor
 * misura la stringa reale e non un'approssimazione.
 */
export function titoloEffettivo(titolo: string, metaTitle?: string | null): string {
  const base = (metaTitle || titolo || "").trim();
  if (!base) return BRAND;
  return /aleclima/i.test(base) ? base : `${base} — ${BRAND}`;
}

export function testoDaHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function contaParole(html: string): number {
  const t = testoDaHtml(html);
  return t ? t.split(/\s+/).length : 0;
}

function normalizza(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function contiene(testo: string, chiave: string): boolean {
  if (!chiave.trim()) return false;
  return normalizza(testo).includes(normalizza(chiave));
}

/** Primo paragrafo utile del contenuto. */
function primoParagrafo(html: string): string {
  const m = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  return m ? testoDaHtml(m[1]) : testoDaHtml(html).slice(0, 300);
}

function sottotitoli(html: string): string[] {
  return Array.from(html.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi)).map((m) =>
    testoDaHtml(m[1])
  );
}

/** Link interni gia' presenti nel testo (href che parte con "/"). */
export function linkInterniPresenti(html: string): string[] {
  return Array.from(html.matchAll(/href="(\/[^"#?]*)/gi)).map((m) => m[1]);
}

/**
 * Pagine servizio nominate nel testo ma non ancora collegate.
 * E' il fattore su cui si perde piu' spesso terreno: il contenuto parla di
 * fotovoltaico e non porta un solo click alla pagina del fotovoltaico.
 */
export function linkInterniMancanti(html: string): { href: string; nome: string; termine: string }[] {
  const testo = testoDaHtml(html);
  const gia = new Set(linkInterniPresenti(html));

  const out: { href: string; nome: string; termine: string }[] = [];
  for (const p of PAGINE_INTERNE) {
    if (gia.has(p.href)) continue;
    const trovato = p.termini.find((t) => contiene(testo, t));
    if (trovato) out.push({ href: p.href, nome: p.nome, termine: trovato });
  }
  return out;
}

function immaginiSenzaAlt(html: string): number {
  const img = Array.from(html.matchAll(/<img[^>]*>/gi)).map((m) => m[0]);
  return img.filter((t) => !/alt="[^"]+"/i.test(t)).length;
}

export interface DatiArticolo {
  titolo: string;
  slug: string;
  keyword: string;
  sommario: string;
  metaTitle: string;
  metaDescription: string;
  contenutoHtml: string;
  coverAlt: string;
  hasCover: boolean;
}

export function analizza(a: DatiArticolo): Controllo[] {
  const c: Controllo[] = [];
  const kw = a.keyword.trim();
  const titleEff = titoloEffettivo(a.titolo, a.metaTitle);
  const descEff = (a.metaDescription || a.sommario).trim();
  const parole = contaParole(a.contenutoHtml);

  if (!kw) {
    c.push({
      id: "keyword",
      etichetta: "Parola chiave",
      esito: "attenzione",
      dettaglio: "Non impostata: senza, gli altri controlli non possono dirti granche'.",
    });
  } else {
    c.push({
      id: "kw-titolo",
      etichetta: "Parola chiave nel titolo",
      esito: contiene(a.titolo, kw) ? "ok" : "errore",
      dettaglio: contiene(a.titolo, kw)
        ? "Presente."
        : `"${kw}" non compare nel titolo: e' il segnale piu' forte per Google.`,
    });

    c.push({
      id: "kw-slug",
      etichetta: "Parola chiave nell'indirizzo",
      esito: contiene(a.slug.replace(/-/g, " "), kw) ? "ok" : "attenzione",
      dettaglio: contiene(a.slug.replace(/-/g, " "), kw)
        ? "Presente."
        : "Non compare nello slug. Utile, ma non cambiarlo se l'articolo e' gia' pubblicato.",
    });

    const p1 = primoParagrafo(a.contenutoHtml);
    c.push({
      id: "kw-apertura",
      etichetta: "Parola chiave in apertura",
      esito: contiene(p1, kw) ? "ok" : "attenzione",
      dettaglio: contiene(p1, kw)
        ? "Compare nel primo paragrafo."
        : "Non compare nel primo paragrafo: e' li' che si capisce di cosa parla il pezzo.",
    });

    const h = sottotitoli(a.contenutoHtml);
    const inH = h.some((t) => contiene(t, kw));
    c.push({
      id: "kw-sottotitoli",
      etichetta: "Parola chiave nei sottotitoli",
      esito: h.length === 0 ? "errore" : inH ? "ok" : "attenzione",
      dettaglio:
        h.length === 0
          ? "Non ci sono sottotitoli (H2/H3): un articolo lungo senza struttura si legge male e si posiziona peggio."
          : inH
            ? "Presente in almeno un sottotitolo."
            : `Nessuno dei ${h.length} sottotitoli contiene la parola chiave.`,
    });
  }

  const lenT = titleEff.length;
  c.push({
    id: "title",
    etichetta: "Lunghezza del titolo per Google",
    esito: lenT === 0 ? "errore" : lenT < 30 ? "attenzione" : lenT <= 60 ? "ok" : "attenzione",
    dettaglio:
      lenT === 0
        ? "Manca il titolo."
        : `${lenT} caratteri, brand incluso. ` +
          (lenT < 30 ? "Corto: hai spazio per essere piu' specifico." : lenT <= 60 ? "Nella misura giusta." : "Oltre i 60: Google lo tagliera'."),
  });

  const lenD = descEff.length;
  c.push({
    id: "description",
    etichetta: "Descrizione per Google",
    esito: lenD === 0 ? "errore" : lenD < 120 || lenD > 155 ? "attenzione" : "ok",
    dettaglio:
      lenD === 0
        ? "Assente: Google si inventera' un estratto dal testo."
        : `${lenD} caratteri. ` +
          (lenD < 120 ? "Corta: stai sprecando spazio in SERP." : lenD > 155 ? "Verra' troncata." : "Nella misura giusta."),
  });

  c.push({
    id: "lunghezza",
    etichetta: "Lunghezza dell'articolo",
    esito: parole < 300 ? "errore" : parole < 600 ? "attenzione" : "ok",
    dettaglio:
      `${parole} parole. ` +
      (parole < 300
        ? "Troppo corto per posizionarsi su una ricerca competitiva."
        : parole < 600
          ? "Accettabile, ma sotto i 600 e' difficile coprire un argomento."
          : "Buona lunghezza."),
  });

  const mancanti = linkInterniMancanti(a.contenutoHtml);
  const presenti = linkInterniPresenti(a.contenutoHtml).length;
  c.push({
    id: "link-interni",
    etichetta: "Link interni",
    esito: presenti === 0 ? "errore" : mancanti.length ? "attenzione" : "ok",
    dettaglio:
      presenti === 0
        ? "Nessun link alle pagine del sito: l'articolo non porta traffico dove si vende."
        : mancanti.length
          ? `${presenti} presenti. Mancano collegamenti a: ${mancanti.map((m) => m.nome).join(", ")}.`
          : `${presenti} link interni, tutte le pagine pertinenti sono collegate.`,
  });

  const senzaAlt = immaginiSenzaAlt(a.contenutoHtml);
  c.push({
    id: "alt",
    etichetta: "Testo alternativo sulle immagini",
    esito: senzaAlt > 0 ? "attenzione" : "ok",
    dettaglio:
      senzaAlt > 0
        ? `${senzaAlt} immagini nel testo senza descrizione.`
        : "Tutte le immagini nel testo hanno una descrizione.",
  });

  c.push({
    id: "cover",
    etichetta: "Immagine di copertina",
    esito: !a.hasCover ? "attenzione" : a.coverAlt.trim() ? "ok" : "attenzione",
    dettaglio: !a.hasCover
      ? "Assente: e' l'anteprima quando l'articolo viene condiviso."
      : a.coverAlt.trim()
        ? "Presente, con descrizione."
        : "Presente, ma senza descrizione (alt).",
  });

  return c;
}

export function punteggio(controlli: Controllo[]): number {
  if (!controlli.length) return 0;
  const peso = { ok: 1, attenzione: 0.5, errore: 0 };
  const somma = controlli.reduce((t, c) => t + peso[c.esito], 0);
  return Math.round((somma / controlli.length) * 100);
}
