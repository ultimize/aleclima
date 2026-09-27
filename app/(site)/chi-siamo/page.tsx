import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { ChiSiamo } from "@/components/pages/ChiSiamo";

export const metadata: Metadata = pageMeta(
  "Chi siamo \u2014 Aleclima e Impianti, dal 2006 a Roma",
  "Dal 2006 al fianco di famiglie e aziende a Roma e provincia: climatizzazione, fotovoltaico, caldaie e idraulica. Consumare e consumare meglio.",
  "/chi-siamo"
);

export default function Page() {
  return <ChiSiamo />;
}
