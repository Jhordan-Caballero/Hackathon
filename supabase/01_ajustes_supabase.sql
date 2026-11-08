-- =====================================================================
--  VECINOS APP · Ajustes de base de datos (Hackathon UTP - El Comercio)
--  Dónde se ejecuta: Supabase > SQL Editor > New query > pegar > Run
--  Se puede ejecutar varias veces sin romper nada (es idempotente).
--  Trabaja SOBRE las 6 tablas que ya crearon: no borra datos.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 0. Utilidad: actualizar updated_at automáticamente
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- ---------------------------------------------------------------------
-- 1. CATEGORIES  → se agrega "section" para saber en qué módulo aparece
--    servicios = catálogo | comunidad = ayuda vecinal | ambos
-- ---------------------------------------------------------------------
alter table public.categories add column if not exists section text not null default 'ambos';
alter table public.categories add column if not exists icon text;

alter table public.categories drop constraint if exists categories_section_chk;
alter table public.categories
  add constraint categories_section_chk check (section in ('servicios', 'comunidad', 'ambos'));

-- Categorías que pide el reto y aún no tenían
insert into public.categories (name, slug, description, section)
select v.name, v.slug, v.description, v.section
from (values
  ('Carpinteria',               'carpinteria',             'Trabajos de carpinteria',                    'servicios'),
  ('Cerrajeria',                'cerrajeria',              'Cerrajeria y duplicado de llaves',           'servicios'),
  ('Mascotas',                  'mascotas',                'Paseo y cuidado de mascotas',                'servicios'),
  ('Prestamo de herramientas',  'prestamo-herramientas',   'Presta o pide herramientas a tus vecinos',   'comunidad'),
  ('Donaciones',                'donaciones',              'Donacion de materiales, ropa y alimentos',   'comunidad'),
  ('Intercambio de habilidades','intercambio-habilidades', 'Te enseño algo a cambio de algo',            'comunidad'),
  ('Ayuda temporal',            'ayuda-temporal',          'Acompañar, cuidar, hacer un mandado',        'comunidad')
) as v(name, slug, description, section)
where not exists (select 1 from public.categories c where c.slug = v.slug);


-- ---------------------------------------------------------------------
-- 2. PROFILES  → registro rápido SIN contraseña
--    whatsapp       = número de teléfono (se mantiene el nombre de columna)
--    has_whatsapp   = no todos tienen WhatsApp → si es false, se llama/SMS
--    district       = distrito (para filtrar, como acordaron)
--    neighborhood   = referencia de ubicación ("Urb. X, frente al parque")
-- ---------------------------------------------------------------------
alter table public.profiles add column if not exists has_whatsapp boolean not null default true;
alter table public.profiles add column if not exists district text;

-- Quitar triggers viejos de "crear perfil al registrarse" (si existían)
do $$
declare r record;
begin
  for r in
    select t.tgname
    from pg_trigger t
    join pg_proc p      on p.oid = t.tgfoid
    join pg_namespace n on n.oid = p.pronamespace
    where t.tgrelid = 'auth.users'::regclass
      and not t.tgisinternal
      and n.nspname = 'public'
  loop
    execute format('drop trigger if exists %I on auth.users', r.tgname);
  end loop;
end $$;

-- Cuando alguien entra (aunque sea anónimo) se le crea su perfil
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, whatsapp, district, neighborhood)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), 'Vecino'),
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'district',
    new.raw_user_meta_data ->> 'neighborhood'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();


-- ---------------------------------------------------------------------
-- 3. PUBLICATIONS  → UNA sola tabla para catálogo y comunidad
--    section : 'servicios' (catálogo)  | 'comunidad' (ayuda vecinal)
--    type    : 'producto' | 'servicio' | 'ayuda' | 'intercambio' | 'prestamo' | 'donacion'
--    intent  : 'ofrezco'  | 'solicito'
--    status  : 'activa'   | 'pausada'  | 'cerrada'
--    price   : solo en 'servicios' (comunidad NUNCA tiene precio)
--    emergency_support : true = este servicio/grupo ayuda en emergencias
--                        (es el "directorio de emergencia" que pide el reto)
-- ---------------------------------------------------------------------
alter table public.publications add column if not exists has_whatsapp boolean not null default true;
alter table public.publications add column if not exists district text;
alter table public.publications add column if not exists emergency_support boolean not null default false;

