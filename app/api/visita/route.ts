import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Registra una visualizzazione di pagina.
 *
 * Non salviamo nulla che identifichi il visitatore: niente IP, niente cookie,
 * niente identificatore di sessione. Solo il percorso, il dominio da cui si
 * arriva e se e' mobile o desktop. Per questo non serve consenso.
 */

export const runtime = "nodejs";

const BOT = /bot|crawl|spider|slurp|bingpreview|headless|lighthouse|pingdom|monitor|curl|wget|python-requests|axios|facebookexternalhit|whatsapp|telegram|preview/i;

function dispositivo(ua: string): "mobile" | "desktop" | "altro" {
  if (/mobile|android|iphone|ipad|ipod/i.test(ua)) return "mobile";
  if (/windows|macintosh|linux|cros/i.test(ua)) return "desktop";
  return "altro";
}

/** Solo il dominio della provenienza: l'URL completo non ci serve e sarebbe piu' invasivo. */
function host(referrer: string | undefined, proprio: string): string | null {
  if (!referrer) return null;
  try {
    const h = new URL(referrer).hostname.replace(/^www\./, "");
    return h === proprio.replace(/^www\./, "") ? null : h;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ ok: false }, { status: 204 });

  const ua = req.headers.get("user-agent") ?? "";
  if (BOT.test(ua)) return NextResponse.json({ ok: true, saltato: "bot" });

  let body: { percorso?: string; referrer?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const percorso = (body.percorso ?? "").trim();
  // solo percorsi interni, e mai l'area riservata
  if (!percorso.startsWith("/") || percorso.startsWith("//")) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (percorso.startsWith("/admin") || percorso.startsWith("/api")) {
    return NextResponse.json({ ok: true, saltato: "interno" });
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const { error } = await supabase.from("visite").insert({
    percorso: percorso.slice(0, 300),
    referrer_host: host(body.referrer, req.nextUrl.hostname),
    dispositivo: dispositivo(ua),
  });

  if (error) console.error("[visite]", error.message);
  return NextResponse.json({ ok: !error });
}
