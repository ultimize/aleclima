"use client";

import React, { useState, useEffect, useCallback } from "react";
import { EVENTO_CONSENSO } from "@/components/shared/Clarity";
import { getSupabase } from "@/lib/supabase/browser";

const COOKIE_NAME = "aleclima_cookie_consent";

// Helper functions for Cookie management
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop()?.split(";").shift() || "");
  return null;
};

const setCookie = (name: string, value: string, days: number) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `; expires=${date.toUTCString()}`;
  const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Lax${secure}`;
};

const eraseCookie = (name: string) => {
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
};

const generateUuid = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const CookieConsent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [consentId, setConsentId] = useState("");
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize consent state on mount
  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_NAME) || getCookie(COOKIE_NAME);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConsentId(parsed.consent_id || "");
        setAnalytics(!!parsed.analytics);
        setMarketing(!!parsed.marketing);
        
        // Update Google Consent Mode v2 with saved settings
        if (typeof window !== "undefined" && (window as any).gtag) {
          (window as any).gtag("consent", "update", {
            ad_storage: parsed.marketing ? "granted" : "denied",
            ad_user_data: parsed.marketing ? "granted" : "denied",
            ad_personalization: parsed.marketing ? "granted" : "denied",
            analytics_storage: parsed.analytics ? "granted" : "denied",
          });
        }
      } catch (e) {
        console.error("Error parsing cookie consent", e);
        setIsOpen(true);
      }
    } else {
      setIsOpen(true);
    }
    setIsInitialized(true);

    // Event listener for opening preferences modal from Footer
    const handleOpenPrefs = () => {
      setShowPreferences(true);
    };
    window.addEventListener("aleclima:cookie", handleOpenPrefs);

    return () => {
      window.removeEventListener("aleclima:cookie", handleOpenPrefs);
    };
  }, []);

  const saveConsent = useCallback(
    async (analyticsVal: boolean, marketingVal: boolean, action: "accept_all" | "reject_all" | "custom") => {
      const id = consentId || generateUuid();
      const payload = {
        necessary: true,
        analytics: analyticsVal,
        marketing: marketingVal,
        consent_id: id,
      };

      const payloadStr = JSON.stringify(payload);
      localStorage.setItem(COOKIE_NAME, payloadStr);
      setCookie(COOKIE_NAME, payloadStr, 365);
      // fa partire Clarity appena l'utente accetta le statistiche
      window.dispatchEvent(new Event(EVENTO_CONSENSO));

      setConsentId(id);
      setAnalytics(analyticsVal);
      setMarketing(marketingVal);

      // Update Google Consent Mode v2
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("consent", "update", {
          ad_storage: marketingVal ? "granted" : "denied",
          ad_user_data: marketingVal ? "granted" : "denied",
          ad_personalization: marketingVal ? "granted" : "denied",
          analytics_storage: analyticsVal ? "granted" : "denied",
        });
      }

      // Write to Supabase DB (WITHOUT .select() to prevent RLS errors)
      try {
        await getSupabase().from("cookie_consents").insert({
          consent_id: id,
          necessary: true,
          analytics: analyticsVal,
          marketing: marketingVal,
          user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
          page_url: typeof window !== "undefined" ? window.location.href : null,
          action: action,
        });
      } catch (err) {
        console.error("Error writing cookie consent to Supabase:", err);
      }

      setIsOpen(false);
      setShowPreferences(false);
    },
    [consentId]
  );

  const handleAcceptAll = () => {
    saveConsent(true, true, "accept_all");
  };

  const handleRejectAll = () => {
    saveConsent(false, false, "reject_all");
  };

  const handleSavePreferences = () => {
    saveConsent(analytics, marketing, "custom");
  };

  const handleWithdrawConsent = async () => {
    if (consentId) {
      try {
        await getSupabase().from("cookie_consents").delete().eq("consent_id", consentId);
      } catch (err) {
        console.error("Error deleting cookie consent from Supabase:", err);
      }
    }

    localStorage.removeItem(COOKIE_NAME);
    eraseCookie(COOKIE_NAME);

    setConsentId("");
    setAnalytics(false);
    setMarketing(false);
    
    // Reset Consent Mode to denied
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "denied",
      });
    }

    setShowPreferences(false);
    setIsOpen(true);
  };

  if (!isInitialized) return null;

  return (
    <>
      {/* 1. COMPACT COOKIE BANNER */}
      {isOpen && (
        <div className="cc-banner">
          <div className="cc-card">
            <div className="cc-body">
              <h3>Informativa sui Cookie</h3>
              <p>
                Questo Sito utilizza alcuni tipi di cookie tecnici necessari per il corretto funzionamento dello stesso, 
                nonché cookie statistici (Google Analytics) e di profilazione, anche di terze parti, per migliorare la tua 
                esperienza e inviarti pubblicità in linea con le tue preferenze. Se vuoi saperne di più consulta la{" "}
                <a href="/privacy-policy">Privacy Policy</a> e la <a href="/cookie-policy">Cookie Policy</a>. 
                Puoi accettare tutti i cookie, rifiutare quelli non necessari o personalizzare le tue scelte.
              </p>
            </div>
            <div className="cc-actions">
              <button className="btn btn-green" onClick={handleAcceptAll}>
                Accetta tutti
              </button>
              <button className="btn btn-ghost" onClick={handleRejectAll}>
                Rifiuta non necessari
              </button>
              <button className="cc-link" onClick={() => setShowPreferences(true)}>
                Personalizza
              </button>
              <a
                href="https://www.adevolution.eu/"
                target="_blank"
                rel="noopener noreferrer"
                className="cc-powered"
              >
                <span>Powered by</span>
                <img src="/adevolution.svg" alt="ADevolution Logo" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 2. PREFERENCES MODAL OVERLAY */}
      {showPreferences && (
        <div className="cc-overlay">
          <div className="cc-modal">
            <button className="cc-close" onClick={() => setShowPreferences(false)}>
              &times;
            </button>
            <h3>Preferenze Cookie</h3>
            <p className="cc-sub">
              Personalizza le tue preferenze sull'utilizzo dei cookie. I cookie necessari sono essenziali per il funzionamento del sito.
            </p>

            <div className="cc-cat">
              <div className="cc-cat-top">
                <div>
                  <strong>Cookie Necessari</strong>
                  <span>Sempre attivi</span>
                </div>
                <button className="cc-switch on disabled" disabled>
                  <i></i>
                </button>
              </div>
              <p>
                Questi cookie sono indispensabili per le funzionalità di base del sito, come la navigazione sicura, la gestione 
                delle sessioni e le preferenze. Senza di essi il sito non potrebbe funzionare correttamente.
              </p>
            </div>

            <div className="cc-cat">
              <div className="cc-cat-top">
                <div>
                  <strong>Cookie Statistici (Google Analytics)</strong>
                  <span>{analytics ? "Attivi" : "Disattivi"}</span>
                </div>
                <button
                  className={`cc-switch ${analytics ? "on" : ""}`}
                  onClick={() => setAnalytics(!analytics)}
                >
                  <i></i>
                </button>
              </div>
              <p>
                Ci aiutano a capire come i visitatori interagiscono con il sito raccogliendo informazioni in forma anonima e aggregata 
                (pagine visitate, tempo di permanenza, fonti di traffico).
              </p>
            </div>

            <div className="cc-cat">
              <div className="cc-cat-top">
                <div>
                  <strong>Cookie di Profilazione e Marketing</strong>
                  <span>{marketing ? "Attivi" : "Disattivi"}</span>
                </div>
                <button
                  className={`cc-switch ${marketing ? "on" : ""}`}
                  onClick={() => setMarketing(!marketing)}
                >
                  <i></i>
                </button>
              </div>
              <p>
                Vengono utilizzati per tracciare la navigazione dell'utente per scopi pubblicitari, ad esempio per mostrare annunci 
                rilevanti su piattaforme esterne come Google o Meta.
              </p>
            </div>

            {/* Display Consent ID and Revocation option if consent has been saved */}
            {consentId && (
              <div className="cc-id">
                <div>
                  <span className="cc-id-k">ID consenso</span>
                  <span className="cc-id-v">{consentId}</span>
                </div>
                <button className="cc-withdraw" onClick={handleWithdrawConsent}>
                  Elimina i miei consensi
                </button>
              </div>
            )}

            <div className="cc-foot">
              <div className="cc-links">
                <a href="/privacy-policy" onClick={() => setShowPreferences(false)}>
                  Privacy Policy
                </a>
                {" · "}
                <a href="/cookie-policy" onClick={() => setShowPreferences(false)}>
                  Cookie Policy
                </a>
              </div>
              <a
                href="https://www.adevolution.eu/"
                target="_blank"
                rel="noopener noreferrer"
                className="cc-powered"
              >
                <span>Powered by</span>
                <img src="/adevolution.svg" alt="ADevolution Logo" />
              </a>
            </div>

            <div className="cc-actions-modal" style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
              <button className="btn btn-green" style={{ flex: 1 }} onClick={handleSavePreferences}>
                Salva preferenze
              </button>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={handleAcceptAll}>
                Accetta tutti
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
