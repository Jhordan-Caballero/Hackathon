-- =====================================================================
--  VECINOS APP · 04 Seguridad + pendientes
--  Ejecutar DESPUÉS de 01, 02 y 03_datos_demo (SQL Editor > Run).
--  Se puede ejecutar varias veces. Solo AGREGA reglas: no borra columnas
--  ni tablas, y no cambia nada que el frontend use hoy.
--
--  Incluye las ideas de Kevin (03_proteger_anonimos) + lo pendiente:
--   1) Anónimos: máximo 2 publicaciones y sin reseñas
--   2) Anónimos: máximo 3 emergencias por hora (contra spam)
--   3) Emergencias: estado 'cancelada' y poder borrar las propias
--   4) Reseñas: poder editar la propia
--   5) Latitud y longitud siempre juntas
--   6) Categoría "Grupos de apoyo" (directorio de emergencias)
--   7) Limpieza de triggers duplicados de updated_at
-- =====================================================================

-- Utilidad: ¿quien llama es una sesión anónima?
create or replace function public.es_anonimo()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false)
$$;


-- 1) ANÓNIMOS: SIN RESEÑAS Y MÁXIMO 2 PUBLICACIONES --------------------
drop policy if exists "reviews_no_anonimos" on public.reviews;
create policy "reviews_no_anonimos" on public.reviews
  as restrictive
  for insert
  to authenticated
  with check (not public.es_anonimo());

create or replace function public.limitar_publicaciones_anonimas()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  limite constant int := 2;
  total int;
begin
  if public.es_anonimo() then
    select count(*) into total from public.publications where user_id = new.user_id;
    if total >= limite then
      raise exception 'Sin cuenta registrada solo puedes tener % publicaciones. Regístrate para publicar más.', limite
        using errcode = 'P0001';
    end if;
  end if;
  return new;
end;
$$;

-- (por si se corrió antes el script de Kevin con otro nombre)
drop trigger if exists trg_limitar_publicaciones on public.publications;
drop function if exists public.limitar_publicaciones_sin_verificar();

drop trigger if exists trg_limitar_publicaciones_anonimas on public.publications;
create trigger trg_limitar_publicaciones_anonimas
  before insert on public.publications
  for each row execute function public.limitar_publicaciones_anonimas();


-- 2) ANÓNIMOS: MÁXIMO 3 EMERGENCIAS POR HORA ---------------------------
create or replace function public.limitar_emergencias_anonimas()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  limite constant int := 3;
  total int;
begin
  if public.es_anonimo() then
    select count(*) into total
    from public.emergencies
    where user_id = new.user_id
      and created_at > now() - interval '1 hour';
    if total >= limite then
      raise exception 'Ya reportaste % emergencias en la última hora. Si es urgente, llama al 105, 116 o 106.', limite
        using errcode = 'P0001';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_limitar_emergencias_anonimas on public.emergencies;
create trigger trg_limitar_emergencias_anonimas
  before insert on public.emergencies
  for each row execute function public.limitar_emergencias_anonimas();


-- 3) EMERGENCIAS: ESTADO 'cancelada' Y BORRAR LAS PROPIAS --------------
alter table public.emergencies drop constraint if exists emer_status_chk;
alter table public.emergencies
  add constraint emer_status_chk check (status in ('activa', 'atendida', 'resuelta', 'cancelada'));

drop policy if exists "emer_borrar_mia" on public.emergencies;
create policy "emer_borrar_mia" on public.emergencies
  for delete to authenticated
  using ((select auth.uid()) = user_id);


-- 4) RESEÑAS: EDITAR LA PROPIA -----------------------------------------
drop policy if exists "reviews_editar_mia" on public.reviews;
create policy "reviews_editar_mia" on public.reviews
  for update to authenticated
  using ((select auth.uid()) = author_id)
  with check ((select auth.uid()) = author_id);


-- 5) LATITUD Y LONGITUD SIEMPRE JUNTAS ---------------------------------
--    (NOT VALID: no revisa filas viejas, solo las nuevas o editadas)
alter table public.publications drop constraint if exists pub_coords_juntas_chk;
alter table public.publications
  add constraint pub_coords_juntas_chk check ((latitude is null) = (longitude is null)) not valid;

alter table public.emergencies drop constraint if exists emer_coords_juntas_chk;
alter table public.emergencies
  add constraint emer_coords_juntas_chk check ((latitude is null) = (longitude is null)) not valid;


-- 6) CATEGORÍA "GRUPOS DE APOYO" ---------------------------------------
insert into public.categories (name, slug, description, section)
values ('Grupos de apoyo', 'grupos-apoyo',
        'Brigadas, ollas comunes y grupos vecinales que ayudan en emergencias', 'ambos')
on conflict (slug) do nothing;


-- 7) LIMPIEZA: triggers de updated_at duplicados -----------------------
--    (quedan los trg_*_updated_at del script 01, que hacen lo mismo)
drop trigger if exists set_updated_at on public.publications;
drop trigger if exists set_updated_at on public.profiles;
drop trigger if exists set_updated_at on public.emergencies;

-- NOTA: la tabla vacía "emergency_contacts" NO se borra aquí.
-- Borrarla solo si el líder confirma que no la usa:
--   drop table if exists public.emergency_contacts;

-- Fin. Si algo da error, copia el mensaje completo y pásaselo a Claude.
