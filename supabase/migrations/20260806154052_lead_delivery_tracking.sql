-- Tracciamento della consegna dei lead verso GoHighLevel e della notifica email.
-- La edge function `forward-lead` popola queste colonne con il service role key.

alter table public.lead_preventivi
  add column if not exists hl_status     text,
  add column if not exists hl_contact_id text,
  add column if not exists hl_error      text,
  add column if not exists hl_sent_at    timestamptz,
  add column if not exists notify_status text,
  add column if not exists notify_error  text;

comment on column public.lead_preventivi.hl_status     is 'Esito invio a GoHighLevel: pending | ok | error';
comment on column public.lead_preventivi.hl_contact_id is 'ID del contatto creato/aggiornato su GoHighLevel';
comment on column public.lead_preventivi.hl_error      is 'Dettaglio errore se hl_status = error';
comment on column public.lead_preventivi.hl_sent_at    is 'Quando la edge function ha chiuso il tentativo verso GoHighLevel';
comment on column public.lead_preventivi.notify_status is 'Esito email di notifica (notify-lead): ok | error';
comment on column public.lead_preventivi.notify_error  is 'Dettaglio errore se notify_status = error';

create index if not exists idx_lead_preventivi_hl_status
  on public.lead_preventivi (hl_status)
  where hl_status is distinct from 'ok';

-- i lead nuovi partono da 'pending': se restano pending, il trigger o la function non hanno lavorato
alter table public.lead_preventivi alter column hl_status set default 'pending';

-- vista rapida dei lead non consegnati a GoHighLevel
create or replace view public.lead_non_consegnati as
  select id, created_at, nome, telefono, email, servizio, hl_status, hl_error, hl_sent_at, notify_status, notify_error
  from public.lead_preventivi
  where hl_status is distinct from 'ok'
  order by created_at desc;
