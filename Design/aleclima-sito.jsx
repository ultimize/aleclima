import React, { useState, useEffect } from "react";

/*
  AlecLima e Impianti — sito multipagina + form preventivo
  Stack di destinazione: React/TS/Vite/Supabase/Vercel.
  NOTA: il form qui usa un fallback WhatsApp/email perché l'artifact non ha backend.
  In produzione: sostituire handleSubmit con una insert su Supabase (tabella "lead_preventivi")
  + edge function di notifica. Vedi commento in handleSubmit().
*/

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

:root{
  --notte:#0A2540; --blu:#1668C7; --blu-chiaro:#3E8EE0;
  --verde:#16A34A; --verde-scuro:#0E7A37; --sole:#F4A933;
  --nebbia:#F2F6FB; --inchiostro:#16202E; --grigio:#5A6B7B;
  --linea:#E2E9F2; --bianco:#FFFFFF;
}
*{box-sizing:border-box;margin:0;padding:0}
.al-root{font-family:'Inter',system-ui,sans-serif;color:var(--inchiostro);background:var(--bianco);line-height:1.6;-webkit-font-smoothing:antialiased}
.al-root h1,.al-root h2,.al-root h3,.al-root .disp{font-family:'Barlow Condensed','Inter',sans-serif;text-transform:uppercase;letter-spacing:.01em;line-height:1.02;font-weight:800}
.wrap{max-width:1180px;margin:0 auto;padding:0 22px}
a{color:inherit;text-decoration:none}
button{font-family:inherit;cursor:pointer;border:none;background:none}

