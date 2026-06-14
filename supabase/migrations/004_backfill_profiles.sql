-- Backfill profiles for auth users missing a row (common after Google OAuth before trigger existed)

insert into public.profiles (id, full_name, email, role)
select
  u.id,
  coalesce(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
  u.email,
  'user'::public.user_role
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null
on conflict (id) do nothing;

-- Promote first admin: replace with your login email, then log out and back in
-- update public.profiles set role = 'admin' where email = 'your@email.com';

ADMIN_BOOTSTRAP_EMAIL=your-exact-google-or-email-login@example.com
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key