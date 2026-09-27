import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { CaldaieIdraulica } from "@/components/pages/CaldaieIdraulica";

export const metadata: Metadata = pageMeta(
  "Caldaie, riscaldamento e idraulica a Roma \u2014 Aleclima e Impianti",
  "Installazione e sostituzione caldaie a condensazione, manutenzione, bollino e impianti idraulici civili e industriali a Roma. Pronto intervento.",
  "/caldaie-idraulica"
);

export default function Page() {
  return <CaldaieIdraulica />;
}
