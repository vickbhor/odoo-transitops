update public.profiles p
set
  role = v.role,
  name = v.name
from (
  values
    ('fleet.manager@example.com', 'Fleet Manager', 'Fleet Manager (Demo)'),
    ('driver@example.com', 'Driver', 'Driver (Demo)'),
    ('safety.officer@example.com', 'Safety Officer', 'Safety Officer (Demo)'),
    ('financial.analyst@example.com', 'Financial Analyst', 'Financial Analyst (Demo)')
) as v(email, role, name)
join auth.users u on u.email = v.email
where p.id = u.id;

-- sanity check — should return 4 rows
select u.email, p.name, p.role
from auth.users u
join public.profiles p on p.id = u.id
order by p.role;