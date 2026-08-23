create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null,
  accumulated numeric not null default 0,
  done_count integer not null default 0,
  progress numeric not null default 0,
  updated_at timestamptz not null default now()
);

grant select, insert, update on public.profiles to authenticated;
grant select on public.profiles to anon;
grant all on public.profiles to service_role;

alter table public.profiles enable row level security;

create policy "Ranking is public" on public.profiles for select using (true);
create policy "Users insert own profile" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);