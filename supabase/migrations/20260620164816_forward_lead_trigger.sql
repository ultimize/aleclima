create extension if not exists pg_net;

create or replace function public.forward_lead_to_hl()
returns trigger
language plpgsql
security definer
set search_path = public, net, extensions
as $FN$
begin
  perform net.http_post(
    url := 'https://aurlsynzwvsquvjelusv.supabase.co/functions/v1/forward-lead',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-forward-secret', 'fwd_3b9d7c1a8e6f4205'
    ),
    body := to_jsonb(NEW)
  );
  return NEW;
exception when others then
  raise warning 'forward_lead_to_hl failed: %', sqlerrm;
  return NEW;
end;
$FN$;

drop trigger if exists trg_forward_lead on public.lead_preventivi;
create trigger trg_forward_lead
  after insert on public.lead_preventivi
  for each row execute function public.forward_lead_to_hl();
