-- Run after 001_auth_and_projects.sql

create type public.user_role as enum ('user', 'admin', 'restricted');

alter table public.profiles
  add column if not exists role public.user_role not null default 'user',
  add column if not exists restricted_reason text;

create table if not exists public.site_pages (
  slug text primary key,
  title text not null,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now() not null,
  updated_by uuid references auth.users(id) on delete set null
);

alter table public.site_pages enable row level security;

-- Helper: current user is admin
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Helper: current user is restricted
create or replace function public.is_restricted()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'restricted'
  );
$$;

-- Profiles: drop old policies, add role-aware ones
drop policy if exists "Users read own profile" on public.profiles;
drop policy if exists "Users update own profile" on public.profiles;

create policy "Profiles select own or admin all"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "Profiles update own non-admin fields"
  on public.profiles for update
  using (auth.uid() = id and not public.is_restricted())
  with check (auth.uid() = id);

create policy "Admins update any profile"
  on public.profiles for update
  using (public.is_admin());

-- Client projects: admin full access
create policy "Admins read all projects"
  on public.client_projects for select
  using (public.is_admin());

create policy "Admins insert any project"
  on public.client_projects for insert
  with check (public.is_admin());

create policy "Admins update any project"
  on public.client_projects for update
  using (public.is_admin());

create policy "Admins delete any project"
  on public.client_projects for delete
  using (public.is_admin());

-- Restricted users cannot read own projects
drop policy if exists "Users read own projects" on public.client_projects;
create policy "Users read own projects"
  on public.client_projects for select
  using (auth.uid() = user_id and not public.is_restricted());

drop policy if exists "Users insert own projects" on public.client_projects;
create policy "Users insert own projects"
  on public.client_projects for insert
  with check (auth.uid() = user_id and not public.is_restricted());

drop policy if exists "Users update own projects" on public.client_projects;
create policy "Users update own projects"
  on public.client_projects for update
  using (auth.uid() = user_id and not public.is_restricted());

drop policy if exists "Users delete own projects" on public.client_projects;
create policy "Users delete own projects"
  on public.client_projects for delete
  using (auth.uid() = user_id and not public.is_restricted());

-- Site pages: public read, admin write
create policy "Anyone reads site pages"
  on public.site_pages for select
  using (true);

create policy "Admins manage site pages"
  on public.site_pages for all
  using (public.is_admin())
  with check (public.is_admin());

-- Seed editable pages
insert into public.site_pages (slug, title, content) values
  ('home', 'Home', '{"heroLabel":"Foundation","heroTitle":"We dig deep\nbefore we build high"}'::jsonb),
  ('projects', 'Projects', '{"label":"Landmark delivery","title":"Projects shaping skylines","description":"Verified completions from the global portfolio we benchmark against."}'::jsonb),
  ('services', 'Services', '{"label":"Capabilities","title":"Full-spectrum delivery","description":"Six core disciplines aligned with AIA general contracting and design-build standards."}'::jsonb),
  ('process', 'Process', '{"label":"Method","title":"Five phases. Zero surprises.","description":"From feasibility through certificate of occupancy — every gate documented."}'::jsonb),
  ('team', 'Team', '{"label":"People","title":"Built by specialists","description":"Experienced leaders based in Jakarta."}'::jsonb),
  ('blog', 'Blog', '{"label":"Intelligence","title":"Industry signals","description":"Facts from BLS, OSHA, and market research — not opinion."}'::jsonb),
  ('contact', 'Contact', '{"label":"Contact","title":"Start a conversation","description":"We respond within one business day."}'::jsonb),
  ('company', 'Company Info', '{"name":"Atlas Build","legalName":"PT Atlas Jaya Konstruksi","phone":"+62 812-9111-1887","email":"info@atlasbuildconstruction.com","headquarters":"Jl. Dr. Makaliwe Raya No. 28, West Jakarta, Indonesia","description":"Full-service general contractor and design-build firm.","testimonialQuote":"Atlas Build delivered beyond expectations.","testimonialAuthor":"Jonathan Reed","testimonialRole":"CEO, Prime Developments"}'::jsonb)
on conflict (slug) do nothing;

-- Promote first admin: replace with your email after running
-- update public.profiles set role = 'admin' where email = 'your@email.com';

create trigger site_pages_updated_at
  before update on public.site_pages
  for each row execute procedure public.set_updated_at();
