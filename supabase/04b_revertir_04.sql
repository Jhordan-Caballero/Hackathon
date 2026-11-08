-- Deshace TODO lo que agregó 04_seguridad_y_pendientes.sql
-- (deja la base como estaba antes de correrlo). No borra datos.

-- 1) y 2) límites para anónimos
drop policy  if exists "reviews_no_anonimos" on public.reviews;
drop trigger if exists trg_limitar_publicaciones_anonimas on public.publications;
drop trigger if exists trg_limitar_emergencias_anonimas  on public.emergencies;
drop function if exists public.limitar_publicaciones_anonimas();
drop function if exists public.limitar_emergencias_anonimas();
drop function if exists public.es_anonimo();

-- 3) estado 'cancelada' y borrar emergencias propias
update public.emergencies set status = 'resuelta' where status = 'cancelada';
alter table public.emergencies drop constraint if exists emer_status_chk;
alter table public.emergencies
  add constraint emer_status_chk check (status in ('activa', 'atendida', 'resuelta'));
drop policy if exists "emer_borrar_mia" on public.emergencies;

-- 4) editar reseñas
drop policy if exists "reviews_editar_mia" on public.reviews;

-- 5) latitud y longitud juntas
alter table public.publications drop constraint if exists pub_coords_juntas_chk;
alter table public.emergencies  drop constraint if exists emer_coords_juntas_chk;

-- 6) categoría "Grupos de apoyo" (las publicaciones que la usen quedan sin categoría)
delete from public.categories where slug = 'grupos-apoyo';

-- 7) Los triggers duplicados de updated_at NO se recrean: los trg_*_updated_at
--    del script 01 hacen exactamente lo mismo.
