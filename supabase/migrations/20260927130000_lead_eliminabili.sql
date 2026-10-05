-- admin > Richieste > Elimina: senza questa policy la RLS scarta il DELETE
-- in silenzio (0 righe, nessun errore)
drop policy if exists "redazione elimina lead" on public.lead_preventivi;
create policy "redazione elimina lead"
  on public.lead_preventivi for delete to authenticated using (true);
