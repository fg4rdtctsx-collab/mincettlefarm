-- Additive only: existing traffic history, livestock and orders are preserved.
do $$
declare p text;
begin
  foreach p in array array['sandbox_checkout','live_checkout'] loop
    if to_regclass('public.' || p || '_visits') is not null then
      execute format('alter table public.%I add column if not exists last_seen timestamptz, add column if not exists device text not null default ''Unknown'', add column if not exists browser text not null default ''Unknown''', p || '_visits');
      execute format('alter table public.%I add column if not exists country text not null default ''''', p || '_visits');
      execute format('create index if not exists %I on public.%I(last_seen)', p || '_visits_presence_idx', p || '_visits');
      execute format('create index if not exists %I on public.%I(session_id,created_at desc)', p || '_visits_session_idx', p || '_visits');
    end if;
  end loop;
end $$;
