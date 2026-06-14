-- Run this in Supabase SQL Editor if admin access still fails.
-- Step 1: Check your account (replace email)
select
  u.id,
  u.email as auth_email,
  p.email as profile_email,
  p.role,
  p.full_name
from auth.users u
left join public.profiles p on p.id = u.id
where u.email = 'your@email.com';

-- Step 2: Create missing profile + set admin in one shot (replace email)
insert into public.profiles (id, full_name, email, role)
select
  u.id,
  coalesce(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
  u.email,
  'admin'::public.user_role
from auth.users u
where u.email = 'your@email.com'
on conflict (id) do update
  set role = 'admin'::public.user_role,
      email = excluded.email;

-- Step 3: Confirm
select id, email, role from public.profiles where email = 'your@email.com';
