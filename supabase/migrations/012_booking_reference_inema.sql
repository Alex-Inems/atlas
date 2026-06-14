-- Use INE- prefix for new booking references (Inema rebrand)

create or replace function public.generate_booking_reference()
returns trigger
language plpgsql
as $$
begin
  if new.reference is null or new.reference = '' then
    new.reference := 'INE-' || to_char(now(), 'YYYY') || '-' ||
      lpad(nextval('public.booking_reference_seq')::text, 5, '0');
  end if;
  return new;
end;
$$;
