-- Additive migration: preserve all invoices, reservations and private receipts.
do $$
declare p text;
begin
  foreach p in array array['sandbox_checkout','live_checkout'] loop
    if to_regclass('public.' || p || '_inventory') is not null then
      execute format('alter table public.%I add column if not exists metadata jsonb not null default ''{}''::jsonb, add column if not exists active boolean not null default true, add column if not exists version integer not null default 0', p || '_inventory');
      execute format('alter table public.%I add column if not exists payment_method text not null default ''crypto'' check (payment_method in (''crypto'',''bank'')), add column if not exists fulfilled_at timestamptz, add column if not exists paid_at timestamptz', p || '_orders');
      -- Old paid receipts have a canonical verification timestamp.
      execute format('update public.%I set paid_at=checked_at where status=''paid'' and paid_at is null and checked_at is not null', p || '_orders');
      execute format('create sequence if not exists public.%I start 100000', p || '_inventory_ids');
      execute format('alter table public.%I alter column id set default nextval(%L)', p || '_inventory', 'public.' || p || '_inventory_ids');
      execute format('create table if not exists public.%I (event_id uuid primary key, session_id uuid not null, path text not null check (length(path)<=200), referrer text not null default '''', created_at timestamptz not null default now())', p || '_visits');
      execute format('create index if not exists %I on public.%I(created_at)', p || '_visits_created_idx', p || '_visits');
      execute format('create table if not exists public.%I (id integer primary key check (id=1), started_at timestamptz not null default now())', p || '_analytics_start');
      execute format('insert into public.%I(id) values(1) on conflict do nothing', p || '_analytics_start');
      execute format('alter table public.%I enable row level security', p || '_visits');
      execute format('alter table public.%I enable row level security', p || '_analytics_start');
      if exists(select 1 from pg_roles where rolname='anon') and exists(select 1 from pg_roles where rolname='authenticated') then
        execute format('revoke all on public.%I, public.%I from anon, authenticated', p || '_visits', p || '_analytics_start');
      end if;
    end if;
  end loop;
end $$;