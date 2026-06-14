-- Quotes and payments

create type public.quote_status as enum ('draft', 'sent', 'accepted', 'declined', 'expired');
create type public.payment_status as enum ('pending', 'paid', 'failed', 'refunded');

create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.client_projects(id) on delete set null,
  booking_id uuid references public.bookings(id) on delete set null,
  title text not null,
  status public.quote_status not null default 'draft',
  subtotal numeric(14, 2) not null default 0,
  tax_rate numeric(5, 2) not null default 0,
  total numeric(14, 2) not null default 0,
  currency text not null default 'IDR',
  valid_until date,
  notes text,
  stripe_payment_intent_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create sequence if not exists public.quote_reference_seq start 1001;

create or replace function public.generate_quote_reference()
returns trigger language plpgsql as $$
begin
  if new.reference is null or new.reference = '' then
    new.reference := 'QTE-' || to_char(now(), 'YYYY') || '-' ||
      lpad(nextval('public.quote_reference_seq')::text, 5, '0');
  end if;
  return new;
end;
$$;

create trigger quotes_set_reference
  before insert on public.quotes
  for each row execute procedure public.generate_quote_reference();

create table public.quote_line_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  description text not null,
  quantity numeric(10, 2) not null default 1,
  unit_price numeric(14, 2) not null default 0,
  sort_order int not null default 0
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid references public.quotes(id) on delete set null,
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric(14, 2) not null,
  currency text not null default 'IDR',
  status public.payment_status not null default 'pending',
  stripe_session_id text,
  stripe_payment_intent_id text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.quotes enable row level security;
alter table public.quote_line_items enable row level security;
alter table public.payments enable row level security;

create policy "Users read own quotes"
  on public.quotes for select
  using (auth.uid() = user_id and not public.is_restricted());

create policy "Users update own quote accept"
  on public.quotes for update
  using (auth.uid() = user_id and status = 'sent')
  with check (auth.uid() = user_id);

create policy "Admins manage quotes"
  on public.quotes for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Users read own quote items"
  on public.quote_line_items for select
  using (
    exists (select 1 from public.quotes q where q.id = quote_id and q.user_id = auth.uid())
    and not public.is_restricted()
  );

create policy "Admins manage quote items"
  on public.quote_line_items for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Users read own payments"
  on public.payments for select
  using (auth.uid() = user_id and not public.is_restricted());

create policy "Admins manage payments"
  on public.payments for all
  using (public.is_admin())
  with check (public.is_admin());

create trigger quotes_updated_at
  before update on public.quotes
  for each row execute procedure public.set_updated_at();
