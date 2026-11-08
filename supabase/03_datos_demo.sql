-- =====================================================================
--  VECINOS APP · Datos de DEMO (Arequipa)
--  Vecinos, publicaciones, reseñas, emergencias y grupos de apoyo de ejemplo.
--  Ejecutar DESPUÉS del 04 (usa la categoría "Grupos de apoyo").
--  Se puede ejecutar varias veces (no duplica).
--  Para BORRAR todo lo de demo: ejecutar 03b_borrar_datos_demo.sql
--  Todos los ids de demo empiezan con 'de000000-' para reconocerlos.
-- =====================================================================

-- 1. VECINOS DE EJEMPLO (no pueden iniciar sesión, solo son para mostrar)
insert into public.profiles (id, full_name, whatsapp, has_whatsapp, region, district, neighborhood) values
  ('de000000-0000-0000-0000-000000000001', 'Rosa Quispe',     '51900000001', true,  'Arequipa', 'Cayma',                         'Urb. La Rinconada, frente al parque'),
  ('de000000-0000-0000-0000-000000000002', 'Jorge Mamani',    '51900000002', true,  'Arequipa', 'Cerro Colorado',                'Zamácola, cerca al mercado'),
  ('de000000-0000-0000-0000-000000000003', 'Lucía Flores',    '51900000003', true,  'Arequipa', 'Yanahuara',                     'Calle Jerusalén 210'),
  ('de000000-0000-0000-0000-000000000004', 'Carlos Huamán',   '51900000004', false, 'Arequipa', 'Paucarpata',                    'Sector Miguel Grau'),
  ('de000000-0000-0000-0000-000000000005', 'Ana Choque',      '51900000005', true,  'Arequipa', 'José Luis Bustamante y Rivero', 'Av. Dolores, altura del grifo'),
  ('de000000-0000-0000-0000-000000000006', 'Pedro Condori',   '51900000006', true,  'Arequipa', 'Arequipa Cercado',              'Calle Mercaderes, 2do piso')
on conflict (id) do nothing;


-- 2. PUBLICACIONES
--    section 'servicios' = catálogo (puede tener precio)
--    section 'comunidad' = ayuda vecinal (SIN precio)
insert into public.publications
  (id, user_id, category_id, title, description, section, type, intent, price,
   location, region, district, contact_whatsapp, has_whatsapp, emergency_support, tags)
