-- Consenso marketing facoltativo e separato dal modulo contatti (art. 7 GDPR)
alter table public.lead_preventivi
  add column if not exists marketing boolean not null default false;
