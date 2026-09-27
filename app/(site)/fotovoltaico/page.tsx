import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { Fotovoltaico } from "@/components/pages/Fotovoltaico";

export const metadata: Metadata = pageMeta(
  "Fotovoltaico con accumulo a Roma da \u20ac 5.690 | Aleclima e Impianti",
  "Impianti fotovoltaici con accumulo chiavi in mano a Roma e provincia. Detrazione 50%, pratica ENEA inclusa e finanziamento con prima rata dopo 4 mesi.",
  "/fotovoltaico"
);

export default function Page() {
  return <Fotovoltaico />;
}
