import type { Metadata } from "next";
import { Fotovoltaico } from "@/components/pages/Fotovoltaico";

export const metadata: Metadata = {
  title: { absolute: "Fotovoltaico con accumulo a Roma da \u20ac 5.690 | Aleclima e Impianti" },
  description: "Impianti fotovoltaici con accumulo chiavi in mano a Roma e provincia. Detrazione 50%, pratica ENEA inclusa e finanziamento con prima rata dopo 4 mesi.",
  alternates: { canonical: "/fotovoltaico" },
  openGraph: {
    title: "Fotovoltaico con accumulo a Roma da \u20ac 5.690 | Aleclima e Impianti",
    description: "Impianti fotovoltaici con accumulo chiavi in mano a Roma e provincia. Detrazione 50%, pratica ENEA inclusa e finanziamento con prima rata dopo 4 mesi.",
    url: "/fotovoltaico",
  },
};

export default function Page() {
  return <Fotovoltaico />;
}
