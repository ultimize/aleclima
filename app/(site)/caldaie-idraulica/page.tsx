import type { Metadata } from "next";
import { CaldaieIdraulica } from "@/components/pages/CaldaieIdraulica";

export const metadata: Metadata = {
  title: { absolute: "Caldaie, riscaldamento e idraulica a Roma \u2014 Aleclima e Impianti" },
  description: "Installazione e sostituzione caldaie a condensazione, manutenzione, bollino e impianti idraulici civili e industriali a Roma. Pronto intervento.",
  alternates: { canonical: "/caldaie-idraulica" },
  openGraph: {
    title: "Caldaie, riscaldamento e idraulica a Roma \u2014 Aleclima e Impianti",
    description: "Installazione e sostituzione caldaie a condensazione, manutenzione, bollino e impianti idraulici civili e industriali a Roma. Pronto intervento.",
    url: "/caldaie-idraulica",
  },
};

export default function Page() {
  return <CaldaieIdraulica />;
}
