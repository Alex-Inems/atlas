-- Profile contact fields + booking reschedule + activity events

alter table public.profiles
  add column if not exists phone text,
  add column if not exists company_name text,
  add column if not exists notification_email_opt_in boolean not null default true;

alter type public.booking_status add value if not exists 'reschedule_requested';

alter table public.bookings
  add column if not exists reschedule_preferred_date date,
  add column if not exists reschedule_preferred_time_slot public.booking_time_slot,
  add column if not exists reschedule_note text,
  add column if not exists project_id uuid references public.client_projects(id) on delete set null;

alter table public.client_projects
  add column if not exists booking_id uuid references public.bookings(id) on delete set null;

create table if not exists public.booking_events (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  event_type text not null,
  message text not null,
  actor_id uuid references auth.users(id) on delete set null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists booking_events_booking_id_idx on public.booking_events(booking_id);

alter table public.booking_events enable row level security;

create policy "Users read own booking events"
  on public.booking_events for select
  using (
    exists (
      select 1 from public.bookings b
      where b.id = booking_id and b.user_id = auth.uid()
    )
    and not public.is_restricted()
  );

create policy "Admins read all booking events"
  on public.booking_events for select
  using (public.is_admin());

create policy "Admins insert booking events"
  on public.booking_events for insert
  with check (public.is_admin());

-- Allow clients to request reschedule on pending/confirmed bookings
drop policy if exists "Users cancel own bookings" on public.bookings;

create policy "Users update own bookings"
  on public.bookings for update
  using (
    auth.uid() = user_id
    and not public.is_restricted()
    and status in ('pending', 'confirmed', 'reschedule_requested')
  )
  with check (auth.uid() = user_id);
