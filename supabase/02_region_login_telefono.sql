-- =====================================================================
--  VECINOS APP · Ajustes 2: región + login con teléfono + tipos de emergencia
--  Ejecutar DESPUÉS de 01_ajustes_supabase.sql  (SQL Editor > Run)
--  Se puede ejecutar varias veces sin romper nada.
-- =====================================================================

-- 1. REGIÓN en perfiles, publicaciones y emergencias -------------------
alter table public.profiles     add column if not exists region text;
alter table public.publications add column if not exists region text;
alter table public.emergencies  add column if not exists region text;

create index if not exists pub_region_idx  on public.publications (region, district);
create index if not exists emer_region_idx on public.emergencies  (region, district);


-- 2. Tipos de emergencia alineados con el frontend ---------------------
--    (se agregan 'accidente' y 'servicios_basicos'; 'corte_servicios' pasa a 'servicios_basicos')
alter table public.emergencies drop constraint if exists emer_type_chk;
update public.emergencies set emergency_type = 'servicios_basicos'
where emergency_type = 'corte_servicios';
alter table public.emergencies
  add constraint emer_type_chk check (emergency_type in (
    'incendio', 'sismo', 'inundacion', 'salud', 'seguridad', 'accidente',
    'servicios_basicos', 'persona_vulnerable', 'otro'));


-- 3. Al registrarse, el perfil se crea con todos los datos del formulario
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, whatsapp, has_whatsapp, region, district, neighborhood)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), 'Vecino'),
    new.raw_user_meta_data ->> 'phone',
    coalesce((new.raw_user_meta_data ->> 'has_whatsapp')::boolean, true),
    new.raw_user_meta_data ->> 'region',
    new.raw_user_meta_data ->> 'district',
    new.raw_user_meta_data ->> 'neighborhood'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;


-- 4. Rehacer las vistas para que incluyan la nueva columna "region" ----
drop view if exists public.publications_feed;
create view public.publications_feed
with (security_invoker = on) as
select
  p.*,
  c.name                                   as category_name,
  c.slug                                   as category_slug,
  coalesce(r.avg_rating, 0)                as avg_rating,
  coalesce(r.review_count, 0)              as review_count,
  (coalesce(r.review_count, 0) >= 3
     and coalesce(r.avg_rating, 0) >= 4)   as visto_bueno
from public.publications p
left join public.categories c on c.id = p.category_id
left join (
  select publication_id,
         round(avg(rating)::numeric, 1) as avg_rating,
         count(*)::int                  as review_count
  from public.reviews
  group by publication_id
) r on r.publication_id = p.id;

drop view if exists public.emergencies_feed;
create view public.emergencies_feed
with (security_invoker = on) as
select
  e.*,
  coalesce(v.total, 0) as volunteers_count
from public.emergencies e
left join (
  select emergency_id, count(*)::int as total
  from public.emergency_volunteers
  group by emergency_id
) v on v.emergency_id = e.id;

grant select on public.publications_feed, public.emergencies_feed to anon, authenticated;

