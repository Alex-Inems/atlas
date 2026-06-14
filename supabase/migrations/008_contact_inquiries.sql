-- Contact / lead inquiries

create type public.inquiry_status as enum ('new', 'in_progress', 'resolved', 'spam');

create table public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  user_id uuid references auth.users(id) on delete set null,
  status public.inquiry_status not null default 'new',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.contact_inquiries enable row level security;

create policy "Anyone can submit inquiry"
  on public.contact_inquiries for insert
  with check (true);

create policy "Admins manage inquiries"
  on public.contact_inquiries for all
  using (public.is_admin())
  with check (public.is_admin());

create trigger contact_inquiries_updated_at
  before update on public.contact_inquiries
  for each row execute procedure public.set_updated_at();
