-- SEO: parola chiave principale e FAQ strutturate
alter table public.articoli
  add column if not exists keyword text,
  add column if not exists faq     jsonb not null default '[]'::jsonb;

comment on column public.articoli.keyword is 'Parola chiave principale: guida i controlli SEO nell''editor, non viene mostrata al pubblico';
comment on column public.articoli.faq is 'Array di {domanda, risposta}: reso in pagina e come JSON-LD FAQPage';

alter table public.articoli drop constraint if exists articoli_faq_e_array;
alter table public.articoli add constraint articoli_faq_e_array
  check (jsonb_typeof(faq) = 'array');

-- Lead: stato di lavorazione esplicito
alter table public.lead_preventivi drop constraint if exists lead_preventivi_stato_valido;
alter table public.lead_preventivi add constraint lead_preventivi_stato_valido
  check (stato in ('nuovo','contattato','chiuso'));

comment on column public.lead_preventivi.stato is 'Lavorazione commerciale: nuovo | contattato | chiuso';
comment on column public.lead_preventivi.note_interne is 'Appunti della redazione, mai mostrati al pubblico';

create index if not exists idx_lead_preventivi_stato on public.lead_preventivi (stato, created_at desc);
