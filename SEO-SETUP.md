# SEO & OG — file da aggiungere al progetto

Tutti i file qui sotto vanno copiati nel repo **mantenendo i percorsi indicati**, poi commit + push.

## File pronti (copia così come sono)

| File | Dove va | Cosa fa |
|---|---|---|
| `og-image.jpg` | `public/og-image.jpg` | Immagine anteprima link (1200×630) — già referenziata in `index.html` |
| `og-image.png` | `public/og-image.png` *(opzionale)* | Versione PNG, se preferisci |
| `index.html` | root (sostituisce l'esistente) | Meta completi: description, canonical, OG, Twitter, theme-color, JSON-LD attività locale |
| `robots.txt` | `public/robots.txt` | Indicizzazione + link alla sitemap |
| `sitemap.xml` | `public/sitemap.xml` | Mappa delle 6 pagine |
| `Seo.tsx` | `src/components/shared/Seo.tsx` | Meta dinamici per rotta (titolo tab + Google) |

> ⚠️ **Dominio**: ho usato `https://www.aleclima.eu` in `index.html`, `robots.txt`, `sitemap.xml` e nella costante `SITE` di `Seo.tsx`. Se il dominio finale è diverso, fai un find&replace di `www.aleclima.eu`.

## Come funzionano le anteprime dei link (importante)

Gli scraper di **WhatsApp, Facebook, Telegram, LinkedIn NON eseguono JavaScript**: quando si condivide un link leggono solo i meta **statici** dell'`index.html`. Quindi:
- La **card di condivisione** (immagine + titolo) è quella di `index.html` → ora è completa e uguale per ogni link condiviso. ✅
- `Seo.tsx` aggiorna i meta **lato client**: serve per il **titolo della tab** corretto pagina per pagina e per **Google** (che il JS lo esegue). ✅
- Se in futuro vuoi una card diversa per ogni pagina (es. immagine specifica del fotovoltaico quando condividi `/fotovoltaico`), serve **prerendering/SSR** — te lo aggiungo a parte con `vite-plugin-prerender` o migrazione a Next. Per ora i meta statici coprono bene.

## Wiring di `Seo.tsx` — PROMPT per Antigravity

```
Integra il componente SEO per-rotta appena aggiunto.

1. In src/App.tsx RIMUOVI lo useEffect che forza document.title
   (`document.title = "Aleclima..."`): da ora il titolo lo gestisce ogni pagina.

2. In ciascuna pagina importa `import { Seo } from "../components/shared/Seo";`
   e inserisci <Seo .../> come PRIMO elemento del return, con questi valori:

   src/pages/Home.tsx
   <Seo title="Aleclima e Impianti — Clima, Fotovoltaico e Riscaldamento a Roma"
        description="Climatizzatori, fotovoltaico con accumulo, caldaie e idraulica a Roma e provincia. Installazione chiavi in mano, detrazione 50% e preventivo gratuito." />

   src/pages/Climatizzazione.tsx
   <Seo title="Climatizzatori Samsung a Roma — Installazione chiavi in mano | Aleclima"
        description="Climatizzatori Samsung 9.000 e 12.000 BTU installati a regola d'arte a Roma e provincia. Prezzo chiavi in mano, certificazione di legge e detrazione fiscale." />

   src/pages/Fotovoltaico.tsx
   <Seo title="Fotovoltaico con accumulo a Roma da € 5.690 | Aleclima e Impianti"
        description="Impianti fotovoltaici con accumulo chiavi in mano a Roma e provincia. Detrazione 50%, pratica ENEA inclusa e finanziamento con prima rata dopo 4 mesi." />

   src/pages/CaldaieIdraulica.tsx
   <Seo title="Caldaie, riscaldamento e idraulica a Roma — Aleclima e Impianti"
        description="Installazione e sostituzione caldaie a condensazione, manutenzione, bollino e impianti idraulici civili e industriali a Roma. Pronto intervento." />

   src/pages/ChiSiamo.tsx
   <Seo title="Chi siamo — Aleclima e Impianti, dal 2006 a Roma"
        description="Dal 2006 al fianco di famiglie e aziende a Roma e provincia: climatizzazione, fotovoltaico, caldaie e idraulica. Consumare e consumare meglio." />

   src/pages/Contatti.tsx
   <Seo title="Contatti e preventivo gratuito — Aleclima e Impianti Roma"
        description="Richiedi un preventivo gratuito a Roma e provincia. Chiama 327 8975018, scrivi su WhatsApp o compila il form: ti ricontattiamo subito." />

3. Verifica che il build TypeScript passi (npm run build) e che cambiando rotta
   cambi il titolo della tab del browser.
```

## Dopo il deploy — checklist veloce

- [ ] Testa l'anteprima link su https://www.opengraph.xyz/ incollando l'URL del sito.
- [ ] Forza il refresh cache di Facebook/WhatsApp con https://developers.facebook.com/tools/debug/ (Scrape Again).
- [ ] Invia la sitemap su Google Search Console e verifica l'indicizzazione.
- [ ] Controlla i dati strutturati su https://search.google.com/test/rich-results