values
  -- ---------- CATÁLOGO ----------
  ('de000000-0000-0000-0001-000000000001', 'de000000-0000-0000-0000-000000000002',
   (select id from public.categories where slug = 'gasfiteria'),
   'Gasfitero 24 horas', 'Arreglo fugas, caños, terma y desagües. Atiendo emergencias de agua a cualquier hora.',
   'servicios', 'servicio', 'ofrezco', 40,
   'Zamácola, cerca al mercado', 'Arequipa', 'Cerro Colorado', '51900000002', true, true,
   '{gasfiteria,urgente,24horas}'),

  ('de000000-0000-0000-0001-000000000002', 'de000000-0000-0000-0000-000000000001',
   (select id from public.categories where slug = 'alimentacion'),
   'Pan artesanal de la casa', 'Pan de tres puntas y pan de yema horneado cada mañana. Pedidos desde las 6 am.',
   'servicios', 'producto', 'ofrezco', 8,
   'Urb. La Rinconada', 'Arequipa', 'Cayma', '51900000001', true, false,
   '{pan,alimentos,hechoencasa}'),

  ('de000000-0000-0000-0001-000000000003', 'de000000-0000-0000-0000-000000000003',
   (select id from public.categories where slug = 'educacion'),
   'Clases de matemática para colegio', 'Refuerzo de primaria y secundaria. Primera clase de prueba gratis.',
   'servicios', 'servicio', 'ofrezco', 20,
   'Calle Jerusalén 210', 'Arequipa', 'Yanahuara', '51900000003', true, false,
   '{clases,matematica,colegio}'),

  ('de000000-0000-0000-0001-000000000004', 'de000000-0000-0000-0000-000000000004',
   (select id from public.categories where slug = 'electricidad'),
   'Electricista domiciliario', 'Instalaciones, tableros, cortocircuitos. Apoyo en cortes de luz del barrio.',
   'servicios', 'servicio', 'ofrezco', 35,
   'Sector Miguel Grau', 'Arequipa', 'Paucarpata', '51900000004', false, true,
   '{electricidad,instalaciones}'),

  ('de000000-0000-0000-0001-000000000005', 'de000000-0000-0000-0000-000000000005',
   (select id from public.categories where slug = 'tecnologia'),
   'Reparación de celulares y laptops', 'Cambio de pantalla, batería y formateo. Diagnóstico gratis.',
   'servicios', 'servicio', 'ofrezco', 50,
   'Av. Dolores', 'Arequipa', 'José Luis Bustamante y Rivero', '51900000005', true, false,
   '{tecnologia,celulares,laptops}'),

  ('de000000-0000-0000-0001-000000000006', 'de000000-0000-0000-0000-000000000006',
   (select id from public.categories where slug = 'mascotas'),
   'Paseo y cuidado de perritos', 'Paseos de 1 hora por el Cercado. También cuido mascotas el fin de semana.',
   'servicios', 'servicio', 'ofrezco', 15,
   'Calle Mercaderes', 'Arequipa', 'Arequipa Cercado', '51900000006', true, false,
   '{mascotas,paseos}'),

  ('de000000-0000-0000-0001-000000000007', 'de000000-0000-0000-0000-000000000001',
   (select id from public.categories where slug = 'carpinteria'),
   'Carpintería y arreglo de muebles', 'Reparo puertas, roperos y sillas. Trabajo con madera reciclada.',
   'servicios', 'servicio', 'ofrezco', 60,
   'Urb. La Rinconada', 'Arequipa', 'Cayma', '51900000001', true, false,
   '{carpinteria,muebles,hogar}'),

  -- ---------- AYUDA VECINAL (sin precio) ----------
  ('de000000-0000-0000-0001-000000000008', 'de000000-0000-0000-0000-000000000003',
   (select id from public.categories where slug = 'prestamo-herramientas'),
   'Presto taladro y escalera', 'Los presto por el día, solo devolver limpio. Coordinar por WhatsApp.',
   'comunidad', 'prestamo', 'ofrezco', null,
   'Calle Jerusalén 210', 'Arequipa', 'Yanahuara', '51900000003', true, false,
   '{herramientas,prestamo}'),

  ('de000000-0000-0000-0001-000000000009', 'de000000-0000-0000-0000-000000000004',
   (select id from public.categories where slug = 'ayuda-temporal'),
   'Necesito ayuda con compras', 'Soy adulto mayor y no puedo cargar peso. Busco quien me acompañe al mercado los sábados.',
   'comunidad', 'ayuda', 'solicito', null,
   'Sector Miguel Grau', 'Arequipa', 'Paucarpata', '51900000004', false, false,
   '{adultomayor,compras,apoyo}'),

  ('de000000-0000-0000-0001-000000000010', 'de000000-0000-0000-0000-000000000005',
   (select id from public.categories where slug = 'intercambio-habilidades'),
   'Enseño inglés a cambio de clases de guitarra', 'Nivel intermedio. Podemos vernos en el parque los domingos.',
   'comunidad', 'intercambio', 'ofrezco', null,
   'Av. Dolores', 'Arequipa', 'José Luis Bustamante y Rivero', '51900000005', true, false,
   '{ingles,guitarra,intercambio}'),

  ('de000000-0000-0000-0001-000000000011', 'de000000-0000-0000-0000-000000000006',
   (select id from public.categories where slug = 'donaciones'),
   'Dono ropa de niño (4 a 6 años)', 'Ropa en buen estado, lavada. Pasar a recoger en la tarde.',
   'comunidad', 'donacion', 'ofrezco', null,
   'Calle Mercaderes', 'Arequipa', 'Arequipa Cercado', '51900000006', true, false,
   '{donacion,ropa,ninos}'),

  ('de000000-0000-0000-0001-000000000012', 'de000000-0000-0000-0000-000000000002',
   (select id from public.categories where slug = 'ayuda-temporal'),
   'Busco quien cuide a mi abuelita 2 horas', 'Martes y jueves de 3 a 5 pm mientras estoy en el trabajo.',
   'comunidad', 'ayuda', 'solicito', null,
   'Zamácola', 'Arequipa', 'Cerro Colorado', '51900000002', true, false,
   '{adultomayor,cuidado}'),

  -- ---------- GRUPOS DE APOYO (directorio de emergencias) ----------
  ('de000000-0000-0000-0001-000000000013', 'de000000-0000-0000-0000-000000000001',
   (select id from public.categories where slug = 'grupos-apoyo'),
   'Brigada vecinal de Cayma', 'Grupo de 15 vecinos capacitados en primeros auxilios y evacuación. Apoyamos en sismos, incendios y cortes de servicios.',
   'comunidad', 'ayuda', 'ofrezco', null,
   'Urb. La Rinconada', 'Arequipa', 'Cayma', '51900000001', true, true,
   '{brigada,primerosauxilios,emergencias}'),

  ('de000000-0000-0000-0001-000000000014', 'de000000-0000-0000-0000-000000000004',
   (select id from public.categories where slug = 'grupos-apoyo'),
   'Olla común Miguel Grau', 'Preparamos almuerzos para familias afectadas en emergencias. Recibimos donaciones de víveres.',
   'comunidad', 'donacion', 'ofrezco', null,
   'Sector Miguel Grau', 'Arequipa', 'Paucarpata', '51900000004', false, true,
   '{ollacomun,alimentos,emergencias}')
