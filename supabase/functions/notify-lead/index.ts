import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_URL = "https://api.resend.com/emails";

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  schema: string;
  record: {
    id: string;
    created_at: string;
    nome: string;
    telefono: string;
    email: string;
    servizio: string;
    messaggio: string | null;
    privacy: boolean;
    fonte: string;
    stato: string;
    user_agent?: string;
  };
  old_record: any;
}

serve(async (req) => {
  // CORS support
  if (req.method === "OPTIONS") {
    return new Response("ok", { 
      headers: { 
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-secret",
      } 
    });
  }

  // Only allow POST
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    // 1. Verify Secret Shared Key
    const reqSecret = req.headers.get("x-webhook-secret");
    const systemSecret = Deno.env.get("WEBHOOK_SECRET");

    if (!systemSecret) {
      console.error("WEBHOOK_SECRET env variable is not set in Supabase Edge Function.");
      return new Response(JSON.stringify({ error: "Server misconfiguration" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (reqSecret !== systemSecret) {
      console.warn("Unauthorized webhook attempt. Secret header does not match.");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 2. Parse payload
    const payload: WebhookPayload = await req.json();
    
    if (payload.type !== "INSERT") {
      return new Response(JSON.stringify({ message: "Ignored non-insert event" }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    const lead = payload.record;
    if (!lead) {
      return new Response(JSON.stringify({ error: "Malformed payload record" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 3. Configure Resend variables
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const notifyTo = Deno.env.get("NOTIFY_TO") || "aleclimaimpiantisrls@gmail.com";
    const notifyFrom = Deno.env.get("NOTIFY_FROM");

    if (!resendApiKey) {
      console.error("RESEND_API_KEY secret is not configured.");
      return new Response(JSON.stringify({ error: "Resend integration not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (!notifyFrom) {
      console.error("NOTIFY_FROM secret is not configured.");
      return new Response(JSON.stringify({ error: "Sender email address not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 4. Send Email via Resend
    const emailSubject = `Nuovo preventivo dal sito — ${lead.servizio}`;
    const emailBody = `
      <h2>Nuovo Preventivo Ricevuto</h2>
      <p>Hai ricevuto una nuova richiesta di preventivo dal sito web ufficiale di <strong>Aleclima e Impianti</strong>.</p>
      
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 600px; font-family: sans-serif;">
        <tr style="background-color: #f2f6fb;">
          <th align="left" style="width: 30%;">Campo</th>
          <th align="left">Valore</th>
        </tr>
        <tr>
          <td><strong>Nome e cognome</strong></td>
          <td>${lead.nome}</td>
        </tr>
        <tr>
          <td><strong>Telefono</strong></td>
          <td><a href="tel:${lead.telefono}">${lead.telefono}</a></td>
        </tr>
        <tr>
          <td><strong>Email</strong></td>
          <td><a href="mailto:${lead.email}">${lead.email}</a></td>
        </tr>
        <tr>
          <td><strong>Servizio</strong></td>
          <td><strong>${lead.servizio}</strong></td>
        </tr>
        <tr>
          <td><strong>Data inserimento</strong></td>
          <td>${new Date(lead.created_at).toLocaleString("it-IT", { timeZone: "Europe/Rome" })}</td>
        </tr>
        <tr>
          <td><strong>Messaggio</strong></td>
          <td>${lead.messaggio ? lead.messaggio.replace(/\n/g, "<br>") : "<em>Nessun messaggio inserito</em>"}</td>
        </tr>
        <tr>
          <td><strong>Fonte</strong></td>
          <td>${lead.fonte}</td>
        </tr>
        <tr>
          <td><strong>Stato iniziale</strong></td>
          <td>${lead.stato}</td>
        </tr>
        <tr>
          <td><strong>User Agent</strong></td>
          <td style="font-size: 11px; color: #5a6b7b;">${lead.user_agent || "N/A"}</td>
        </tr>
      </table>
      
      <p style="margin-top: 20px; font-size: 12px; color: #5a6b7b;">
        Questo messaggio è stato generato automaticamente in seguito ad un inserimento nel database del sito.
      </p>
    `;

    const resendResponse = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: `Aleclima Preventivi <${notifyFrom}>`,
        to: [notifyTo],
        subject: emailSubject,
        html: emailBody
      })
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error(`Resend API Error (HTTP ${resendResponse.status}):`, errorText);
      return new Response(JSON.stringify({ error: `Resend API failed: ${errorText}` }), {
        status: 502,
        headers: { "Content-Type": "application/json" }
      });
    }

    const resendData = await resendResponse.json();
    return new Response(JSON.stringify({ success: true, resendId: resendData.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err: any) {
    console.error("Unhandled edge function error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});
