"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "../shared/Logo";
import { I } from "../shared/Icons";

const EMAIL = "aleclimaimpiantisrls@gmail.com";
const TEL = "352 283 8561";
const TEL_RAW = "393522838561";
const WA = "393479576619";

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on page navigation
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/climatizzazione", label: "Climatizzazione" },
    { path: "/fotovoltaico", label: "Fotovoltaico" },
    { path: "/caldaie-idraulica", label: "Caldaie & Idraulica" },
    { path: "/blog", label: "Blog" },
    { path: "/chi-siamo", label: "Chi siamo" },
    { path: "/contatti", label: "Contatti" }
  ];

  return (
    <>
      <div className="topbar">
        <div className="wrap">
          <div className="tb-l">
            <a href={`mailto:${EMAIL}`}>
              {I.mail} {EMAIL}
            </a>
          </div>
          <div className="tb-r">
            <a href={`tel:+${TEL_RAW}`}>
              {I.phone} {TEL}
            </a>
            <a href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer">
              {I.wa} WhatsApp
            </a>
          </div>
        </div>
      </div>

      <header className="nav">
        <div className="wrap">
          <Link href="/" className="logo">
            <Logo />
          </Link>
          
          <nav className={`menu${isOpen ? " open" : ""}`}>
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                href={path}
                className={pathname === path ? "on" : ""}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="nav-cta">
            <Link href="/contatti" className="btn btn-green burger-cta">
              Preventivo
            </Link>
            <button 
              className="burger" 
              onClick={() => setIsOpen(!isOpen)} 
              aria-label="Menu"
              type="button"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
