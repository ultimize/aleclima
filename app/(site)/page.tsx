import type { Metadata } from "next";
import { Home } from "@/components/pages/Home";

export const metadata: Metadata = {
  title: { absolute: "Aleclima e Impianti \u2014 Clima, Fotovoltaico e Riscaldamento a Roma" },
  description: "Climatizzatori, fotovoltaico con accumulo, caldaie e idraulica a Roma e provincia. Installazione chiavi in mano, detrazione 50% e preventivo gratuito.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Aleclima e Impianti \u2014 Clima, Fotovoltaico e Riscaldamento a Roma",
    description: "Climatizzatori, fotovoltaico con accumulo, caldaie e idraulica a Roma e provincia. Installazione chiavi in mano, detrazione 50% e preventivo gratuito.",
    url: "/",
  },
};

export default function Page() {
  return <Home />;
}
