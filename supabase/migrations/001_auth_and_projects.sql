-- Run in Supabase SQL Editor

create type public.project_status as enum ('planning', 'in_progress', 'review', 'completed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table public.client_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  location text,
  status public.project_status default 'planning' not null,
  phase text,
  updated_at timestamptz default now() not null,
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;
alter table public.client_projects enable row level security;

create policy "Users read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users read own projects"
  on public.client_projects for select
  using (auth.uid() = user_id);

create policy "Users insert own projects"
  on public.client_projects for insert
  with check (auth.uid() = user_id);

create policy "Users update own projects"
  on public.client_projects for update
  using (auth.uid() = user_id);

create policy "Users delete own projects"
  on public.client_projects for delete
  using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

create trigger client_projects_updated_at
  before update on public.client_projects
  for each row execute procedure public.set_updated_at();
