-- Fix: allow SQL Editor and service role to set roles (migration 003 blocked all non-admin updates)

create or replace function public.guard_profile_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Service role key or SQL Editor (no authenticated user)
  if coalesce(auth.jwt()->>'role', '') = 'service_role' or auth.uid() is null then
    return new;
  end if;

  if not public.is_admin() and new.role is distinct from old.role then
    new.role := old.role;
  end if;

  return new;
end;
$$;
