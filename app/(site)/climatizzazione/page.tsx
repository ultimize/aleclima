import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { Climatizzazione } from "@/components/pages/Climatizzazione";

export const metadata: Metadata = pageMeta(
  "Climatizzatori Samsung a Roma \u2014 Installazione chiavi in mano | Aleclima",
  "Climatizzatori Samsung 9.000 e 12.000 BTU installati a regola d'arte a Roma e provincia. Prezzo chiavi in mano, certificazione di legge e detrazione fiscale.",
  "/climatizzazione"
);

export default function Page() {
  return <Climatizzazione />;
}
