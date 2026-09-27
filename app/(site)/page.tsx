import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { Home } from "@/components/pages/Home";

export const metadata: Metadata = pageMeta(
  "Aleclima e Impianti \u2014 Clima, Fotovoltaico e Riscaldamento a Roma",
  "Climatizzatori, fotovoltaico con accumulo, caldaie e idraulica a Roma e provincia. Installazione chiavi in mano, detrazione 50% e preventivo gratuito.",
  "/"
);

export default function Page() {
  return <Home />;
}
