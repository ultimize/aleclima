import type { Metadata } from "next";
import { Contatti } from "@/components/pages/Contatti";

export const metadata: Metadata = {
  title: { absolute: "Contatti e preventivo gratuito \u2014 Aleclima e Impianti Roma" },
  description: "Richiedi un preventivo gratuito a Roma e provincia. Chiama 352 283 8561, scrivi su WhatsApp o compila il form: ti ricontattiamo subito.",
  alternates: { canonical: "/contatti" },
  openGraph: {
    title: "Contatti e preventivo gratuito \u2014 Aleclima e Impianti Roma",
    description: "Richiedi un preventivo gratuito a Roma e provincia. Chiama 352 283 8561, scrivi su WhatsApp o compila il form: ti ricontattiamo subito.",
    url: "/contatti",
  },
};

export default function Page() {
  return <Contatti />;
}
