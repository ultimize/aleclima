import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export default async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Tutte le rotte tranne asset statici e immagini.
     * Serve anche fuori da /admin per tenere viva la sessione.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|webmanifest|xml|txt)$).*)",
  ],
};
