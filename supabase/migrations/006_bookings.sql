-- Industry-standard booking system (replaces client_projects for portal workflow)

create type public.booking_service_type as enum (
  'initial_consultation',
  'feasibility_site_visit',
  'design_build_intake',
  'safety_compliance_walkthrough',
  'project_kickoff',
  'progress_inspection'
);

create type public.booking_status as enum (
  'pending',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
  'no_show'
);

create type public.booking_time_slot as enum (
  'morning_08_12',
  'afternoon_13_17',
  'full_day'
);

create type public.booking_budget_range as enum (
  'under_500m',
  '500m_2b',
  '2b_10b',
  '10b_50b',
  'over_50b',
  'undisclosed'
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  user_id uuid not null references auth.users(id) on delete cascade,
  service_type public.booking_service_type not null,
  status public.booking_status not null default 'pending',
  preferred_date date not null,
  preferred_time_slot public.booking_time_slot not null,
  timezone text not null default 'Asia/Jakarta',
  scheduled_start timestamptz,
  scheduled_end timestamptz,
  site_address text not null,
  site_city text not null default 'Jakarta',
  project_scope text not null,
  budget_range public.booking_budget_range,
  contact_phone text not null,
  company_name text,
  special_requirements text,
  admin_notes text,
  cancellation_reason text,
  confirmed_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_preferred_date_future check (preferred_date >= current_date)
);

create index bookings_user_id_idx on public.bookings(user_id);
create index bookings_status_idx on public.bookings(status);
create index bookings_preferred_date_idx on public.bookings(preferred_date);

create sequence if not exists public.booking_reference_seq start 1001;

create or replace function public.generate_booking_reference()
returns trigger
language plpgsql
as $$
begin
  if new.reference is null or new.reference = '' then
    new.reference := 'ATL-' || to_char(now(), 'YYYY') || '-' ||
      lpad(nextval('public.booking_reference_seq')::text, 5, '0');
  end if;
  return new;
end;
$$;

create trigger bookings_set_reference
  before insert on public.bookings
  for each row execute procedure public.generate_booking_reference();

create trigger bookings_updated_at
  before update on public.bookings
  for each row execute procedure public.set_updated_at();

alter table public.bookings enable row level security;

-- Users: read own bookings
create policy "Users read own bookings"
  on public.bookings for select
  using (auth.uid() = user_id and not public.is_restricted());

-- Users: create own bookings (always pending)
create policy "Users insert own bookings"
  on public.bookings for insert
  with check (
    auth.uid() = user_id
    and not public.is_restricted()
    and status = 'pending'
  );

-- Users: cancel own pending/confirmed bookings only
create policy "Users cancel own bookings"
  on public.bookings for update
  using (
    auth.uid() = user_id
    and not public.is_restricted()
    and status in ('pending', 'confirmed')
  )
  with check (
    auth.uid() = user_id
    and status = 'cancelled'
  );

-- Admins: full access
create policy "Admins read all bookings"
  on public.bookings for select
  using (public.is_admin());

create policy "Admins insert any booking"
  on public.bookings for insert
  with check (public.is_admin());

create policy "Admins update any booking"
  on public.bookings for update
  using (public.is_admin());

create policy "Admins delete any booking"
  on public.bookings for delete
  using (public.is_admin());