/* ---- header ---- */
.topbar{background:var(--notte);color:#cfe0f2;font-size:13.5px}
.topbar .wrap{display:flex;justify-content:space-between;align-items:center;height:40px;flex-wrap:wrap}
.topbar a{color:#cfe0f2;display:inline-flex;align-items:center;gap:6px}
.topbar a:hover{color:#fff}
.topbar .tb-r{display:flex;gap:20px;align-items:center}
header.nav{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.94);backdrop-filter:blur(8px);border-bottom:1px solid var(--linea)}
.nav .wrap{display:flex;align-items:center;justify-content:space-between;height:74px;gap:18px}
.logo{display:flex;align-items:center;gap:11px}
.logo .mark{width:42px;height:42px;flex:0 0 42px}
.logo .txt{display:flex;flex-direction:column;line-height:1}
.logo .wm{font-family:'Barlow Condensed';font-weight:800;font-size:27px;letter-spacing:.02em;text-transform:uppercase}
.logo .wm .a{color:var(--notte)} .logo .wm .b{color:var(--blu)}
.logo .sub{font-size:10.5px;letter-spacing:.32em;color:var(--grigio);font-weight:600;text-transform:uppercase}
.menu{display:flex;gap:4px;align-items:center}
.menu button{font-family:'Barlow Condensed';text-transform:uppercase;font-weight:600;font-size:16.5px;letter-spacing:.03em;color:var(--inchiostro);padding:9px 13px;border-radius:8px}
.menu button:hover{background:var(--nebbia);color:var(--blu)}
.menu button.on{color:var(--blu)}
.nav-cta{display:flex;align-items:center;gap:10px}
.burger{display:none}

.btn{display:inline-flex;align-items:center;gap:9px;font-family:'Barlow Condensed';text-transform:uppercase;font-weight:700;letter-spacing:.03em;font-size:16px;padding:12px 20px;border-radius:10px;transition:.15s;white-space:nowrap}
.btn:hover{transform:translateY(-1px)}
.btn-green{background:var(--verde);color:#fff;box-shadow:0 6px 16px rgba(22,163,74,.28)}
.btn-green:hover{background:var(--verde-scuro)}
.btn-blue{background:var(--blu);color:#fff;box-shadow:0 6px 16px rgba(22,104,199,.26)}
.btn-blue:hover{background:#1158ab}
.btn-ghost{background:#fff;color:var(--notte);border:1.5px solid var(--linea)}
.btn-ghost:hover{border-color:var(--blu);color:var(--blu)}
.btn-wa{background:#25D366;color:#073b1b}

/* ---- hero ---- */
.hero{position:relative;background:linear-gradient(160deg,#0A2540 0%,#103A66 55%,#1456A0 100%);color:#fff;overflow:hidden}
.hero:after{content:"";position:absolute;right:-120px;top:-120px;width:520px;height:520px;border-radius:50%;background:radial-gradient(circle,rgba(244,169,51,.35),transparent 62%);pointer-events:none}
.hero .wrap{position:relative;display:grid;grid-template-columns:1.15fr .85fr;gap:40px;padding:64px 22px 70px;align-items:center}
.eyebrow{display:inline-flex;align-items:center;gap:9px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);color:#dcebff;padding:7px 14px;border-radius:999px;font-size:13px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;margin-bottom:22px}
.eyebrow .dot{width:8px;height:8px;border-radius:50%;background:var(--verde);box-shadow:0 0 0 4px rgba(22,163,74,.25)}
.hero h1{font-size:clamp(40px,6vw,68px);margin-bottom:18px}
.hero h1 .hl{color:var(--sole)}
.hero p.lead{font-size:18.5px;color:#cfe0f2;max-width:540px;margin-bottom:28px}
.hero-cta{display:flex;gap:13px;flex-wrap:wrap;margin-bottom:30px}
.hero-points{display:flex;gap:22px;flex-wrap:wrap;color:#bcd2ec;font-size:14.5px}
.hero-points span{display:inline-flex;align-items:center;gap:8px}
.hero-card{background:#fff;color:var(--inchiostro);border-radius:18px;padding:26px;box-shadow:0 26px 60px rgba(4,18,40,.45)}
.hero-card .badge{display:inline-block;background:var(--verde);color:#fff;font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;padding:5px 11px;border-radius:6px;margin-bottom:14px}
.hero-card h3{font-size:24px;color:var(--notte)}
.hero-card .price{font-family:'Barlow Condensed';font-weight:800;font-size:46px;color:var(--blu);line-height:1;margin:6px 0 2px}
.hero-card .price small{font-size:18px;color:var(--grigio)}
.hero-card .net{font-size:14px;color:var(--verde-scuro);font-weight:600;margin-bottom:14px}
.hero-card ul{list-style:none;display:flex;flex-direction:column;gap:7px;font-size:14.5px;margin-bottom:18px}
.hero-card li{display:flex;align-items:center;gap:9px;color:#33485e}

/* ---- generic sections ---- */
.section{padding:72px 0}
.section.alt{background:var(--nebbia)}
.sec-head{max-width:720px;margin:0 auto 44px;text-align:center}
.kick{color:var(--verde);font-family:'Barlow Condensed';font-weight:700;letter-spacing:.14em;text-transform:uppercase;font-size:15px;margin-bottom:10px}
.sec-head h2{font-size:clamp(30px,4.4vw,46px);color:var(--notte)}
.sec-head p{color:var(--grigio);font-size:17px;margin-top:12px}

/* trust strip */
.trust{background:var(--notte);color:#fff}
.trust .wrap{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;padding:30px 22px}
.trust .item{text-align:center}
.trust .n{font-family:'Barlow Condensed';font-weight:800;font-size:42px;color:var(--sole);line-height:1}
.trust .l{font-size:13.5px;color:#aac3df;text-transform:uppercase;letter-spacing:.06em;margin-top:4px}

/* services grid */
.grid-s{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.scard{background:#fff;border:1px solid var(--linea);border-radius:16px;padding:26px 22px;transition:.18s;cursor:pointer}
.scard:hover{transform:translateY(-4px);box-shadow:0 18px 40px rgba(10,37,64,.12);border-color:transparent}
.scard .ico{width:52px;height:52px;border-radius:13px;display:flex;align-items:center;justify-content:center;background:var(--nebbia);margin-bottom:16px}
.scard h3{font-size:21px;color:var(--notte);margin-bottom:8px}
.scard p{color:var(--grigio);font-size:14.5px;margin-bottom:14px}
.scard .more{color:var(--blu);font-weight:600;font-size:14px;display:inline-flex;gap:6px;align-items:center}

/* offer cards */
.toggle-row{display:flex;justify-content:center;margin-bottom:34px}
.toggle{display:inline-flex;align-items:center;gap:13px;background:#fff;border:1px solid var(--linea);padding:11px 18px;border-radius:999px;font-size:14.5px;font-weight:600;color:var(--notte)}
.sw{width:46px;height:26px;border-radius:999px;background:#cdd8e6;position:relative;transition:.2s;flex:0 0 46px}
.sw.on{background:var(--verde)}
.sw i{position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:.2s;box-shadow:0 1px 3px rgba(0,0,0,.25)}
.sw.on i{left:23px}
.offers{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.offers.two{grid-template-columns:repeat(2,1fr);max-width:760px;margin:0 auto}
.ocard{background:#fff;border:1px solid var(--linea);border-radius:18px;padding:28px;display:flex;flex-direction:column;position:relative;overflow:hidden}
.ocard.feat{border:2px solid var(--verde);box-shadow:0 20px 50px rgba(22,163,74,.16)}
.ocard .tag{position:absolute;top:0;right:0;background:var(--verde);color:#fff;font-size:11.5px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;padding:6px 14px;border-bottom-left-radius:12px}
.ocard .oname{font-family:'Barlow Condensed';font-weight:700;text-transform:uppercase;font-size:16px;letter-spacing:.05em;color:var(--blu)}
.ocard .spec{font-family:'Barlow Condensed';font-weight:800;font-size:30px;color:var(--notte);margin:2px 0 16px;line-height:1.05}
.ocard .priceb{padding:16px 0;border-top:1px dashed var(--linea);border-bottom:1px dashed var(--linea);margin-bottom:16px}
.ocard .pre{font-size:12.5px;text-transform:uppercase;letter-spacing:.08em;color:var(--grigio);font-weight:600}
.ocard .price{font-family:'Barlow Condensed';font-weight:800;font-size:48px;color:var(--notte);line-height:1}
.ocard.net .price{color:var(--verde-scuro)}
.ocard .price small{font-size:19px;color:var(--grigio);font-weight:600}
.ocard .save{font-size:13.5px;color:var(--verde-scuro);font-weight:600;margin-top:6px}
.ocard ul{list-style:none;display:flex;flex-direction:column;gap:9px;margin-bottom:22px;font-size:14.5px}
.ocard li{display:flex;gap:9px;align-items:flex-start;color:#33485e}
.ocard .btn{justify-content:center;margin-top:auto}

/* why grid */
.why{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.wcard{display:flex;gap:14px;padding:22px;background:#fff;border:1px solid var(--linea);border-radius:14px}
.wcard .wi{flex:0 0 44px;width:44px;height:44px;border-radius:11px;background:rgba(22,163,74,.1);display:flex;align-items:center;justify-content:center}
.wcard h4{font-size:17px;color:var(--notte);margin-bottom:4px}
.wcard p{font-size:14px;color:var(--grigio)}

/* testimonial + cta band */
.quote{max-width:760px;margin:0 auto;text-align:center}
.quote .q{font-family:'Barlow Condensed';font-weight:600;font-size:clamp(24px,3.4vw,34px);color:var(--notte);text-transform:none;line-height:1.18}
.quote .who{margin-top:16px;color:var(--grigio);font-weight:600}
.band{background:linear-gradient(120deg,var(--verde),var(--verde-scuro));color:#fff;border-radius:20px;padding:46px 40px;display:flex;justify-content:space-between;align-items:center;gap:24px;flex-wrap:wrap}
.band h2{font-size:clamp(26px,3.6vw,38px)}
.band p{color:#dcfce7;margin-top:8px;max-width:520px}
.band .b-cta{display:flex;gap:12px;flex-wrap:wrap}
.band .btn-ghost{background:transparent;color:#fff;border-color:rgba(255,255,255,.55)}
.band .btn-ghost:hover{background:rgba(255,255,255,.12);color:#fff}

/* page header */
.phead{background:var(--notte);color:#fff;padding:54px 0}
.phead .kick{color:var(--sole)}
.phead h1{font-size:clamp(34px,5vw,56px)}
.phead p{color:#bcd2ec;max-width:640px;margin-top:12px;font-size:17px}
.crumb{color:#8fb0d4;font-size:13.5px;margin-bottom:14px}
.crumb b{color:#fff}

/* incl list two col */
.incl{display:grid;grid-template-columns:1fr 1fr;gap:10px 28px;background:#fff;border:1px solid var(--linea);border-radius:16px;padding:26px}
.incl li{display:flex;gap:10px;align-items:flex-start;font-size:15px;color:#33485e;list-style:none}

/* contatti */
.cgrid{display:grid;grid-template-columns:1fr 1.15fr;gap:34px;align-items:start}
.cbox{background:#fff;border:1px solid var(--linea);border-radius:16px;padding:26px}
.cbox h3{font-size:20px;color:var(--notte);margin-bottom:16px}
.crow{display:flex;gap:13px;align-items:flex-start;padding:11px 0;border-bottom:1px solid var(--linea)}
.crow:last-child{border-bottom:none}
.crow .ci{flex:0 0 38px;width:38px;height:38px;border-radius:10px;background:var(--nebbia);display:flex;align-items:center;justify-content:center}
.crow .ck{font-size:12.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--grigio);font-weight:600}
.crow .cv{font-weight:600;color:var(--notte);font-size:15.5px}
.crow a.cv:hover{color:var(--blu)}

/* form */
.form{background:#fff;border:1px solid var(--linea);border-radius:18px;padding:30px}
.form h3{font-size:23px;color:var(--notte);margin-bottom:6px}
.form .fsub{color:var(--grigio);font-size:15px;margin-bottom:22px}
.field{margin-bottom:16px}
.field label{display:block;font-size:13.5px;font-weight:600;color:var(--notte);margin-bottom:6px}
.field label .req{color:var(--verde)}
.field input,.field select,.field textarea{width:100%;border:1.5px solid var(--linea);border-radius:10px;padding:12px 14px;font-family:inherit;font-size:15px;color:var(--inchiostro);background:#fdfdfe;transition:.15s}
.field input:focus,.field select:focus,.field textarea:focus{outline:none;border-color:var(--blu);box-shadow:0 0 0 3px rgba(22,104,199,.12)}
.field textarea{resize:vertical;min-height:96px}
.field.err input,.field.err select,.field.err textarea{border-color:#dc2626;background:#fef2f2}
.errmsg{color:#dc2626;font-size:12.5px;margin-top:5px}
.frow{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.privacy{display:flex;gap:10px;align-items:flex-start;font-size:13px;color:var(--grigio);margin-bottom:18px}
.privacy input{width:18px;height:18px;flex:0 0 18px;margin-top:2px;accent-color:var(--verde)}
.form .btn{width:100%;justify-content:center;font-size:17px;padding:14px}
.success{text-align:center;padding:30px 6px}
.success .ok{width:64px;height:64px;border-radius:50%;background:rgba(22,163,74,.12);display:flex;align-items:center;justify-content:center;margin:0 auto 16px}
.success h3{font-size:24px;color:var(--notte);margin-bottom:8px}
.success p{color:var(--grigio);margin-bottom:20px}
.success .s-cta{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}

/* footer */
footer{background:var(--notte);color:#aac3df;padding:54px 0 26px;font-size:14px}
.fgrid{display:grid;grid-template-columns:1.4fr 1fr 1fr 1.1fr;gap:30px;padding-bottom:34px;border-bottom:1px solid rgba(255,255,255,.1)}
footer h4{color:#fff;font-family:'Barlow Condensed';font-weight:700;text-transform:uppercase;letter-spacing:.05em;font-size:16px;margin-bottom:15px}
footer ul{list-style:none;display:flex;flex-direction:column;gap:9px}
footer li button:hover,footer a:hover{color:#fff}
footer .small{color:#7c9bbd;font-size:12.5px;line-height:1.7}
.fsoc{display:flex;gap:10px;margin-top:14px}
.fsoc a{width:36px;height:36px;border-radius:9px;background:rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center}
.fsoc a:hover{background:var(--blu)}
.fbot{padding-top:20px;display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap;color:#7c9bbd;font-size:12.5px}

@media(max-width:900px){
  .hero .wrap{grid-template-columns:1fr;padding:48px 22px}
  .hero-card{order:-1}
  .grid-s,.offers,.offers.two,.why,.cgrid,.fgrid,.incl{grid-template-columns:1fr !important}
  .trust .wrap{grid-template-columns:repeat(2,1fr);gap:24px 12px}
  .frow{grid-template-columns:1fr}
  .menu{display:none}
  .menu.open{display:flex;position:absolute;top:74px;left:0;right:0;flex-direction:column;background:#fff;border-bottom:1px solid var(--linea);padding:10px 16px;gap:2px}
  .menu.open button{text-align:left;width:100%;font-size:18px;padding:13px}
  .burger{display:flex;flex-direction:column;gap:5px;padding:8px}
  .burger span{width:24px;height:2.5px;background:var(--notte);border-radius:2px}
  .nav-cta .btn:not(.burger-cta){display:none}
  .band{flex-direction:column;align-items:flex-start}
  .topbar .tb-l{display:none}
}
`;

// ---------- tiny inline icons ----------
const Ico = ({ d, c = "currentColor", s = 22 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const I = {
  phone: <Ico d={<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />} />,
  wa: <Ico d={<><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 0 1-.9-3.8 8.38 8.38 0 0 1 8.5-8.5 8.38 8.38 0 0 1 8.5 8.5z" /></>} />,
  mail: <Ico d={<><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 5L2 7" /></>} />,
  pin: <Ico d={<><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></>} />,
  arrow: <Ico d={<><path d="M5 12h14" /><path d="m12 5 7 7-7 7" />} s={16} />,
  check: <Ico d={<path d="M20 6 9 17l-5-5" />} s={18} c="#16A34A" />,
  snow: <Ico d={<><path d="M12 2v20M2 12h20m-3-7-14 14m0-14 14 14" /></>} c="#1668C7" />,
  sun: <Ico d={<><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>} c="#F4A933" />,
  flame: <Ico d={<path d="M12 2s4 4 4 8a4 4 0 0 1-8 0c0-1 .5-2 .5-2S6 9 6 13a6 6 0 0 0 12 0c0-5-6-11-6-11z" />} c="#E25822" />,
  drop: <Ico d={<path d="M12 2.7s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />} c="#1668C7" />,
  shield: <Ico d={<><path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z" /><path d="m9 12 2 2 4-4" /></>} c="#16A34A" />,
  euro: <Ico d={<><path d="M18 7a6 6 0 1 0 0 10M4 10h7M4 14h7" /></>} c="#16A34A" />,
  bolt: <Ico d={<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />} c="#F4A933" />,
  tools: <Ico d={<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2-2 2.6-2.6z" />} c="#1668C7" />,
};

const Logo = ({ light }) => (
  <div className="logo">
    <svg className="mark" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="23" fill={light ? "rgba(255,255,255,.1)" : "#F2F6FB"} />
      <circle cx="24" cy="19" r="6.5" fill="#F4A933" />
      <g stroke="#F4A933" strokeWidth="2" strokeLinecap="round">
        <path d="M24 7v3M24 28v3M11 19h3M34 19h3M15 10l2 2M31 10l-2 2" />
      </g>
      <path d="M6 33c5-4 9-4 12 0s11 4 12-1c1 4 6 4 12 1v6c-7 4-12 1-13-1-2 3-9 3-11-1-3 4-8 4-12 1z" fill="#1668C7" />
      <path d="M6 33c5-4 9-4 12 0s11 4 12-1c1 4 6 4 12 1" stroke="#0A2540" strokeWidth="0" />
    </svg>
    <div className="txt">
      <div className="wm" style={light ? { } : {}}>
        <span className="a" style={light ? { color: "#fff" } : {}}>ALE</span>
        <span className="b" style={light ? { color: "#7fb4ec" } : {}}>CLIMA</span>
      </div>
      <div className="sub" style={light ? { color: "#9fc0e6" } : {}}>e impianti</div>
    </div>
  </div>
);

// ---------- data ----------
const TEL = "327 8975018", TEL_RAW = "393278975018";
const WA = "393479576619";
const EMAIL = "aleclimaimpiantisrls@gmail.com";

const fvKits = [
  { name: "Essenziale", spec: "4 kW + 5 kWh", price: 5690, feat: false,
    pts: ["Installazione, IVA e collaudo inclusi", "Energia anche di notte con accumulo", "Più risparmio e indipendenza", "Pratica detrazione fiscale"] },
  { name: "Comfort", spec: "6 kW + 10 kWh", price: 8290, feat: false,
    pts: ["Tutto compreso, IVA inclusa", "Certificazione di conformità", "Pratica ENEA per detrazione 50%", "Sopralluogo gratuito"] },
  { name: "Indipendenza", spec: "6 kW + 15 kWh", price: 9800, feat: true,
    pts: ["Installato e certificato", "Pratica ENEA inclusa, recupero 50%", "Finanziabile, prima rata dopo 4 mesi", "Massima autonomia energetica"] },
];
const climaKits = [
  { name: "Samsung AR", spec: "9.000 BTU", price: 1180 },
  { name: "Samsung AR", spec: "12.000 BTU", price: 1270 },
];
const climaIncl = ["Installazione standard entro 3 metri", "Staffa, rame e cavo elettrico", "Certificazione conformità di legge",
  "Libretto impianto", "Registrazione F-gas per garanzia", "Possibilità detrazione fiscale"];

const eur = (n) => "€ " + n.toLocaleString("it-IT");

// ---------- shared bits ----------
function Toggle({ on, set }) {
  return (
    <div className="toggle-row">
      <button className="toggle" onClick={() => set(!on)}>
        <span className={"sw" + (on ? " on" : "")}><i /></span>
        Mostra prezzo con detrazione fiscale 50%
      </button>
    </div>
  );
}
function OfferCard({ k, net, go }) {
  const show = net ? Math.round(k.price / 2) : k.price;
  return (
    <div className={"ocard" + (k.feat ? " feat" : "") + (net ? " net" : "")}>
      {k.feat && <span className="tag">Più scelto</span>}
      <div className="oname">{k.name}</div>
      <div className="spec">{k.spec}</div>
      <div className="priceb">
        <div className="pre">{net ? "Costo reale dopo detrazione" : "Prezzo chiavi in mano"}</div>
        <div className="price">{eur(show)}<small>,00</small></div>
        {net
          ? <div className="save">Recuperi {eur(k.price - show)} con la detrazione fiscale</div>
          : <div className="save">Quasi la metà la recuperi: ~{eur(Math.round(k.price / 2))} di detrazione</div>}
      </div>
      <ul>{k.pts.map((p, i) => <li key={i}>{I.check}<span>{p}</span></li>)}</ul>
      <button className="btn btn-green" onClick={() => go("contatti")}>Richiedi preventivo {I.arrow}</button>
    </div>
  );
}
function Band({ go, title, text }) {
  return (
    <div className="section"><div className="wrap"><div className="band">
      <div>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      <div className="b-cta">
        <button className="btn btn-ghost" onClick={() => go("contatti")}>Preventivo gratuito {I.arrow}</button>
        <a className="btn btn-wa" href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer">{I.wa} WhatsApp</a>
      </div>
    </div></div></div>
  );
}

// ---------- pages ----------
function Home({ go, net, setNet }) {
  const services = [
    { ic: I.snow, t: "Climatizzazione", d: "Condizionatori Samsung inverter installati a regola d'arte, chiavi in mano.", p: "clima" },
    { ic: I.sun, t: "Fotovoltaico", d: "Impianti con accumulo per produrre, conservare e risparmiare ogni giorno.", p: "fotovoltaico" },
    { ic: I.flame, t: "Caldaie & Riscaldamento", d: "Installazione, sostituzione e manutenzione di caldaie a condensazione.", p: "caldaie" },
    { ic: I.drop, t: "Idraulica", d: "Impianti idraulici civili e industriali, pronto intervento su Roma.", p: "caldaie" },
  ];
  const why = [
    { ic: I.euro, t: "Prezzo chiaro e chiavi in mano", d: "Nessun costo nascosto: preventivi trasparenti, tutto compreso." },
    { ic: I.shield, t: "Installazione certificata", d: "Impianti a norma con dichiarazione di conformità e libretto." },
    { ic: I.check, t: "Detrazione fiscale gestita", d: "Ci occupiamo noi della pratica ENEA e del recupero del 50%." },
    { ic: I.bolt, t: "Interventi rapidi a Roma", d: "Sopralluoghi veloci e assistenza tecnica qualificata in zona." },
    { ic: I.tools, t: "30+ anni di esperienza", d: "Dal 2006 al fianco di famiglie e aziende del territorio." },
    { ic: I.wa, t: "Finanziamento su misura", d: "Paghi a rate, prima rata anche dopo 4 mesi dall'impianto." },
  ];
  return (
    <>
      <section className="hero"><div className="wrap">
        <div>
          <span className="eyebrow"><span className="dot" /> Roma e provincia · sopralluogo gratuito</span>
          <h1>Il risparmio a portata di <span className="hl">scelta</span>.</h1>
          <p className="lead">Climatizzazione, fotovoltaico e riscaldamento chiavi in mano. Consumare e consumare meglio: impianti efficienti che ti ripagano, con la detrazione fiscale gestita da noi.</p>
          <div className="hero-cta">
            <button className="btn btn-green" onClick={() => go("contatti")}>Richiedi preventivo gratuito {I.arrow}</button>
            <a className="btn btn-ghost" href={`tel:+${TEL_RAW}`} style={{ background: "rgba(255,255,255,.08)", color: "#fff", borderColor: "rgba(255,255,255,.3)" }}>{I.phone} {TEL}</a>
          </div>
          <div className="hero-points">
            <span>{I.check} Installazione inclusa</span>
            <span>{I.check} Detrazione 50%</span>
            <span>{I.check} Finanziabile</span>
          </div>
        </div>
        <div className="hero-card">
          <span className="badge">Promo fotovoltaico</span>
          <h3>6 kW + 15 kWh di accumulo</h3>
          <div className="price">€ 9.800<small>,00</small></div>
          <div className="net">Recuperi € 4.900 con la detrazione fiscale del 50%</div>
          <ul>
            <li>{I.check} Installato e certificato</li>
            <li>{I.check} Pratica ENEA inclusa</li>
            <li>{I.check} Finanziabile, 1ª rata dopo 4 mesi</li>
          </ul>
          <button className="btn btn-green" style={{ width: "100%", justifyContent: "center" }} onClick={() => go("fotovoltaico")}>Scopri l'offerta {I.arrow}</button>
        </div>
      </div></section>

      <section className="trust"><div className="wrap">
        {[["Dal 2006", "Esperienza sul campo"], ["1.000+", "Lavori completati"], ["99%", "Clienti soddisfatti"], ["Roma", "e tutta la provincia"]].map((x, i) =>
          <div className="item" key={i}><div className="n">{x[0]}</div><div className="l">{x[1]}</div></div>)}
      </div></section>

      <section className="section"><div className="wrap">
        <div className="sec-head"><div className="kick">Cosa facciamo</div><h2>Un solo interlocutore per la tua casa</h2>
          <p>Dal clima all'energia solare fino al riscaldamento e all'idraulica: progettiamo, installiamo e assistiamo.</p></div>
        <div className="grid-s">
          {services.map((s, i) =>
            <div className="scard" key={i} onClick={() => go(s.p)}>
              <div className="ico">{s.ic}</div><h3>{s.t}</h3><p>{s.d}</p>
              <span className="more">Scopri di più {I.arrow}</span>
            </div>)}
        </div>
      </div></section>

      <section className="section alt"><div className="wrap">
        <div className="sec-head"><div className="kick">Offerte fotovoltaico</div><h2>Investi nel tuo futuro, paga meno</h2>
          <p>Quasi la metà la recuperi grazie alle detrazioni fiscali. Un investimento che ti ripaga.</p></div>
        <Toggle on={net} set={setNet} />
        <div className="offers">{fvKits.map((k, i) => <OfferCard key={i} k={k} net={net} go={go} />)}</div>
      </div></section>

      <section className="section"><div className="wrap">
        <div className="sec-head"><div className="kick">Perché Aleclima</div><h2>Comfort oggi, risparmio sempre</h2></div>
        <div className="why">{why.map((w, i) =>
          <div className="wcard" key={i}><div className="wi">{w.ic}</div><div><h4>{w.t}</h4><p>{w.d}</p></div></div>)}</div>
      </div></section>

      <section className="section alt"><div className="wrap"><div className="quote">
        <div className="q">«Intervento eseguito con competenza, precisione e nei tempi concordati. Azienda seria e altamente professionale.»</div>
        <div className="who">— Silvia Moreschi, cliente · impianto di riscaldamento</div>
      </div></div></section>

      <Band go={go} title="Richiedi ora il tuo preventivo gratuito" text="Sopralluogo senza impegno, prezzo chiaro e tutto compreso. Ti diciamo subito quanto risparmi e quanto recuperi." />
    </>
  );
}

function PageHead({ kick, title, sub, crumb, go }) {
  return (
    <section className="phead"><div className="wrap">
      <div className="crumb"><button onClick={() => go("home")} style={{ color: "#8fb0d4" }}>Home</button> / <b>{crumb}</b></div>
      <div className="kick">{kick}</div>
      <h1>{title}</h1>
      {sub && <p>{sub}</p>}
    </div></section>
  );
}

function Clima({ go, net, setNet }) {
  return (
    <>
      <PageHead go={go} crumb="Climatizzazione" kick="Comfort che fa la differenza"
        title="Climatizzatori Samsung chiavi in mano"
        sub="Aria pulita e salubre, funzionamento silenzioso, basso consumo e controllo smart Wi-Fi. Installazione professionale inclusa nel prezzo." />
      <section className="section"><div className="wrap">
        <Toggle on={net} set={setNet} />
        <div className="offers two">
          {climaKits.map((k, i) => {
            const show = net ? Math.round(k.price / 2) : k.price;
            return (
              <div className={"ocard" + (net ? " net" : "")} key={i}>
                <div className="oname">{k.name}</div>
                <div className="spec">{k.spec}</div>
                <div className="priceb">
                  <div className="pre">{net ? "Stima con detrazione" : "Prezzo chiavi in mano"}</div>
                  <div className="price">{eur(show)}<small>,00</small></div>
                </div>
                <ul>{climaIncl.map((p, j) => <li key={j}>{I.check}<span>{p}</span></li>)}</ul>
                <button className="btn btn-green" onClick={() => go("contatti")}>Richiedi preventivo {I.arrow}</button>
              </div>
            );
          })}
        </div>
        <p style={{ textAlign: "center", color: "var(--grigio)", marginTop: 20, fontSize: 14 }}>
          Prezzi riferiti a installazione standard. Soluzioni multisplit e su misura su richiesta.
        </p>
      </div></section>
      <Band go={go} title="Vuoi il clima perfetto in casa?" text="Garanzia ufficiale Samsung, installazione rapida e pulita, assistenza post-vendita dedicata." />
    </>
  );
}

function Fotovoltaico({ go, net, setNet }) {
  return (
    <>
      <PageHead go={go} crumb="Fotovoltaico" kick="Il sole lavora per te"
        title="Fotovoltaico con accumulo"
        sub="Energia pulita e rinnovabile, indipendenza energetica e bollette più basse. Produci di giorno, usi anche di notte grazie all'accumulo." />
      <section className="section"><div className="wrap">
        <Toggle on={net} set={setNet} />
        <div className="offers">{fvKits.map((k, i) => <OfferCard key={i} k={k} net={net} go={go} />)}</div>
      </div></section>
      <section className="section alt"><div className="wrap">
        <div className="sec-head"><div className="kick">Tutto incluso</div><h2>Zero pensieri, solo vantaggi</h2></div>
        <div className="why">
          {[["Certificazione di conformità", I.shield], ["Pratica ENEA inclusa", I.check], ["50% di recupero fiscale", I.euro],
          ["Finanziabile, 1ª rata dopo 4 mesi", I.wa], ["Rate su misura per te", I.bolt], ["Pratica veloce e semplice", I.tools]]
            .map((w, i) => <div className="wcard" key={i}><div className="wi">{w[1]}</div><div><h4>{w[0]}</h4></div></div>)}
        </div>
      </div></section>
      <Band go={go} title="Quasi la metà la recuperi" text="Un investimento che ti ripaga. Richiedi uno studio di fattibilità gratuito per la tua casa." />
    </>
  );
}

function Caldaie({ go }) {
  const blocks = [
    { t: "Caldaie & riscaldamento", items: ["Sostituzione caldaia con smaltimento del vecchio impianto", "Caldaie a condensazione e tradizionali", "Manutenzione e controllo combustione (bollino)", "Adeguamento canna fumaria e scarico condensa", "Impianti di riscaldamento completi"] },
    { t: "Impianti idraulici civili e industriali", items: ["Rifacimento e ristrutturazione impianti", "Ricerca perdite", "Sostituzione tubazioni", "Adeguamento impianti a norma", "Pronto intervento guasti e perdite"] },
  ];
  return (
    <>
      <PageHead go={go} crumb="Caldaie & Idraulica" kick="Termoidraulica a Roma"
        title="Caldaie, riscaldamento e idraulica"
        sub="Interventi rapidi, impianti a norma e massima efficienza energetica, per abitazioni, condomini e attività commerciali." />
      <section className="section"><div className="wrap" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 26 }}>
        {blocks.map((b, i) =>
          <div key={i}>
            <h2 style={{ color: "var(--notte)", fontSize: 26, marginBottom: 16 }}>{b.t}</h2>
            <ul className="incl">{b.items.map((x, j) => <li key={j}>{I.check}<span>{x}</span></li>)}</ul>
          </div>)}
      </div></section>
      <Band go={go} title="Caldaia in blocco? Perdita in casa?" text="Pronto intervento e preventivi chiari su Roma e provincia. Chiamaci, interveniamo in fretta." />
    </>
  );
}

function ChiSiamo({ go }) {
  return (
    <>
      <PageHead go={go} crumb="Chi siamo" kick="La nostra storia"
        title="Aleclima e Impianti"
        sub="Una realtà nata nel 2006 per diffondere un nuovo concetto di riscaldamento e climatizzazione." />
      <section className="section"><div className="wrap" style={{ maxWidth: 820 }}>
        <p style={{ fontSize: 18, color: "#33485e", marginBottom: 20 }}>
          Con oltre <b>30 anni di esperienza</b> nel settore, ci siamo distinti per la capacità di offrire prodotti e servizi
          che rispondono in modo efficace, innovativo e professionale alle esigenze sempre diverse dei nostri clienti.
        </p>
        <p style={{ fontSize: 18, color: "#33485e", marginBottom: 30 }}>
          Il nostro obiettivo è semplice: <b>consumare e consumare meglio</b>. Proponiamo climatizzatori inverter a pompa di calore,
          caldaie a condensazione e impianti fotovoltaici, perfetti per ridurre i consumi e investire in soluzioni utili,
          efficienti e rispettose dell'ambiente.
        </p>
        <div className="why">
          {[["Installazione certificata", "Impianti a norma con dichiarazione di conformità.", I.shield],
          ["Interventi rapidi a Roma", "Sopralluoghi veloci e assistenza tecnica qualificata.", I.bolt],
          ["Preventivi senza sorprese", "Costi trasparenti e consulenza personalizzata.", I.euro]]
            .map((w, i) => <div className="wcard" key={i}><div className="wi">{w[2]}</div><div><h4>{w[0]}</h4><p>{w[1]}</p></div></div>)}
        </div>
      </div></section>
      <Band go={go} title="Parliamo del tuo progetto" text="Dal sopralluogo all'installazione, seguiamo ogni fase con professionalità e materiali di alta qualità." />
    </>
  );
}

function Contatti({ go }) {
  const [f, setF] = useState({ nome: "", tel: "", email: "", servizio: "", msg: "", privacy: false });
  const [err, setErr] = useState({});
  const [sent, setSent] = useState(false);
  const set = (k, v) => { setF((p) => ({ ...p, [k]: v })); setErr((p) => ({ ...p, [k]: null })); };

  const submit = () => {
    const e = {};
    if (!f.nome.trim()) e.nome = "Inserisci il tuo nome";
    if (!/^[0-9 +]{6,}$/.test(f.tel.trim())) e.tel = "Inserisci un telefono valido";
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = "Inserisci un'email valida";
    if (!f.servizio) e.servizio = "Seleziona un servizio";
    if (!f.privacy) e.privacy = "Devi accettare l'informativa";
    setErr(e);
    if (Object.keys(e).length) return;

    /* PRODUZIONE — sostituire con:
       await supabase.from('lead_preventivi').insert({ ...f, fonte:'sito' });
       poi edge function che invia notifica (Resend / WhatsApp). */
    setSent(true);
  };

  const waText = encodeURIComponent(
    `Ciao Aleclima! Sono ${f.nome}. Vorrei un preventivo per: ${f.servizio || "—"}.\n${f.msg}\nTel: ${f.tel} · Email: ${f.email}`);

  return (
    <>
      <PageHead go={go} crumb="Contatti" kick="Siamo a Roma e provincia"
        title="Richiedi un preventivo gratuito"
        sub="Compila il modulo o contattaci direttamente: ti rispondiamo in fretta con una consulenza senza impegno." />
      <section className="section"><div className="wrap">
        <div className="cgrid">
          <div className="cbox">
            <h3>Contatti diretti</h3>
            <div className="crow"><div className="ci">{I.phone}</div><div><div className="ck">Assistenza</div><a className="cv" href={`tel:+${TEL_RAW}`}>{TEL}</a></div></div>
            <div className="crow"><div className="ci">{I.phone}</div><div><div className="ck">Ufficio</div><a className="cv" href="tel:+390686764589">06 86764589</a></div></div>
            <div className="crow"><div className="ci">{I.phone}</div><div><div className="ck">Area commerciale</div><div className="cv">349 1057331 · 347 3576208</div></div></div>
            <div className="crow"><div className="ci">{I.wa}</div><div><div className="ck">WhatsApp</div><a className="cv" href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer">347 9576619</a></div></div>
            <div className="crow"><div className="ci">{I.mail}</div><div><div className="ck">Email</div><a className="cv" href={`mailto:${EMAIL}`}>{EMAIL}</a></div></div>
            <div className="crow"><div className="ci">{I.pin}</div><div><div className="ck">Sede operativa</div><div className="cv">Via Casilina 2187, 00132 Roma</div></div></div>
            <div className="crow"><div className="ci">{I.pin}</div><div><div className="ck">Sede legale</div><div className="cv">Via Colle Pallone Nuovo 26, 00039 Zagarolo (RM)</div></div></div>
          </div>

          <div className="form">
            {sent ? (
              <div className="success">
                <div className="ok"><Ico d={<path d="M20 6 9 17l-5-5" />} s={30} c="#16A34A" /></div>
                <h3>Richiesta inviata!</h3>
                <p>Grazie {f.nome.split(" ")[0]}, ti ricontattiamo al più presto. Per fare prima, scrivici su WhatsApp.</p>
                <div className="s-cta">
                  <a className="btn btn-wa" href={`https://wa.me/${WA}?text=${waText}`} target="_blank" rel="noreferrer">{I.wa} Scrivi su WhatsApp</a>
                  <button className="btn btn-ghost" onClick={() => { setSent(false); setF({ nome: "", tel: "", email: "", servizio: "", msg: "", privacy: false }); }}>Nuova richiesta</button>
                </div>
              </div>
            ) : (
              <>
                <h3>Modulo preventivo</h3>
                <p className="fsub">Campi con <span style={{ color: "var(--verde)" }}>*</span> obbligatori.</p>
                <div className="frow">
                  <div className={"field" + (err.nome ? " err" : "")}>
                    <label>Nome e cognome <span className="req">*</span></label>
                    <input value={f.nome} onChange={(e) => set("nome", e.target.value)} placeholder="Mario Rossi" />
                    {err.nome && <div className="errmsg">{err.nome}</div>}
                  </div>
                  <div className={"field" + (err.tel ? " err" : "")}>
                    <label>Telefono <span className="req">*</span></label>
                    <input value={f.tel} onChange={(e) => set("tel", e.target.value)} placeholder="333 1234567" />
                    {err.tel && <div className="errmsg">{err.tel}</div>}
                  </div>
                </div>
                <div className={"field" + (err.email ? " err" : "")}>
                  <label>Email <span className="req">*</span></label>
                  <input value={f.email} onChange={(e) => set("email", e.target.value)} placeholder="nome@email.it" />
                  {err.email && <div className="errmsg">{err.email}</div>}
                </div>
                <div className={"field" + (err.servizio ? " err" : "")}>
                  <label>Di cosa hai bisogno? <span className="req">*</span></label>
                  <select value={f.servizio} onChange={(e) => set("servizio", e.target.value)}>
                    <option value="">Seleziona un servizio…</option>
                    <option>Climatizzazione</option>
                    <option>Fotovoltaico con accumulo</option>
                    <option>Caldaie e riscaldamento</option>
                    <option>Impianti idraulici</option>
                    <option>Pronto intervento</option>
                    <option>Altro</option>
                  </select>
                  {err.servizio && <div className="errmsg">{err.servizio}</div>}
                </div>
                <div className="field">
                  <label>Messaggio</label>
                  <textarea value={f.msg} onChange={(e) => set("msg", e.target.value)} placeholder="Raccontaci la tua esigenza, la zona e la metratura…" />
                </div>
                <div className="privacy">
                  <input type="checkbox" checked={f.privacy} onChange={(e) => set("privacy", e.target.checked)} />
                  <span>Ho letto l'informativa privacy e acconsento al trattamento dei dati per essere ricontattato. {err.privacy && <b style={{ color: "#dc2626" }}>— {err.privacy}</b>}</span>
                </div>
                <button className="btn btn-green" onClick={submit}>Invia richiesta {I.arrow}</button>
              </>
            )}
          </div>
        </div>
      </div></section>
    </>
  );
}

// ---------- shell ----------
export default function App() {
  const [page, setPage] = useState("home");
  const [open, setOpen] = useState(false);
  const [net, setNet] = useState(false);
  const go = (p) => { setPage(p); setOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };

  useEffect(() => { document.title = "Aleclima e Impianti — Clima, Fotovoltaico e Riscaldamento a Roma"; }, []);

  const nav = [["home", "Home"], ["clima", "Climatizzazione"], ["fotovoltaico", "Fotovoltaico"],
  ["caldaie", "Caldaie & Idraulica"], ["chisiamo", "Chi siamo"], ["contatti", "Contatti"]];

  return (
    <div className="al-root">
      <style>{CSS}</style>

      <div className="topbar"><div className="wrap">
        <div className="tb-l"><a href={`mailto:${EMAIL}`}>{I.mail} {EMAIL}</a></div>
        <div className="tb-r">
          <a href={`tel:+${TEL_RAW}`}>{I.phone} {TEL}</a>
          <a href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer">{I.wa} WhatsApp</a>
        </div>
      </div></div>

      <header className="nav"><div className="wrap">
        <button onClick={() => go("home")} style={{ background: "none" }}><Logo /></button>
        <nav className={"menu" + (open ? " open" : "")}>
          {nav.map(([p, l]) =>
            <button key={p} className={page === p || (page === "home" && p === "home") ? "on" : ""} onClick={() => go(p)}>{l}</button>)}
        </nav>
        <div className="nav-cta">
          <button className="btn btn-green burger-cta" onClick={() => go("contatti")}>Preventivo</button>
          <button className="burger" onClick={() => setOpen(!open)} aria-label="Menu"><span /><span /><span /></button>
        </div>
      </div></header>

      {page === "home" && <Home go={go} net={net} setNet={setNet} />}
      {page === "clima" && <Clima go={go} net={net} setNet={setNet} />}
      {page === "fotovoltaico" && <Fotovoltaico go={go} net={net} setNet={setNet} />}
      {page === "caldaie" && <Caldaie go={go} />}
      {page === "chisiamo" && <ChiSiamo go={go} />}
      {page === "contatti" && <Contatti go={go} />}

      <footer><div className="wrap">
        <div className="fgrid">
          <div>
            <Logo light />
            <p className="small" style={{ marginTop: 14 }}>
              Climatizzazione, fotovoltaico, caldaie e idraulica a Roma e provincia.<br />Consumare e consumare meglio.
            </p>
            <div className="fsoc">
              <a href="https://instagram.com/aleclimaeimpianti" target="_blank" rel="noreferrer">IG</a>
              <a href="https://facebook.com/share/1GqSGc1ccW/" target="_blank" rel="noreferrer">FB</a>
              <a href="https://tiktok.com/@aleclimaeimpianti" target="_blank" rel="noreferrer">TT</a>
              <a href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer">WA</a>
            </div>
          </div>
          <div>
            <h4>Servizi</h4>
            <ul>
              <li><button onClick={() => go("clima")}>Climatizzazione</button></li>
              <li><button onClick={() => go("fotovoltaico")}>Fotovoltaico</button></li>
              <li><button onClick={() => go("caldaie")}>Caldaie & Riscaldamento</button></li>
              <li><button onClick={() => go("caldaie")}>Idraulica</button></li>
            </ul>
          </div>
          <div>
            <h4>Azienda</h4>
            <ul>
              <li><button onClick={() => go("chisiamo")}>Chi siamo</button></li>
              <li><button onClick={() => go("contatti")}>Contatti</button></li>
              <li><a href={`tel:+${TEL_RAW}`}>{TEL}</a></li>
            </ul>
          </div>
          <div>
            <h4>Contatti</h4>
            <p className="small">
              Via Casilina 2187, 00132 Roma<br />
              Sede legale: Via Colle Pallone Nuovo 26, Zagarolo (RM)<br />
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a><br />
              Ufficio 06 86764589
            </p>
          </div>
        </div>
        <div className="fbot">
          <div>© 2026 Aleclima e Impianti S.r.l.s · P. IVA 15597681004</div>
          <div>Privacy · Cookie · Tutti i diritti riservati</div>
        </div>
      </div></footer>
    </div>
  );
}
