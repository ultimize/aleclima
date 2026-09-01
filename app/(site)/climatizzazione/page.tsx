import type { Metadata } from "next";
import { Climatizzazione } from "@/components/pages/Climatizzazione";

export const metadata: Metadata = {
  title: { absolute: "Climatizzatori Samsung a Roma \u2014 Installazione chiavi in mano | Aleclima" },
  description: "Climatizzatori Samsung 9.000 e 12.000 BTU installati a regola d'arte a Roma e provincia. Prezzo chiavi in mano, certificazione di legge e detrazione fiscale.",
  alternates: { canonical: "/climatizzazione" },
  openGraph: {
    title: "Climatizzatori Samsung a Roma \u2014 Installazione chiavi in mano | Aleclima",
    description: "Climatizzatori Samsung 9.000 e 12.000 BTU installati a regola d'arte a Roma e provincia. Prezzo chiavi in mano, certificazione di legge e detrazione fiscale.",
    url: "/climatizzazione",
  },
};

export default function Page() {
  return <Climatizzazione />;
}