alter table public.publications alter column user_id    set default auth.uid();
alter table public.publications alter column status     set default 'activa';
alter table public.publications alter column tags       set default '{}';
alter table public.publications alter column image_urls set default '{}';

-- Limpiar CHECKs viejos de publications / emergencies / reviews y poner los nuestros
do $$
declare r record;
begin
  for r in
    select conrelid::regclass as tbl, conname
    from pg_constraint
    where contype = 'c'
      and conrelid in ('public.publications'::regclass,
                       'public.emergencies'::regclass,
                       'public.reviews'::regclass)
  loop
    execute format('alter table %s drop constraint %I', r.tbl, r.conname);
  end loop;
end $$;

alter table public.publications
  add constraint pub_section_chk   check (section in ('servicios', 'comunidad')),
  add constraint pub_type_chk      check (type in ('producto', 'servicio', 'ayuda', 'intercambio', 'prestamo', 'donacion')),
  add constraint pub_intent_chk    check (intent in ('ofrezco', 'solicito')),
  add constraint pub_status_chk    check (status in ('activa', 'pausada', 'cerrada')),
  add constraint pub_price_chk     check (section = 'servicios' or price is null),
  add constraint pub_price_pos_chk check (price is null or price >= 0);

create index if not exists pub_section_status_idx on public.publications (section, status);
create index if not exists pub_category_idx       on public.publications (category_id);
create index if not exists pub_district_idx       on public.publications (district);
create index if not exists pub_tags_idx           on public.publications using gin (tags);

drop trigger if exists trg_publications_updated_at on public.publications;
create trigger trg_publications_updated_at
  before update on public.publications
  for each row execute function public.set_updated_at();


-- ---------------------------------------------------------------------
-- 4. REVIEWS  → el "Visto Bueno Vecinal"
--    1 reseña por vecino por publicación, estrellas de 1 a 5,
--    reviewed_user_id se llena solo con el dueño de la publicación
-- ---------------------------------------------------------------------
alter table public.reviews alter column author_id set default auth.uid();
alter table public.reviews add constraint reviews_rating_chk check (rating between 1 and 5);

create unique index if not exists reviews_one_per_publication
  on public.reviews (author_id, publication_id);

create or replace function public.reviews_fill_reviewed_user()
returns trigger
language plpgsql
as $$
begin
  if new.publication_id is not null then
    select p.user_id into new.reviewed_user_id
    from public.publications p
    where p.id = new.publication_id;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_reviews_fill_user on public.reviews;
create trigger trg_reviews_fill_user
  before insert on public.reviews
  for each row execute function public.reviews_fill_reviewed_user();


-- ---------------------------------------------------------------------
-- 5. EMERGENCIES
--    contact_phone : teléfono para que los vecinos llamen (va aquí directo,
--                    ya no hace falta la tabla emergency_contacts)
--    status        : 'activa' | 'atendida' | 'resuelta'
-- ---------------------------------------------------------------------
alter table public.emergencies add column if not exists contact_phone text;
alter table public.emergencies add column if not exists district text;

alter table public.emergencies alter column user_id    set default auth.uid();
alter table public.emergencies alter column status     set default 'activa';
alter table public.emergencies alter column image_urls set default '{}';

alter table public.emergencies
  add constraint emer_status_chk check (status in ('activa', 'atendida', 'resuelta')),
  add constraint emer_type_chk   check (emergency_type in (
    'incendio', 'sismo', 'inundacion', 'salud', 'seguridad',
    'persona_vulnerable', 'corte_servicios', 'otro'));

create index if not exists emer_status_idx   on public.emergencies (status, created_at desc);
create index if not exists emer_district_idx on public.emergencies (district);

drop trigger if exists trg_emergencies_updated_at on public.emergencies;
create trigger trg_emergencies_updated_at
  before update on public.emergencies
  for each row execute function public.set_updated_at();


