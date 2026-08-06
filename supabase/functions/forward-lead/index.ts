import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const LOCATION_ID = Deno.env.get("HL_LOCATION_ID") ?? "0xDsSoPWzkunXMmuAcVI";
const HL_BASE = "https://services.leadconnectorhq.com";
const VERSION = "2021-07-28";

const SB_URL = Deno.env.get("SUPABASE_URL");
const SB_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

/** Scrive l'esito della consegna sulla riga del lead. Non deve mai far fallire il flusso. */
async function markLead(id: string | undefined, patch: Record<string, unknown>) {
  if (!id || !SB_URL || !SB_KEY) {
    console.warn("markLead saltato: id o credenziali service role mancanti");
    return;
  }
  try {
    const res = await fetch(`${SB_URL}/rest/v1/lead_preventivi?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: {
        "apikey": SB_KEY,
        "Authorization": `Bearer ${SB_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
      },
      body: JSON.stringify(patch),
    });
    if (!res.ok) console.error("markLead HTTP", res.status, await res.text());
  } catch (e) {
    console.error("markLead exception", e);
  }
}

/** Inoltra il lead a notify-lead (email via Resend). Fire-and-forget, non blocca la risposta. */
async function notifyLead(record: Record<string, unknown>): Promise<{ ok: boolean; error?: string }> {
  if (!SB_URL) return { ok: false, error: "SUPABASE_URL mancante" };
  const secret = Deno.env.get("WEBHOOK_SECRET");
  if (!secret) return { ok: false, error: "WEBHOOK_SECRET non configurato" };
  try {
    const res = await fetch(`${SB_URL}/functions/v1/notify-lead`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-webhook-secret": secret,
        ...(SB_KEY ? { "Authorization": `Bearer ${SB_KEY}` } : {}),
      },
      body: JSON.stringify({
        type: "INSERT",
        table: "lead_preventivi",
        schema: "public",
        record,
        old_record: null,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error("notify-lead error", res.status, body);
      return { ok: false, error: `HTTP ${res.status}: ${body}`.slice(0, 500) };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e).slice(0, 500) };
  }
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const PIT = Deno.env.get("HL_PIT");
  const FORWARD_SECRET = Deno.env.get("FORWARD_SECRET");

  if (FORWARD_SECRET && req.headers.get("x-forward-secret") !== FORWARD_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  let payload: any;
  try { payload = await req.json(); } catch { return new Response("Bad JSON", { status: 400 }); }
  const r = payload.record ?? payload;
  const leadId: string | undefined = r?.id;

  if (!PIT) {
    console.error("Missing HL_PIT secret");
    await markLead(leadId, { hl_status: "error", hl_error: "HL_PIT non configurato", hl_sent_at: new Date().toISOString() });
    return new Response(JSON.stringify({ ok: false, error: "missing HL_PIT" }), { status: 500 });
  }

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

  let upsertRes: Response;
  try {
    upsertRes = await fetch(`${HL_BASE}/contacts/upsert`, {
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
  } catch (e) {
    const msg = `fetch fallita: ${String(e)}`.slice(0, 500);
    console.error("HL upsert exception", e);
    await markLead(leadId, { hl_status: "error", hl_error: msg, hl_sent_at: new Date().toISOString() });
    return new Response(JSON.stringify({ ok: false, step: "upsert", error: msg }), { status: 502, headers: { "Content-Type": "application/json" } });
  }

  const upsertBody = await upsertRes.json().catch(() => ({}));
  if (!upsertRes.ok) {
    console.error("HL upsert error", upsertRes.status, JSON.stringify(upsertBody));
    await markLead(leadId, {
      hl_status: "error",
      hl_error: `HTTP ${upsertRes.status}: ${JSON.stringify(upsertBody)}`.slice(0, 500),
      hl_sent_at: new Date().toISOString(),
    });
    return new Response(JSON.stringify({ ok: false, step: "upsert", status: upsertRes.status, body: upsertBody }), { status: 502, headers: { "Content-Type": "application/json" } });
  }

  const contactId = upsertBody?.contact?.id ?? upsertBody?.id ?? null;

  if (contactId && (r.messaggio || r.servizio)) {
    await fetch(`${HL_BASE}/contacts/${contactId}/notes`, {
      method: "POST",
      headers,
      body: JSON.stringify({ body: `Servizio richiesto: ${r.servizio ?? "-"}\nMessaggio: ${r.messaggio ?? "-"}\nFonte: sito web aleclima` }),
    }).catch((e) => console.error("HL note error", e));
  }

  const notify = await notifyLead(r);

  await markLead(leadId, {
    hl_status: "ok",
    hl_contact_id: contactId,
    hl_error: null,
    hl_sent_at: new Date().toISOString(),
    notify_status: notify.ok ? "ok" : "error",
    notify_error: notify.ok ? null : notify.error,
  });

  return new Response(JSON.stringify({ ok: true, contactId, notify }), { status: 200, headers: { "Content-Type": "application/json" } });
});
