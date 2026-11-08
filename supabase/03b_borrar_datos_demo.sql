-- Borra SOLO los datos de demo (ids que empiezan con 'de000000-').
-- Al borrar los vecinos de demo se borran también sus publicaciones,
-- reseñas, emergencias y voluntariados (ON DELETE CASCADE).
delete from public.reviews              where id::text like 'de000000-%';
delete from public.emergency_volunteers where emergency_id::text like 'de000000-%';
delete from public.emergencies          where id::text like 'de000000-%';
delete from public.publications         where id::text like 'de000000-%';
delete from public.profiles             where id::text like 'de000000-%';