-- ---------------------------------------------------------------------
-- 6. EMERGENCY_VOLUNTEERS (NUEVA) → botón "Yo ayudo"
--    Cubre "coordinación de ayuda entre vecinos en emergencias"
-- ---------------------------------------------------------------------
create table if not exists public.emergency_volunteers (
  emergency_id uuid        not null references public.emergencies (id) on delete cascade,
  user_id      uuid        not null default auth.uid() references public.profiles (id) on delete cascade,
  message      text,
  created_at   timestamptz not null default now(),
  primary key (emergency_id, user_id)
);


-- ---------------------------------------------------------------------
-- 7. VISTAS para que el frontend lea todo en una sola consulta
-- ---------------------------------------------------------------------
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


-- ---------------------------------------------------------------------
-- 8. SEGURIDAD (RLS): se borran las políticas que había y se ponen estas
--    Regla general: TODOS pueden ver, solo el dueño edita/borra lo suyo.
--    "authenticated" incluye a los usuarios anónimos (login sin contraseña)
-- ---------------------------------------------------------------------
do $$
declare r record;
begin
  for r in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('categories', 'profiles', 'publications', 'reviews',
                        'emergencies', 'emergency_volunteers')
  loop
    execute format('drop policy %I on %I.%I', r.policyname, r.schemaname, r.tablename);
  end loop;
end $$;

alter table public.categories           enable row level security;
alter table public.profiles             enable row level security;
alter table public.publications         enable row level security;
alter table public.reviews              enable row level security;
alter table public.emergencies          enable row level security;
alter table public.emergency_volunteers enable row level security;

grant select, insert, update, delete on public.emergency_volunteers to authenticated;
grant select on public.emergency_volunteers to anon;

-- categories: solo lectura
create policy "categorias_leer" on public.categories
  for select to anon, authenticated using (true);

-- profiles
create policy "perfiles_leer" on public.profiles
  for select to anon, authenticated using (true);
create policy "perfiles_crear_mio" on public.profiles
  for insert to authenticated with check ((select auth.uid()) = id);
create policy "perfiles_editar_mio" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- publications
create policy "pub_leer" on public.publications
  for select to anon, authenticated
  using (status = 'activa' or (select auth.uid()) = user_id);
create policy "pub_crear" on public.publications
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "pub_editar_mia" on public.publications
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "pub_borrar_mia" on public.publications
  for delete to authenticated using ((select auth.uid()) = user_id);

-- reviews (no puedes calificar tu propia publicación)
create policy "reviews_leer" on public.reviews
  for select to anon, authenticated using (true);
create policy "reviews_crear" on public.reviews
  for insert to authenticated
  with check (
    (select auth.uid()) = author_id
    and not exists (
      select 1 from public.publications p
      where p.id = publication_id and p.user_id = (select auth.uid())
    )
  );
create policy "reviews_borrar_mia" on public.reviews
  for delete to authenticated using ((select auth.uid()) = author_id);

-- emergencies
create policy "emer_leer" on public.emergencies
  for select to anon, authenticated using (true);
create policy "emer_crear" on public.emergencies
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "emer_editar_mia" on public.emergencies
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- emergency_volunteers
create policy "vol_leer" on public.emergency_volunteers
  for select to anon, authenticated using (true);
create policy "vol_crear" on public.emergency_volunteers
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "vol_borrar_mio" on public.emergency_volunteers
  for delete to authenticated using ((select auth.uid()) = user_id);


-- ---------------------------------------------------------------------
-- 9. STORAGE: bucket público "images" para fotos
--    Cada usuario sube en su carpeta:  images/<su-user-id>/archivo.jpg
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

drop policy if exists "imagenes_subir_mi_carpeta" on storage.objects;
create policy "imagenes_subir_mi_carpeta" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "imagenes_borrar_las_mias" on storage.objects;
create policy "imagenes_borrar_las_mias" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );


-- ---------------------------------------------------------------------
-- 10. REALTIME: el tablero de emergencias se actualiza solo
-- ---------------------------------------------------------------------
do $$
begin
  alter publication supabase_realtime add table public.emergencies;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.emergency_volunteers;
exception when duplicate_object then null;
end $$;

-- Fin. Si algo da error, copia el mensaje completo y pásaselo a Claude.
