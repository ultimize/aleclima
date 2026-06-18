# PROMPT ANTIGRAVITY — Favicon brand Aleclima

Sostituisci la favicon segnaposto con il set brandizzato (sole + onda su tile navy).

== 1. FILE NELLA CARTELLA public/ ==
Copia in `public/` questi file (sostituendo il favicon.svg viola esistente):

  public/favicon.svg            (NUOVO, sostituisce quello viola)
  public/favicon.ico            (NUOVO)
  public/favicon-16.png         (NUOVO)
  public/favicon-32.png         (NUOVO)
  public/favicon-48.png         (NUOVO)
  public/apple-touch-icon.png   (NUOVO, 180x180)
  public/icon-192.png           (NUOVO)
  public/icon-512.png           (NUOVO)
  public/site.webmanifest       (NUOVO)

== 2. AGGIORNA L'<head> DI index.html ==
Nella sezione <head>, sostituisci l'unica riga del favicon esistente
(<link rel="icon" type="image/svg+xml" href="/favicon.svg" />) con questo blocco:

  <!-- Favicon (marchio Aleclima) -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />

(Se hai già applicato l'index.html aggiornato del pacchetto SEO, queste righe
ci sono già: salta questo punto.)

== 3. VERIFICA ==
Avvia `npm run dev`, apri il sito e controlla che nella tab del browser compaia
il sole+onda su sfondo blu scuro (non più il fulmine viola). Svuota la cache /
hard refresh se vedi ancora la vecchia icona (i browser cachano molto le favicon).

== 4. COMMIT & PUSH ==
git add public/favicon.svg public/favicon.ico public/favicon-16.png public/favicon-32.png public/favicon-48.png public/apple-touch-icon.png public/icon-192.png public/icon-512.png public/site.webmanifest index.html
git commit -m "Add brand favicon set (sole + onda) e web manifest"
git push origin main
