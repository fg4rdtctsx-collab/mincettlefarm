-- Run only after configuring matching server-only values in Edge Function
-- secrets and Vault. Never put secret literals into this repository.
create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;
-- Vault must contain:
--   mcf_checkout_function_url: https://PROJECT.supabase.co/functions/v1/checkout
--   mcf_reconcile_secret: the same value as Edge secret MCF_RECONCILE_SECRET
-- Configure them securely in Supabase, not in a committed SQL file.
do $$
begin
  if (select count(*) from vault.secrets where name in ('mcf_checkout_function_url','mcf_reconcile_secret')) <> 2 then
    raise exception 'Configure both reconciliation Vault secrets before scheduling.';
  end if;
end $$;
select cron.schedule(
  'mini-cattle-checkout-reconcile',
  '* * * * *',
  $job$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'mcf_checkout_function_url') || '/api/internal/reconcile',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'mcf_reconcile_secret')
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 25000
  );
  $job$
);