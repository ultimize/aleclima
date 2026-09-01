-- Analytics interne: nessun cookie, nessun IP, nessun identificatore del
-- visitatore. Si contano visualizzazioni di pagina, non persone: cosi' non
-- serve consenso e non c'e' alcun dato personale da custodire.
create table if not exists public.visite (
  id            bigserial primary key,
  percorso      text not null,
  referrer_host text,
  dispositivo   text check (dispositivo in ('mobile','desktop','altro')),
  created_at    timestamptz not null default now()
);

comment on table public.visite is 'Visualizzazioni di pagina del sito. Nessun dato personale: niente IP, cookie o identificatori.';
comment on column public.visite.percorso is 'Percorso della pagina, es. /blog/come-scegliere-il-climatizzatore';
comment on column public.visite.referrer_host is 'Solo il dominio di provenienza (es. google.com), mai l''URL completo';

create index if not exists idx_visite_data on public.visite (created_at desc);
create index if not exists idx_visite_percorso on public.visite (percorso, created_at desc);

alter table public.visite enable row level security;

drop policy if exists "sito registra visite" on public.visite;
create policy "sito registra visite"
  on public.visite for insert to anon, authenticated with check (true);

drop policy if exists "redazione legge visite" on public.visite;
create policy "redazione legge visite"
  on public.visite for select to authenticated using (true);
