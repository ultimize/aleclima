import type { Metadata } from "next";
import { ChiSiamo } from "@/components/pages/ChiSiamo";

export const metadata: Metadata = {
  title: { absolute: "Chi siamo \u2014 Aleclima e Impianti, dal 2006 a Roma" },
  description: "Dal 2006 al fianco di famiglie e aziende a Roma e provincia: climatizzazione, fotovoltaico, caldaie e idraulica. Consumare e consumare meglio.",
  alternates: { canonical: "/chi-siamo" },
  openGraph: {
    title: "Chi siamo \u2014 Aleclima e Impianti, dal 2006 a Roma",
    description: "Dal 2006 al fianco di famiglie e aziende a Roma e provincia: climatizzazione, fotovoltaico, caldaie e idraulica. Consumare e consumare meglio.",
    url: "/chi-siamo",
  },
};

export default function Page() {
  return <ChiSiamo />;
}
