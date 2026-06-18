import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { DetrazioneProvider } from "./components/shared/DetrazioneContext";
import { Home } from "./pages/Home";
import { Climatizzazione } from "./pages/Climatizzazione";
import { Fotovoltaico } from "./pages/Fotovoltaico";
import { CaldaieIdraulica } from "./pages/CaldaieIdraulica";
import { ChiSiamo } from "./pages/ChiSiamo";
import { Contatti } from "./pages/Contatti";
import { FloatingWhatsApp } from "./components/shared/FloatingWhatsApp";
import "./App.css";

// Scroll Reset Component
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as any });
  }, [pathname]);

  return null;
};

const Layout: React.FC = () => {
  return (
    <div className="al-root">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/climatizzazione" element={<Climatizzazione />} />
          <Route path="/fotovoltaico" element={<Fotovoltaico />} />
          <Route path="/caldaie-idraulica" element={<CaldaieIdraulica />} />
          <Route path="/chi-siamo" element={<ChiSiamo />} />
          <Route path="/contatti" element={<Contatti />} />
          <Route path="*" element={<Home />} /> {/* Fallback route */}
        </Routes>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default function App() {
  return (
    <DetrazioneProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Layout />
      </BrowserRouter>
    </DetrazioneProvider>
  );
}
