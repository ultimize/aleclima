import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const LOCATION_ID = "0xDsSoPWzkunXMmuAcVI";
const HL_BASE = "https://services.leadconnectorhq.com";
const VERSION = "2021-07-28";

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const PIT = Deno.env.get("HL_PIT");
  const FORWARD_SECRET = Deno.env.get("FORWARD_SECRET");

  if (FORWARD_SECRET && req.headers.get("x-forward-secret") !== FORWARD_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!PIT) {
    console.error("Missing HL_PIT secret");
    return new Response(JSON.stringify({ ok: false, error: "missing HL_PIT" }), { status: 500 });
  }

  let payload: any;
  try { payload = await req.json(); } catch { return new Response("Bad JSON", { status: 400 }); }
  const r = payload.record ?? payload;

  const fullName = String(r.nome ?? "").trim();
  const parts = fullName.split(/\s+/).filter(Boolean);
  const firstName = parts[0] ?? "";
  const lastName = parts.slice(1).join(" ");
  let phone = String(r.telefono ?? "").replace(/\s+/g, "");
  if (phone && !phone.startsWith("+") && /^3\d{7,}$/.test(phone)) phone = "+39" + phone;

  const headers = {
    "Authorization": `Bearer ${PIT}`,
    "Version": VERSION,
    "Content-Type": "application/json",
    "Accept": "application/json",
  };

  const upsertRes = await fetch(`${HL_BASE}/contacts/upsert`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      locationId: LOCATION_ID,
      name: fullName || undefined,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      email: r.email || undefined,
      phone: phone || undefined,
      source: "Sito web Aleclima",
      tags: [r.servizio, "sito-web"].filter(Boolean),
    }),
  });
  const upsertBody = await upsertRes.json().catch(() => ({}));
  if (!upsertRes.ok) {
    console.error("HL upsert error", upsertRes.status, JSON.stringify(upsertBody));
    return new Response(JSON.stringify({ ok: false, step: "upsert", status: upsertRes.status, body: upsertBody }), { status: 502, headers: { "Content-Type": "application/json" } });
  }
  const contactId = upsertBody?.contact?.id ?? upsertBody?.id;

  if (contactId && (r.messaggio || r.servizio)) {
    await fetch(`${HL_BASE}/contacts/${contactId}/notes`, {
      method: "POST",
      headers,
      body: JSON.stringify({ body: `Servizio richiesto: ${r.servizio ?? "-"}\nMessaggio: ${r.messaggio ?? "-"}\nFonte: sito web aleclima` }),
    }).catch((e) => console.error("HL note error", e));
  }

  return new Response(JSON.stringify({ ok: true, contactId }), { status: 200, headers: { "Content-Type": "application/json" } });
});
