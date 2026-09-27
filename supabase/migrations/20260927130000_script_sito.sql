-- Script del sito (Analytics, Clarity, pixel...) e codici di verifica,
-- gestiti da admin > Script del sito. Piu' il permesso di eliminare richieste.

create table if not exists public.script_sito (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null,
  posizione  text not null check (posizione in ('head', 'body', 'footer')),
  categoria  text not null check (categoria in ('necessari', 'statistiche', 'marketing')),
  codice     text not null,
  attivo     boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.script_sito enable row level security;

comment on column public.script_sito.categoria is 'Categoria cookie: statistiche e marketing partono solo dopo il consenso';

drop policy if exists "pubblico legge script attivi" on public.script_sito;
create policy "pubblico legge script attivi"
  on public.script_sito for select to anon, authenticated
  using (attivo);

drop policy if exists "redazione gestisce script" on public.script_sito;
create policy "redazione gestisce script"
  on public.script_sito for all to authenticated
  using (true) with check (true);

-- codici di verifica (Search Console, Bing): vanno nel <head> dell'HTML
-- servito, per questo non sono script caricati dal browser
create table if not exists public.impostazioni_sito (
  id              int primary key default 1 check (id = 1),
  verifica_google text,
  verifica_bing   text,
  updated_at      timestamptz not null default now()
);
alter table public.impostazioni_sito enable row level security;
insert into public.impostazioni_sito (id) values (1) on conflict do nothing;

drop policy if exists "pubblico legge impostazioni" on public.impostazioni_sito;
create policy "pubblico legge impostazioni"
  on public.impostazioni_sito for select to anon, authenticated using (true);

drop policy if exists "redazione modifica impostazioni" on public.impostazioni_sito;
create policy "redazione modifica impostazioni"
  on public.impostazioni_sito for update to authenticated
  using (true) with check (true);

-- admin > Richieste > Elimina: senza questa policy la RLS scarta il DELETE
-- in silenzio (0 righe, nessun errore)
drop policy if exists "redazione elimina lead" on public.lead_preventivi;
create policy "redazione elimina lead"
  on public.lead_preventivi for delete to authenticated using (true);
