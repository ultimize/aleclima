import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { Contatti } from "@/components/pages/Contatti";

export const metadata: Metadata = pageMeta(
  "Contatti e preventivo gratuito \u2014 Aleclima e Impianti Roma",
  "Richiedi un preventivo gratuito a Roma e provincia. Chiama 352 283 8561, scrivi su WhatsApp o compila il form: ti ricontattiamo subito.",
  "/contatti"
);

export default function Page() {
  return <Contatti />;
}
