-- Separate artificial test stock only. No real inventory or live invoices.
create table if not exists public.sandbox_checkout_inventory (
  id integer primary key,
  name text not null,
  price_cents integer not null check (price_cents > 0),
  available integer not null check (available >= 0)
);
create table if not exists public.sandbox_checkout_orders (
  id text primary key,
  idempotency_key text not null unique,
  fingerprint text not null,
  access_hash text not null,
  buyer jsonb not null,
  lines jsonb not null,
  total_cents integer not null check (total_cents > 0),
  status text not null default 'creating'
    check (status in ('creating','pending','paying','paid','expired','failed','review')),
  track_id text unique,
  payment_url text,
  message text not null default 'Creating your sandbox invoice.',
  released boolean not null default false,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  checked_at timestamptz
);
create index if not exists sandbox_checkout_reconcile_idx
  on public.sandbox_checkout_orders (checked_at)
  where track_id is not null and released = false and status in ('pending','paying','review');
create table if not exists public.sandbox_checkout_rate_limits (
  key text primary key,
  window_start timestamptz not null default now(),
  requests integer not null default 1
);
-- Clients must not access contact details, inventory mutations, or reservation
-- internals directly. Only server-side DB credentials can access these tables.
alter table public.sandbox_checkout_inventory enable row level security;
alter table public.sandbox_checkout_orders enable row level security;
alter table public.sandbox_checkout_rate_limits enable row level security;
revoke all on public.sandbox_checkout_inventory from anon, authenticated;
revoke all on public.sandbox_checkout_orders from anon, authenticated;
revoke all on public.sandbox_checkout_rate_limits from anon, authenticated;