on conflict (id) do nothing;


-- 3. RESEÑAS ("Visto Bueno Vecinal": 3 o más reseñas con promedio >= 4)
--    reviewed_user_id se llena solo con el dueño de la publicación (trigger)
insert into public.reviews (id, author_id, publication_id, rating, comment) values
  -- Gasfitero: 3 reseñas buenas → Visto Bueno
  ('de000000-0000-0000-0002-000000000001', 'de000000-0000-0000-0000-000000000001', 'de000000-0000-0000-0001-000000000001', 5, 'Vino a las 11 de la noche por una fuga. Excelente.'),
  ('de000000-0000-0000-0002-000000000002', 'de000000-0000-0000-0000-000000000003', 'de000000-0000-0000-0001-000000000001', 5, 'Puntual y cobra justo.'),
  ('de000000-0000-0000-0002-000000000003', 'de000000-0000-0000-0000-000000000005', 'de000000-0000-0000-0001-000000000001', 4, 'Buen trabajo, lo recomiendo.'),
  -- Pan artesanal: 3 reseñas → Visto Bueno
  ('de000000-0000-0000-0002-000000000004', 'de000000-0000-0000-0000-000000000002', 'de000000-0000-0000-0001-000000000002', 5, 'El mejor pan de tres puntas de Cayma.'),
  ('de000000-0000-0000-0002-000000000005', 'de000000-0000-0000-0000-000000000004', 'de000000-0000-0000-0001-000000000002', 4, 'Muy rico, a veces se acaba temprano.'),
  ('de000000-0000-0000-0002-000000000006', 'de000000-0000-0000-0000-000000000006', 'de000000-0000-0000-0001-000000000002', 5, 'Siempre fresco.'),
  -- Clases y electricista: menos reseñas (aún sin sello)
  ('de000000-0000-0000-0002-000000000007', 'de000000-0000-0000-0000-000000000001', 'de000000-0000-0000-0001-000000000003', 5, 'Mi hijo subió sus notas.'),
  ('de000000-0000-0000-0002-000000000008', 'de000000-0000-0000-0000-000000000006', 'de000000-0000-0000-0001-000000000004', 3, 'Buen trabajo pero llegó tarde.')
on conflict (id) do nothing;


-- 4. EMERGENCIAS
insert into public.emergencies
  (id, user_id, emergency_type, description, location, region, district, contact_phone, status, created_at)
values
  ('de000000-0000-0000-0003-000000000001', 'de000000-0000-0000-0000-000000000003',
   'persona_vulnerable', 'Vecina adulta mayor vive sola y lleva dos días sin salir. Necesitamos que alguien la visite.',
   'Calle Jerusalén, casa celeste', 'Arequipa', 'Yanahuara', '51900000003', 'activa', now() - interval '40 minutes'),

  ('de000000-0000-0000-0003-000000000002', 'de000000-0000-0000-0000-000000000004',
   'servicios_basicos', 'Corte de agua en todo el sector desde la mañana. Buscamos quién tenga cisterna o bidones.',
   'Sector Miguel Grau', 'Arequipa', 'Paucarpata', '51900000004', 'activa', now() - interval '3 hours'),

  ('de000000-0000-0000-0003-000000000003', 'de000000-0000-0000-0000-000000000002',
   'incendio', 'Amago de incendio en un poste de luz. Ya llegaron los bomberos.',
   'Zamácola, esquina del mercado', 'Arequipa', 'Cerro Colorado', '51900000002', 'atendida', now() - interval '1 day')
on conflict (id) do nothing;


-- 5. VOLUNTARIOS ("Yo ayudo")
insert into public.emergency_volunteers (emergency_id, user_id, message) values
  ('de000000-0000-0000-0003-000000000001', 'de000000-0000-0000-0000-000000000001', 'Voy en 20 minutos, le llevo comida.'),
  ('de000000-0000-0000-0003-000000000002', 'de000000-0000-0000-0000-000000000002', 'Tengo 3 bidones de 20 litros.'),
  ('de000000-0000-0000-0003-000000000002', 'de000000-0000-0000-0000-000000000005', 'Puedo llevar agua en mi camioneta.')
on conflict do nothing;

-- Revisión rápida: debe mostrar 14 publicaciones y 2 con visto_bueno = true
select title, section, district, avg_rating, review_count, visto_bueno
from public.publications_feed
where id::text like 'de000000-%'
order by section, title;
