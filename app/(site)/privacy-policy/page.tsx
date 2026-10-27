import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/meta";
import { PageHead } from "@/components/shared/PageHead";

export const metadata: Metadata = pageMeta(
  "Privacy Policy — Aleclima e Impianti",
  "Informativa sul trattamento dei dati personali ai sensi degli artt. 13 e 14 del Regolamento UE 2016/679 (GDPR).",
  "/privacy-policy"
);

export default function Page() {
  return (
    <>
      <PageHead crumb="Privacy Policy" kick="Informativa GDPR" title="Privacy Policy" sub="Ultimo aggiornamento: 27 ottobre 2026" />
      <section className="section">
        <div className="wrap legal">
          <p>
            Questa informativa descrive come Aleclima e Impianti S.r.l.s tratta i dati personali di chi visita il sito
            www.aleclima.eu e di chi ci contatta, ai sensi degli artt. 13 e 14 del Regolamento UE 2016/679 (&quot;GDPR&quot;)
            e del D.Lgs. 196/2003 come modificato dal D.Lgs. 101/2018.
          </p>

          <h2>1. Titolare del trattamento</h2>
          <p>
            Aleclima e Impianti S.r.l.s, Via di Colle Pallone Nuovo 26, 00039 Zagarolo (RM), C.F. e P. IVA 15597681004,
            REA RM-1601256, in persona dell&apos;Amministratore Unico pro tempore.
            <br />
            Email: <a href="mailto:aleclimaimpiantisrls@gmail.com">aleclimaimpiantisrls@gmail.com</a> · PEC:{" "}
            <a href="mailto:aleclimaimpiantisrls@pec.it">aleclimaimpiantisrls@pec.it</a> · Tel. 06 86764589
            <br />
            Il Titolare non ha nominato un Responsabile della protezione dei dati (DPO), non essendovi obbligato ai sensi dell&apos;art. 37 GDPR.
          </p>

          <h2>2. Dati trattati</h2>
          <ul>
            <li><b>Dati forniti da te</b>: nome, numero di telefono, email, servizio di interesse e messaggio inseriti nel modulo di contatto, oppure inviati via WhatsApp, email o telefono.</li>
            <li><b>Dati di navigazione</b>: pagina visitata, dominio di provenienza e tipo di dispositivo (mobile/desktop), raccolti in forma anonima senza cookie né indirizzo IP per statistiche interne.</li>
            <li><b>Dati tecnici del modulo e del consenso cookie</b>: user agent del browser, pagina e data del consenso, identificativo casuale del consenso, conservati come prova delle scelte effettuate.</li>
            <li><b>Dati raccolti tramite cookie</b>: vedi la <Link href="/cookie-policy">Cookie Policy</Link>.</li>
          </ul>
          <p>Ti chiediamo di non inserire nel messaggio dati particolari (es. dati sulla salute) non necessari alla richiesta.</p>

          <h2>3. Finalità e basi giuridiche</h2>
          <table>
            <thead>
              <tr><th>Finalità</th><th>Base giuridica</th><th>Conservazione</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Rispondere alle richieste di informazioni e preventivo, ricontattarti, effettuare sopralluoghi</td>
                <td>Misure precontrattuali su tua richiesta (art. 6.1.b GDPR)</td>
                <td>24 mesi dall&apos;ultimo contatto se non segue un contratto</td>
              </tr>
              <tr>
                <td>Esecuzione del contratto, installazione, assistenza, garanzie, pratiche per detrazioni fiscali</td>
                <td>Contratto (art. 6.1.b GDPR)</td>
                <td>Durata del rapporto e 10 anni successivi</td>
              </tr>
              <tr>
                <td>Adempimenti fiscali, contabili e di legge (es. dichiarazioni di conformità degli impianti)</td>
                <td>Obbligo legale (art. 6.1.c GDPR)</td>
                <td>10 anni (art. 2220 c.c.)</td>
              </tr>
              <tr>
                <td>Sicurezza del sito, prova del consenso cookie, statistiche anonime di visita</td>
                <td>Legittimo interesse (art. 6.1.f GDPR)</td>
                <td>Consenso cookie: 24 mesi; statistiche: anonime</td>
              </tr>
              <tr>
                <td>Difesa di un diritto in sede giudiziaria</td>
                <td>Legittimo interesse (art. 6.1.f GDPR)</td>
                <td>Per il tempo di prescrizione dei diritti</td>
              </tr>
              <tr>
                <td>Invio di offerte, promozioni e novità via email, telefono, SMS o WhatsApp</td>
                <td>Consenso facoltativo e separato espresso nel modulo (art. 6.1.a GDPR; art. 130 D.Lgs. 196/2003)</td>
                <td>Fino alla revoca e comunque non oltre 24 mesi dal consenso, salvo rinnovo</td>
              </tr>
              <tr>
                <td>Pubblicità su Facebook e Instagram e misurazione delle campagne (Meta Pixel)</td>
                <td>Consenso ai cookie di marketing (art. 6.1.a GDPR)</td>
                <td>Vedi Cookie Policy</td>
              </tr>
              <tr>
                <td>Analisi dell&apos;uso del sito con cookie statistici (Microsoft Clarity)</td>
                <td>Consenso (art. 6.1.a GDPR), revocabile in ogni momento</td>
                <td>Vedi Cookie Policy</td>
              </tr>
            </tbody>
          </table>
          <p>
            Il consenso al marketing non è necessario per ricevere il preventivo: se non lo dai, ti contatteremo solo per
            la tua richiesta. Puoi revocarlo in ogni momento scrivendoci o rispondendo &quot;STOP&quot; ai nostri messaggi.
            Non vendiamo i tuoi dati a terzi e non prendiamo decisioni basate unicamente su trattamenti automatizzati.
          </p>

          <h2>4. Natura del conferimento</h2>
          <p>
            Il conferimento dei dati del modulo è facoltativo, ma senza nome, telefono ed email non possiamo rispondere
            alla tua richiesta. Il consenso ai cookie statistici è facoltativo e il rifiuto non limita l&apos;uso del sito.
          </p>

          <h2>5. Destinatari</h2>
          <p>I dati sono trattati dal personale autorizzato del Titolare e da fornitori nominati Responsabili del trattamento (art. 28 GDPR):</p>
          <ul>
            <li><b>Vercel Inc.</b> – hosting del sito;</li>
            <li><b>Supabase Inc.</b> – database delle richieste di contatto e dei consensi;</li>
            <li><b>HighLevel Inc. (LeadConnector)</b> – gestione dei contatti (CRM), invio delle comunicazioni e widget recensioni;</li>
            <li><b>Resend Inc.</b> – invio delle notifiche email delle nuove richieste;</li>
            <li><b>Microsoft Corporation</b> – Clarity, solo previo consenso;</li>
            <li><b>Meta Platforms Ireland Ltd.</b> – Meta Pixel, solo previo consenso, in contitolarità per la raccolta dei dati (art. 26 GDPR);</li>
            <li><b>Meta Platforms</b> – WhatsApp, se scegli di contattarci tramite questo canale;</li>
            <li>consulenti fiscali, legali e tecnici, istituti di credito ed enti pubblici quando necessario per il contratto o per legge.</li>
          </ul>

          <h2>6. Trasferimenti extra UE</h2>
          <p>
            Alcuni fornitori hanno sede negli Stati Uniti. I trasferimenti avvengono sulla base della decisione di adeguatezza
            UE-USA (EU-U.S. Data Privacy Framework) per i fornitori certificati, oppure delle Clausole contrattuali standard
            approvate dalla Commissione europea (art. 46 GDPR).
          </p>

          <h2>7. I tuoi diritti</h2>
          <p>
            In ogni momento puoi chiedere l&apos;accesso ai tuoi dati, la rettifica, la cancellazione, la limitazione del
            trattamento, la portabilità e opporti ai trattamenti basati sul legittimo interesse (artt. 15-22 GDPR). Puoi
            revocare il consenso ai cookie con il pulsante &quot;Preferenze cookie&quot; in fondo a ogni pagina, senza
            pregiudicare la liceità del trattamento precedente.
          </p>
          <p>
            Per esercitare i diritti scrivi a <a href="mailto:aleclimaimpiantisrls@gmail.com">aleclimaimpiantisrls@gmail.com</a>{" "}
            o alla PEC <a href="mailto:aleclimaimpiantisrls@pec.it">aleclimaimpiantisrls@pec.it</a>:
            rispondiamo entro 30 giorni. Hai inoltre diritto di proporre reclamo al Garante per la protezione dei dati
            personali (<a href="https://www.garanteprivacy.it" target="_blank" rel="noreferrer">www.garanteprivacy.it</a>).
          </p>

          <h2>8. Modifiche</h2>
          <p>
            Questa informativa può essere aggiornata. La versione in vigore è sempre pubblicata su questa pagina con la data
            dell&apos;ultimo aggiornamento.
          </p>
        </div>
      </section>
    </>
  );
}
