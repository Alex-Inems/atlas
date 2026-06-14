-- Rebrand site_pages company info to Inema (run if CMS still shows Atlas)

update public.site_pages
set content = jsonb_build_object(
  'name', 'Inema',
  'legalName', 'PT Inema Konstruksi',
  'phone', '+62 812-9111-1887',
  'email', 'inema9886@gmail.com',
  'headquarters', 'Jl. Dr. Makaliwe Raya No. 28, West Jakarta, Indonesia',
  'description', 'Full-service general contractor and design-build firm.',
  'testimonialQuote', 'Inema delivered beyond expectations.',
  'testimonialAuthor', 'Jonathan Reed',
  'testimonialRole', 'CEO, Prime Developments'
)
where slug = 'company';
