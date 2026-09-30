-- Il secret per chiamare forward-lead non sta piu' nel codice:
-- la funzione lo legge dal Vault di Supabase (secret "forward_lead_secret").
-- Il valore va creato/aggiornato a mano dal SQL editor, mai committato:
--   select vault.create_secret('<valore>', 'forward_lead_secret');
-- e lo stesso valore va messo nei secrets delle Edge Functions come FORWARD_SECRET.

create extension if not exists supabase_vault;

create or replace function public.forward_lead_to_hl()
returns trigger
language plpgsql
security definer
set search_path = public, net, extensions
as $FN$
declare
  v_secret text;
begin
  select decrypted_secret into v_secret
  from vault.decrypted_secrets
  where name = 'forward_lead_secret'
  limit 1;

  if v_secret is null then
    raise warning 'forward_lead_to_hl: secret forward_lead_secret mancante nel Vault';
    return NEW;
  end if;

  perform net.http_post(
    url := 'https://aurlsynzwvsquvjelusv.supabase.co/functions/v1/forward-lead',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-forward-secret', v_secret
    ),
    body := to_jsonb(NEW)
  );
  return NEW;
exception when others then
  raise warning 'forward_lead_to_hl failed: %', sqlerrm;
  return NEW;
end;
$FN$;
