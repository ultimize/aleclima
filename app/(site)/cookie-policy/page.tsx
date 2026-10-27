import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/meta";
import { PageHead } from "@/components/shared/PageHead";
import { PreferenzeCookie } from "@/components/shared/PreferenzeCookie";

export const metadata: Metadata = pageMeta(
  "Cookie Policy — Aleclima e Impianti",
  "Quali cookie e tecnologie simili usa il sito aleclima.eu, per quali finalità e come gestire il consenso.",
  "/cookie-policy"
);

export default function Page() {
  return (
    <>
      <PageHead crumb="Cookie Policy" kick="Informativa cookie" title="Cookie Policy" sub="Ultimo aggiornamento: 27 ottobre 2026" />
      <section className="section">
        <div className="wrap legal">
          <p>
            Questa pagina spiega quali cookie e tecnologie simili usa il sito www.aleclima.eu, gestito da Aleclima e
            Impianti S.r.l.s (P. IVA 15597681004, PEC aleclimaimpiantisrls@pec.it), in conformità all&apos;art. 122 del D.Lgs. 196/2003 e alle Linee guida
            del Garante privacy del 10 giugno 2021. Per il resto del trattamento dei dati vedi la{" "}
            <Link href="/privacy-policy">Privacy Policy</Link>.
          </p>

          <h2>1. Cosa sono i cookie</h2>
          <p>
            I cookie sono piccoli file di testo che il sito salva nel tuo browser. Tecnologie simili, come il localStorage,
            funzionano in modo analogo e sono trattate allo stesso modo.
          </p>

          <h2>2. Cookie tecnici (sempre attivi)</h2>
          <p>Servono al funzionamento del sito e a ricordare le tue scelte. Non richiedono consenso.</p>
          <table>
            <thead>
              <tr><th>Nome</th><th>Fornitore</th><th>Finalità</th><th>Durata</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>aleclima_cookie_consent (cookie e localStorage)</td>
                <td>Aleclima (prima parte)</td>
                <td>Memorizza le tue preferenze sui cookie</td>
                <td>12 mesi</td>
              </tr>
            </tbody>
          </table>
          <p>
            Le statistiche di visita interne non usano cookie e non registrano l&apos;indirizzo IP: contiamo solo pagina
            visitata, dominio di provenienza e tipo di dispositivo.
          </p>

          <h2>3. Cookie statistici (solo con consenso)</h2>
          <p>
            Ci aiutano a capire come viene usato il sito per migliorarlo. Usiamo Microsoft Clarity, che registra in forma
            pseudonimizzata interazioni come clic, scorrimento e movimenti del mouse e produce mappe di calore. I campi dei
            moduli vengono mascherati. Clarity viene caricato solo se accetti i cookie statistici.
          </p>
          <table>
            <thead>
              <tr><th>Nome</th><th>Fornitore</th><th>Finalità</th><th>Durata</th></tr>
            </thead>
            <tbody>
              <tr><td>_clck</td><td>Microsoft</td><td>Identifica in modo pseudonimo il browser tra le visite</td><td>12 mesi</td></tr>
              <tr><td>_clsk</td><td>Microsoft</td><td>Collega le pagine della stessa sessione</td><td>1 giorno</td></tr>
              <tr><td>CLID</td><td>Microsoft</td><td>Identifica la prima visita del browser</td><td>12 mesi</td></tr>
              <tr><td>MUID</td><td>Microsoft</td><td>Identifica il browser sui servizi Microsoft</td><td>13 mesi</td></tr>
            </tbody>
          </table>
          <p>
            Informativa del fornitore:{" "}
            <a href="https://privacy.microsoft.com/it-it/privacystatement" target="_blank" rel="noreferrer">Microsoft Privacy Statement</a>.
          </p>

          <h2>4. Cookie di marketing (solo con consenso)</h2>
          <p>
            Servono a misurare l&apos;efficacia delle nostre pubblicità su Facebook e Instagram e a mostrarti annunci
            pertinenti. Usiamo Meta Pixel, che viene attivato solo se accetti i cookie di marketing. Con lo stesso consenso
            carichiamo il widget delle recensioni (vedi punto 5).
          </p>
          <table>
            <thead>
              <tr><th>Nome</th><th>Fornitore</th><th>Finalità</th><th>Durata</th></tr>
            </thead>
            <tbody>
              <tr><td>_fbp</td><td>Meta</td><td>Identifica il browser per misurare e ottimizzare le pubblicità</td><td>3 mesi</td></tr>
              <tr><td>_fbc</td><td>Meta</td><td>Memorizza l&apos;ultimo clic su un annuncio Meta</td><td>3 mesi</td></tr>
              <tr><td>fr</td><td>Meta (facebook.com)</td><td>Pubblicità mirata e misurazione</td><td>3 mesi</td></tr>
            </tbody>
          </table>
          <p>
            Per la raccolta tramite Pixel, Aleclima e Meta Platforms Ireland Ltd. sono contitolari del trattamento.
            Informativa:{" "}
            <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noreferrer">Meta Privacy Policy</a>.
          </p>

          <h2>5. Contenuti di terze parti</h2>
          <ul>
            <li>
              <b>Widget recensioni (HighLevel / LeadConnector)</b>: mostra le recensioni dei clienti. Si carica solo con il
              consenso ai cookie di marketing o se premi &quot;Mostra le recensioni&quot;; da quel momento il fornitore può
              ricevere dati tecnici come l&apos;indirizzo IP e impostare cookie. Informativa:{" "}
              <a href="https://www.gohighlevel.com/privacy-policy" target="_blank" rel="noreferrer">HighLevel Privacy Policy</a>.
            </li>
            <li>
              <b>Link a WhatsApp, Instagram, Facebook, TikTok e Google Maps</b>: sono semplici collegamenti, nessun dato
              viene inviato a queste piattaforme finché non li apri. Da quel momento si applicano le loro informative.
            </li>
          </ul>

          <h2>6. Come gestire il consenso</h2>
          <p>
            Alla prima visita un banner ti permette di accettare, rifiutare o scegliere per categoria. Chiudere il banner
            equivale a rifiutare i cookie non tecnici. Ti chiederemo di nuovo il consenso non prima di 6 mesi, salvo
            modifiche ai cookie usati. Puoi cambiare idea in qualsiasi momento:
          </p>
          <p><PreferenzeCookie /></p>
          <p>
            Puoi anche cancellare o bloccare i cookie dalle impostazioni del browser
            (<a href="https://support.google.com/chrome/answer/95647?hl=it" target="_blank" rel="noreferrer">Chrome</a>,{" "}
            <a href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank" rel="noreferrer">Safari</a>,{" "}
            <a href="https://support.mozilla.org/it/kb/Gestione%20dei%20cookie" target="_blank" rel="noreferrer">Firefox</a>,{" "}
            <a href="https://support.microsoft.com/it-it/microsoft-edge" target="_blank" rel="noreferrer">Edge</a>).
          </p>

          <h2>7. Contatti</h2>
          <p>
            Per domande su questa policy scrivi a{" "}
            <a href="mailto:aleclimaimpiantisrls@gmail.com">aleclimaimpiantisrls@gmail.com</a>.
          </p>
        </div>
      </section>
    </>
  );
}
