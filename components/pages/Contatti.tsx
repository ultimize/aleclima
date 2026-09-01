"use client";

import React, { useState, useEffect } from "react";
import { PageHead } from "@/components/shared/PageHead";
import { getSupabase } from "@/lib/supabase/browser";
import { I, Ico } from "@/components/shared/Icons";
import { Reviews } from "@/components/shared/Reviews";

const TEL = "327 8975018";
const TEL_RAW = "393278975018";
const WA = "393479576619";
const EMAIL = "aleclimaimpiantisrls@gmail.com";

interface FormFields {
  nome: string;
  tel: string;
  email: string;
  servizio: string;
  msg: string;
  privacy: boolean;
}

interface FormErrors {
  nome?: string;
  tel?: string;
  email?: string;
  servizio?: string;
  privacy?: string;
  submit?: string;
}

export const Contatti: React.FC = () => {
  
  const [f, setF] = useState<FormFields>({
    nome: "",
    tel: "",
    email: "",
    servizio: "",
    msg: "",
    privacy: false
  });
  
  const [err, setErr] = useState<FormErrors>({});
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Preseleziona il servizio se si arriva da una OfferCard (/contatti?servizio=...).
  // Si legge da window invece che con useSearchParams: quest'ultimo obbliga a un
  // confine Suspense che escluderebbe tutta la pagina dall'HTML statico.
  useEffect(() => {
    const servizio = new URLSearchParams(window.location.search).get("servizio");
    if (servizio) {
      setF(prev => ({ ...prev, servizio }));
    }
  }, []);

  const setField = (k: keyof FormFields, v: string | boolean) => {
    setF(p => ({ ...p, [k]: v }));
    setErr(p => ({ ...p, [k]: undefined }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr({});

    const eErrors: FormErrors = {};
    if (!f.nome.trim()) eErrors.nome = "Inserisci il tuo nome";
    
    // Basic phone validation (at least 6 digits/spaces/pluses)
    const cleanTel = f.tel.trim();
    if (!cleanTel || !/^[0-9 +]{6,}$/.test(cleanTel)) {
      eErrors.tel = "Inserisci un numero di telefono valido";
    }
    
    // Basic email validation
    const cleanEmail = f.email.trim();
    if (!cleanEmail || !/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      eErrors.email = "Inserisci un indirizzo email valido";
    }
    
    if (!f.servizio) eErrors.servizio = "Seleziona un servizio";
    if (!f.privacy) eErrors.privacy = "Devi accettare l'informativa sulla privacy per procedere";

    if (Object.keys(eErrors).length > 0) {
      setErr(eErrors);
      setLoading(false);
      return;
    }

    try {
      const { error } = await getSupabase().from("lead_preventivi").insert({
        nome: f.nome.trim(),
        telefono: cleanTel,
        email: cleanEmail,
        servizio: f.servizio,
        messaggio: f.msg.trim() || null,
        privacy: true,
        fonte: "sito",
        user_agent: navigator.userAgent
      });

      if (error) {
        throw new Error(error.message);
      }

      setSent(true);
    } catch (e: any) {
      console.error("Errore durante l'invio del lead:", e);
      setErr(prev => ({
        ...prev,
        submit: "Si è verificato un errore durante l'invio. Riprova più tardi o contattaci direttamente via telefono o WhatsApp."
      }));
    } finally {
      setLoading(false);
    }
  };

  const waText = encodeURIComponent(
    `Ciao Aleclima! Sono ${f.nome}. Vorrei un preventivo per: ${f.servizio || "—"}.\n${f.msg ? f.msg + "\n" : ""}Tel: ${f.tel} · Email: ${f.email}`
  );

  return (
    <>
      <PageHead 
        crumb="Contatti" 
        kick="Siamo a Roma e provincia"
        title="Richiedi un preventivo gratuito"
        sub="Compila il modulo o contattaci direttamente: ti rispondiamo in fretta con una consulenza senza impegno." 
      />
      <section className="section">
        <div className="wrap">
          <div className="cgrid">
            <div className="cbox">
              <h3>Contatti diretti</h3>
              
              <div className="crow">
                <div className="ci">{I.phone}</div>
                <div>
                  <div className="ck">Assistenza</div>
                  <a className="cv" href={`tel:+${TEL_RAW}`}>{TEL}</a>
                </div>
              </div>
              
              <div className="crow">
                <div className="ci">{I.phone}</div>
                <div>
                  <div className="ck">Ufficio</div>
                  <a className="cv" href="tel:+390686764589">06 86764589</a>
                </div>
              </div>
              
              <div className="crow">
                <div className="ci">{I.phone}</div>
                <div>
                  <div className="ck">Area commerciale</div>
                  <div className="cv">349 1057331 · 347 3576208</div>
                </div>
              </div>
              
              <div className="crow">
                <div className="ci">{I.wa}</div>
                <div>
                  <div className="ck">WhatsApp</div>
                  <a className="cv" href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer">347 9576619</a>
                </div>
              </div>
              
              <div className="crow">
                <div className="ci">{I.mail}</div>
                <div>
                  <div className="ck">Email</div>
                  <a className="cv" href={`mailto:${EMAIL}`}>{EMAIL}</a>
                </div>
              </div>
              
              <div className="crow">
                <div className="ci">{I.pin}</div>
                <div>
                  <div className="ck">Sede operativa</div>
                  <div className="cv">Via Casilina 2187, 00132 Roma</div>
                </div>
              </div>
              
              <div className="crow">
                <div className="ci">{I.pin}</div>
                <div>
                  <div className="ck">Sede legale</div>
                  <div className="cv">Via Colle Pallone Nuovo 26, 00039 Zagarolo (RM)</div>
                </div>
              </div>
            </div>

            <div className="form">
              {sent ? (
                <div className="success">
                  <div className="ok">
                    <Ico d={<path d="M20 6 9 17l-5-5" />} s={30} c="#16A34A" />
                  </div>
                  <h3>Richiesta inviata!</h3>
                  <p>Grazie {f.nome.split(" ")[0]}, ti ricontattiamo al più presto. Per fare prima, scrivici su WhatsApp.</p>
                  <div className="s-cta">
                    <a 
                      className="btn btn-wa" 
                      href={`https://wa.me/${WA}?text=${waText}`} 
                      target="_blank" 
                      rel="noreferrer"
                    >
                      {I.wa} Scrivi su WhatsApp
                    </a>
                    <button 
                      className="btn btn-ghost" 
                      onClick={() => {
                        setSent(false);
                        setF({ nome: "", tel: "", email: "", servizio: "", msg: "", privacy: false });
                      }}
                      type="button"
                    >
                      Nuova richiesta
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={submit}>
                  <h3>Modulo preventivo</h3>
                  <p className="fsub">Campi con <span style={{ color: "var(--verde)" }}>*</span> obbligatori.</p>
                  
                  {err.submit && (
                    <div className="errmsg" style={{ marginBottom: 15, fontSize: 14, fontWeight: 500 }}>
                      {err.submit}
                    </div>
                  )}

                  <div className="frow">
                    <div className={`field${err.nome ? " err" : ""}`}>
                      <label htmlFor="nome">Nome e cognome <span className="req">*</span></label>
                      <input 
                        id="nome"
                        value={f.nome} 
                        onChange={(e) => setField("nome", e.target.value)} 
                        placeholder="Mario Rossi" 
                        disabled={loading}
                      />
                      {err.nome && <div className="errmsg">{err.nome}</div>}
                    </div>
                    
                    <div className={`field${err.tel ? " err" : ""}`}>
                      <label htmlFor="tel">Telefono <span className="req">*</span></label>
                      <input 
                        id="tel"
                        value={f.tel} 
                        onChange={(e) => setField("tel", e.target.value)} 
                        placeholder="333 1234567" 
                        disabled={loading}
                      />
                      {err.tel && <div className="errmsg">{err.tel}</div>}
                    </div>
                  </div>
                  
                  <div className={`field${err.email ? " err" : ""}`}>
                    <label htmlFor="email">Email <span className="req">*</span></label>
                    <input 
                      id="email"
                      type="email"
                      value={f.email} 
                      onChange={(e) => setField("email", e.target.value)} 
                      placeholder="nome@email.it" 
                      disabled={loading}
                    />
                    {err.email && <div className="errmsg">{err.email}</div>}
                  </div>
                  
                  <div className={`field${err.servizio ? " err" : ""}`}>
                    <label htmlFor="servizio">Di cosa hai bisogno? <span className="req">*</span></label>
                    <select 
                      id="servizio"
                      value={f.servizio} 
                      onChange={(e) => setField("servizio", e.target.value)}
                      disabled={loading}
                    >
                      <option value="">Seleziona un servizio…</option>
                      <option value="Climatizzazione">Climatizzazione</option>
                      <option value="Fotovoltaico con accumulo">Fotovoltaico con accumulo</option>
                      <option value="Caldaie e riscaldamento">Caldaie e riscaldamento</option>
                      <option value="Impianti idraulici">Impianti idraulici</option>
                      <option value="Pronto intervento">Pronto intervento</option>
                      <option value="Altro">Altro</option>
                    </select>
                    {err.servizio && <div className="errmsg">{err.servizio}</div>}
                  </div>
                  
                  <div className="field">
                    <label htmlFor="msg">Messaggio</label>
                    <textarea 
                      id="msg"
                      value={f.msg} 
                      onChange={(e) => setField("msg", e.target.value)} 
                      placeholder="Raccontaci la tua esigenza, la zona e la metratura…" 
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="privacy">
                    <input 
                      id="privacy"
                      type="checkbox" 
                      checked={f.privacy} 
                      onChange={(e) => setField("privacy", e.target.checked)} 
                      disabled={loading}
                    />
                    <label htmlFor="privacy">
                      Ho letto l'informativa privacy e acconsento al trattamento dei dati per essere ricontattato. 
                      {err.privacy && <b style={{ color: "#dc2626", marginLeft: 5 }}>— {err.privacy}</b>}
                    </label>
                  </div>
                  
                  <button className="btn btn-green" type="submit" disabled={loading}>
                    {loading ? "Invio in corso..." : `Invia richiesta ${I.arrow.props.children ? "" : ""}`}
                    {!loading && I.arrow}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="wrap">
          <div className="sec-head">
            <div className="kick">Dicono di noi</div>
            <h2>Le recensioni dei nostri clienti</h2>
            <p>Competenza, precisione e tempi rispettati: ecco l'esperienza di chi ha già scelto Aleclima.</p>
          </div>
          <Reviews />
        </div>
      </section>

    </>
  );
};
