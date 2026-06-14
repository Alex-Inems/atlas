-- Project documents metadata (files in Supabase Storage bucket project-documents)

create table public.project_documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.client_projects(id) on delete cascade,
  file_name text not null,
  storage_path text not null,
  mime_type text,
  file_size bigint,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index project_documents_project_id_idx on public.project_documents(project_id);

alter table public.project_documents enable row level security;

create policy "Users read own project documents"
  on public.project_documents for select
  using (
    exists (
      select 1 from public.client_projects p
      where p.id = project_id and p.user_id = auth.uid()
    )
    and not public.is_restricted()
  );

create policy "Admins manage project documents"
  on public.project_documents for all
  using (public.is_admin())
  with check (public.is_admin());

-- Create bucket in Supabase Dashboard → Storage → New bucket: project-documents (private)
-- Then run storage policies via Dashboard or:
-- insert into storage.buckets (id, name, public) values ('project-documents', 'project-documents', false);

create table if not exists public.project_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.client_projects(id) on delete cascade,
  event_type text not null,
  message text not null,
  actor_id uuid references auth.users(id) on delete set null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index project_events_project_id_idx on public.project_events(project_id);

alter table public.project_events enable row level security;

create policy "Users read own project events"
  on public.project_events for select
  using (
    exists (
      select 1 from public.client_projects p
      where p.id = project_id and p.user_id = auth.uid()
    )
    and not public.is_restricted()
  );

create policy "Admins manage project events"
  on public.project_events for all
  using (public.is_admin())
  with check (public.is_admin());
