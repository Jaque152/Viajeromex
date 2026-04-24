-- Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================================
-- 1. LIMPIEZA PREVIA 
-- =====================================================================================
DROP TABLE IF EXISTS public.booking_items_explonix CASCADE;
DROP TABLE IF EXISTS public.cart_items_explonix CASCADE;
DROP TABLE IF EXISTS public.bookings_explonix CASCADE;
DROP TABLE IF EXISTS public.activity_packages_explonix CASCADE;
DROP TABLE IF EXISTS public.activities_explonix CASCADE;
DROP TABLE IF EXISTS public.categories_explonix CASCADE;
DROP TABLE IF EXISTS public.customers_explonix CASCADE;
DROP TABLE IF EXISTS public.contact_messages_explonix CASCADE;
DROP TABLE IF EXISTS public.custom_quotes_explonix CASCADE;
DROP TABLE IF EXISTS public.fifa_experiences_explonix CASCADE;
-- DROP TABLE IF EXISTS public.translations CASCADE;

-- =====================================================================================
-- 2. CREACIÓN DE TABLAS
-- =====================================================================================

CREATE TABLE public.categories_explonix (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  slug VARCHAR NOT NULL UNIQUE
);

CREATE TABLE public.activities_explonix (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  slug VARCHAR NOT NULL UNIQUE,
  description TEXT,
  category_id INTEGER REFERENCES public.categories_explonix(id),
  location VARCHAR,
  images JSONB,
  duration VARCHAR,
  what_you_will_do JSONB,
  itinerary JSONB,
  requirements JSONB,
  important_info JSONB,
  included_general JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.activity_packages_explonix (
  id SERIAL PRIMARY KEY,
  activity_id INTEGER REFERENCES public.activities_explonix(id),
  package_name VARCHAR NOT NULL, 
  price NUMERIC NOT NULL,
  features JSONB,
  min_pax INTEGER DEFAULT 1,
  max_pax INTEGER,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE public.customers_explonix (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  phone VARCHAR,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.custom_quotes_explonix (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR NOT NULL,
  customer_email VARCHAR NOT NULL,
  phone VARCHAR,
  destination VARCHAR,
  pax_qty INTEGER,
  budget VARCHAR,
  special_requests TEXT,
  start_date DATE,
  status VARCHAR DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.contact_messages_explonix (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR,
  phone VARCHAR,
  email VARCHAR,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.cart_items_explonix (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR NOT NULL,
  package_id INTEGER REFERENCES public.activity_packages(id),
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  pax_qty INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bookings_explonix (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES public.customers_explonix(id),
  session_id VARCHAR, 
  total_amount NUMERIC NOT NULL,
  payment_status VARCHAR DEFAULT 'pending',
  transaction_id VARCHAR,
  payment_provider VARCHAR,
  payment_date TIMESTAMPTZ,
  pais VARCHAR,
  direccion TEXT,
  localidad VARCHAR,
  estado VARCHAR,
  codigo_postal VARCHAR,
  order_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.booking_items_explonix (
  id SERIAL PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings_explonix(id),
  package_id INTEGER REFERENCES public.activity_packages(id),
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  pax_qty INTEGER DEFAULT 1,
  unit_price NUMERIC NOT NULL
);

CREATE TABLE public.fifa_experiences_explonix (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  subtitle VARCHAR,
  description TEXT,
  items JSONB DEFAULT '[]'::jsonb,
  image_url TEXT,
  order_index INTEGER DEFAULT 0
);

-- CREATE TABLE public.translations (
--   id SERIAL PRIMARY KEY,
--   key_text TEXT NOT NULL,
--   lang VARCHAR(5) NOT NULL,
--   translated_text TEXT NOT NULL,
--   created_at TIMESTAMPTZ DEFAULT NOW(),
--   UNIQUE(key_text, lang)
-- );

-- =====================================================================================
-- 3. POLÍTICAS DE SEGURIDAD RLS
-- =====================================================================================
ALTER TABLE public.categories_explonix ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities_explonix ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_packages_explonix ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fifa_experiences_explonix ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.translations_explonix ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers_explonix ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings_explonix ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_items_explonix ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_quotes_explonix ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública catálogos" ON public.categories_explonix FOR SELECT USING (true);
CREATE POLICY "Lectura pública actividades" ON public.activities_explonix FOR SELECT USING (true);
CREATE POLICY "Lectura pública paquetes" ON public.activity_packages_explonix FOR SELECT USING (true);
CREATE POLICY "Lectura pública fifa" ON public.fifa_experiences_explonix FOR SELECT USING (true);
--CREATE POLICY "Lectura pública traducciones" ON public.translations FOR SELECT USING (true);
CREATE POLICY "Acceso total a clientes en checkout" ON public.customers_explonix FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total a reservas en checkout" ON public.bookings_explonix FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total a items de reserva" ON public.booking_items_explonix FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir inserción anónima cotizaciones" ON public.custom_quotes_explonix FOR INSERT WITH CHECK (true);

-- =====================================================================================
-- 4. INSERTAR CATEGORÍAS
-- =====================================================================================
INSERT INTO public.categories_explonix (name, slug) VALUES 
('Naturaleza', 'naturaleza'),
('Aventura', 'aventura'),
('Cultura', 'cultura'),
('Gastronomía', 'gastronomia');

-- =====================================================================================
-- 5. INSERTAR EXPERIENCIAS
-- =====================================================================================
INSERT INTO public.activities_explonix (title, slug, category_id, location, duration, description) VALUES
('Cabo San Lucas: Tour en Cuatrimoto', 'cabo-cuatrimoto-tequila', 2, 'Cabo San Lucas, BCS', '2.5 a 3 horas', 'Acelera la adrenalina y descubre el lado más aventurero de Cabo San Lucas conduciendo una cuatrimoto a través del desierto.'),
('Los Cabos: Crucero Pirata al Atardecer', 'crucero-pirata-cabos', 2, 'Los Cabos, BCS', '2 horas', 'Vive una noche diferente a bordo de un auténtico barco pirata en el Mar de Cortés.'),
('Nevado de Toluca: Alcanza la Cima', 'nevado-toluca-cima', 2, 'Estado de México', '1 día', 'Disfruta de una aventura única subiendo al cuarto volcán más alto de México.'),
('Riviera Maya: Aqua Nick Park', 'aqua-nick-riviera-maya', 2, 'Riviera Maya, QROO', '1 día', 'Vive un día lleno de diversión en Aqua Nick Park con toboganes y ríos lentos.'),
('Sayulita: Paseo a Caballo', 'paseo-caballo-sayulita', 2, 'Sayulita, Nayarit', '1 a 2 horas', 'Disfruta de un recorrido a caballo por la selva y la playa de Sayulita.'),
('Cancún: Nada con manatíes', 'manaties-isla-mujeres', 1, 'Isla Mujeres, QROO', '1 día', 'Vive un encuentro único con los gentiles manatíes en Isla Mujeres.'),
('Cuevas de Tolantongo', 'cuevas-tolantongo', 1, 'Hidalgo', '4 horas', 'Sumérgete en un paraíso turquesa oculto entre las montañas.'),
('Nado con Tiburones Ballena', 'tiburon-ballena-desde-cabo', 1, 'La Paz, BCS', '10 horas', 'Vive una experiencia extraordinaria nadando junto al pez más grande del planeta.'),
('Santuario Mariposa Monarca', 'mariposa-monarca-rosario', 1, 'Michoacán', '5 horas', 'Experimenta la magia de las mariposas monarca en su santuario más grande.'),
('Safari Oceánico', 'safari-oceanico-la-paz', 1, 'La Paz, BCS', '5 horas', 'Explora el lado salvaje del Mar de Cortés en busca de vida marina.'),
('Tiburón Ballena con Biólogo', 'nado-tiburon-ballena-biologo', 1, 'La Paz, BCS', '4 horas', 'Nada junto a tiburones ballena guiado por biólogos marinos expertos.'),
('Safari Delfines y Orcas', 'safari-delfines-orcas-paz', 1, 'La Paz, BCS', '8 horas', 'Explora la extraordinaria riqueza marina en un safari oceánico de día completo.'),
('Avistamiento de Ballenas', 'avistamiento-ballenas-cabos', 1, 'Los Cabos, BCS', '2.5 horas', 'Descubre la grandeza natural de Baja California presenciando a las ballenas.'),
('Tour al Arco en Lancha', 'arco-lancha-transparente', 1, 'Los Cabos, BCS', '4 horas', 'Disfruta de un recorrido único hacia el Arco de Cabo San Lucas en lancha transparente.'),
('Avistamiento Arrecife', 'delfines-arrecife-martinica', 1, 'Martinica', '4 horas', 'Navega por la Costa de Sotavento, busca delfines y explora arrecifes de coral.'),
('Liberación de Tortuguitas', 'liberacion-tortugas-vallarta', 1, 'Puerto Vallarta', '2.5 horas', 'Vive una experiencia única ayudando a liberar crías de tortuga golfina.'),
('Santuario Mono y Perezoso', 'santuario-mono-perezoso', 1, 'Roatán, Honduras', '4 horas', 'Aprende sobre la fauna local e interactúa con perezosos, monos e iguanas.'),
('Lucha Libre y Espectáculo', 'lucha-libre-cdmx', 3, 'CDMX', '3.5 horas', 'Diseña tu propia máscara y vibra con un combate de lucha libre en vivo.'),
('Murales de Diego Rivera', 'murales-diego-rivera-cdmx', 3, 'CDMX', '3 horas', 'Sumérgete en la historia de México a través de los murales de Diego Rivera.'),
('Excursión Amealco y Bernal', 'amealco-tequisquiapan-bernal', 3, 'Querétaro', '9 horas', 'Una travesía por el alma de Querétaro y la cultura otomí.'),
('Tour centro histórico', 'tour-morelia-centro', 3, 'Morelia, MICH', '2 horas', 'Explora la arquitectura colonial del centro histórico de Morelia.'),
('Pátzcuaro y Janitzio', 'patzcuaro-janitzio-redes', 3, 'Michoacán', '8 horas', 'Descubre la tradición de las redes de mariposa en el lago de Janitzio.'),
('Peña de Bernal y Cavas', 'bernal-freixenet-queretaro', 3, 'Querétaro', '6 horas', 'Combina la majestuosidad de la Peña de Bernal con la sofisticación de Cavas Freixenet.'),
('Tranvía Clásico', 'tranvia-clasico-queretaro', 3, 'Querétaro', '2 horas', 'Explora los sitios emblemáticos de Querétaro a bordo de un tranvía clásico.'),
('Abejas Mayas y Cata', 'abejas-mayas-xkopek', 3, 'Valladolid, YUC', '1.5 horas', 'Adéntrate en el mundo sagrado de las abejas meliponas.'),
('Museo del Tequila', 'museo-tequila-mezcal-cdmx', 4, 'CDMX', '2 horas', 'Sumérgete en el mundo del tequila y mezcal en la plaza Garibaldi.');
-- =====================================================================================
-- 5. INSERTAR DETALLE DE EXPERIENCIAS
-- =====================================================================================
-- 1. Cabo Cuatrimotos
UPDATE public.activities_explonix SET 
  description = 'Acelera la adrenalina y descubre el lado más aventurero de Cabo San Lucas conduciendo una cuatrimoto a través del desierto, senderos naturales y playas espectaculares frente al Océano Pacífico. Finaliza esta experiencia llena de emoción con una degustación de tequila y vistas que quedarán grabadas en tu memoria.',
  images = '["https://images.pexels.com/photos/7089999/pexels-photo-7089999.jpeg"]'::jsonb,
  what_you_will_do = '["Conducirás una potente cuatrimoto a través del desierto de Baja California", "Explorarás senderos escondidos hasta llegar a la playa de Migriño", "Disfrutarás de una cata de tequilas artesanales al finalizar el recorrido"]'::jsonb,
  itinerary = '["Llegada a las instalaciones y registro", "Explicación de seguridad y manejo", "Recorrido guiado por caminos desérticos", "Llegada a la Playa de Migriño", "Degustación de tequilas artesanales"]'::jsonb,
  requirements = '["Calzado cerrado", "Protector solar biodegradable", "Licencia de conducir vigente (para el conductor)", "Tarjeta de crédito para depósito"]'::jsonb,
  important_info = '{"No apto para": ["Mujeres embarazadas", "Personas con problemas de espalda o cuello", "Menores de 6 años"], "Qué saber antes de ir": ["El impuesto de entrada al parque de $25 USD no está incluido", "El seguro de colisión es opcional ($25 USD)"]}'::jsonb,
  included_general = '["Guía turístico bilingüe", "Equipo de seguridad (casco y gafas)", "Agua purificada", "Capacitación de manejo"]'::jsonb
WHERE slug = 'cabo-cuatrimoto-tequila';

-- 2. Crucero Pirata
UPDATE public.activities_explonix SET 
  description = 'Vive una noche diferente a bordo de un auténtico barco pirata. Navega por el Mar de Cortés disfrutando del atardecer mientras presencias un show en vivo de piratas, degustas una cena estilo barbacoa y aprovechas la barra libre ilimitada.',
  images = '["https://images.pexels.com/photos/343701/pexels-photo-343701.jpeg"]'::jsonb,
  what_you_will_do = '["Navegarás al atardecer por el Mar de Cortés hacia el famoso Arco", "Presenciarás un espectáculo pirata interactivo con acrobacias", "Disfrutarás de una cena completa y barra libre bajo las estrellas"]'::jsonb,
  itinerary = '["Abordaje en el Muelle Cero", "Navegación hacia El Arco y la colonia de leones marinos", "Cena a bordo durante el atardecer", "Espectáculo pirata interactivo", "Regreso al puerto"]'::jsonb,
  requirements = '["Efectivo para el impuesto de muelle", "Cámara fotográfica", "Suéter ligero para el regreso"]'::jsonb,
  important_info = '{"Qué saber antes de ir": ["El impuesto de muelle de $5 USD no está incluido y se paga en efectivo al abordar", "Llegar 30 minutos antes del zarpe"]}'::jsonb,
  included_general = '["Espectáculo interactivo en vivo a bordo", "Cena barbacoa estilo pirata", "Barra libre ilimitada nacional"]'::jsonb
WHERE slug = 'crucero-pirata-cabos';

-- 3. Nevado Toluca
UPDATE public.activities_explonix SET 
  description = 'Disfruta de una aventura única subiendo al cuarto volcán más alto de México. Recorre senderos boscosos, experimenta el cambio de ecosistema de alta montaña y admira las impresionantes Lagunas del Sol y de la Luna ubicadas directamente en el cráter.',
  images = '["https://images.pexels.com/photos/13049245/pexels-photo-13049245.jpeg"]'::jsonb,
  what_you_will_do = '["Realizarás senderismo de alta montaña guiado por expertos", "Admirarás las Lagunas del Sol y de la Luna dentro del cráter", "Alcanzarás una de las cimas más emblemáticas del país"]'::jsonb,
  itinerary = '["Encuentro en el punto de partida en CDMX", "Traslado a las faldas del Nevado de Toluca", "Ascenso guiado por el Paso del Quetzal", "Descanso y tiempo libre en las lagunas", "Descenso y regreso a la ciudad"]'::jsonb,
  requirements = '["Calzado especializado de senderismo", "Ropa térmica de 3 capas y chamarra rompevientos", "Lentes de sol y guantes", "Mochila pequeña con agua y snacks"]'::jsonb,
  important_info = '{"No apto para": ["Menores de 12 años y mayores de 60", "Personas con problemas cardíacos o respiratorios", "Embarazadas", "Personas sin condición física previa"], "Qué saber antes de ir": ["Desayunar ligero", "No consumir alcohol 24 horas antes"]}'::jsonb,
  included_general = '["Transporte desde CDMX", "Guía profesional de montaña", "Bastones de senderismo", "Seguro de accidentes", "Pago de derechos del parque"]'::jsonb
WHERE slug = 'nevado-toluca-cima';

-- 4. Aqua Nick
UPDATE public.activities_explonix SET 
  description = 'Vive un día lleno de diversión infinita en Aqua Nick Park en la Riviera Maya. Deslízate por emocionantes toboganes, relájate en los ríos lentos, experimenta el famoso Slime y convive con tus personajes favoritos de Nickelodeon en un entorno acuático espectacular diseñado para toda la familia.',
  images = '["https://images.pexels.com/photos/31166906/pexels-photo-31166906.jpeg"]'::jsonb,
  what_you_will_do = '["Te lanzarás por toboganes de clase mundial", "Navegarás por el río perezoso y el río de aventuras", "Recibirás el icónico baño de Slime verde de Nickelodeon", "Conocerás a Bob Esponja, Patricio y los Padrinos Mágicos"]'::jsonb,
  itinerary = '["Llegada al parque y entrega de pulseras", "Tiempo libre en la zona de toboganes y piscinas", "Super Slime time en la piscina principal", "Almuerzo en los kioscos de Splash Bites", "Cierre del parque"]'::jsonb,
  requirements = '["Traje de baño puesto y cambio de ropa seca", "Sandalias o calzado acuático", "Protector solar estrictamente biodegradable", "Tarjeta de crédito para consumos extra"]'::jsonb,
  important_info = '{"No apto para": ["Ciertos toboganes tienen restricciones de altura mínima de 1.20m", "Embarazadas (en atracciones extremas)"], "Qué saber antes de ir": ["No se permite el ingreso con alimentos ni bebidas externas"]}'::jsonb,
  included_general = '["Acceso ilimitado a todas las atracciones acuáticas", "Comida y bebidas en kioscos (Splash Bites)", "Uso de toallas y camastros"]'::jsonb
WHERE slug = 'aqua-nick-riviera-maya';

-- 5. Sayulita Caballo
UPDATE public.activities_explonix SET 
  description = 'Desconéctate de la rutina y disfruta de un sereno recorrido a caballo por la exuberante selva tropical y las cálidas playas de Sayulita. Una experiencia relajante y en contacto directo con la naturaleza, perfecta para familias, parejas y jinetes de todos los niveles de experiencia.',
  images = '["https://images.pexels.com/photos/32793543/pexels-photo-32793543.jpeg"]'::jsonb,
  what_you_will_do = '["Cabalgarás por senderos ocultos dentro de la selva nayarita", "Llegarás a una playa virgen para galopar frente al océano", "Aprenderás sobre la flora y fauna local con tu guía"]'::jsonb,
  itinerary = '["Llegada a Rancho Mi Chaparrita y asignación de caballo", "Instrucciones básicas de monta y seguridad", "Recorrido guiado por la selva", "Paseo por la línea de playa", "Regreso al rancho y tiempo libre en la piscina"]'::jsonb,
  requirements = '["Calzado cerrado o tenis deportivos (prohibidas chanclas)", "Pantalón largo cómodo (jeans o leggings)", "Repelente de mosquitos y protector solar", "Efectivo para propinas"]'::jsonb,
  important_info = '{"No apto para": ["Bebés menores de 1 año", "Mujeres embarazadas", "Personas con cirugías recientes de columna", "Personas que excedan los 110 kg de peso"]}'::jsonb,
  included_general = '["Caballo asignado según nivel de experiencia", "Guía bilingüe experto", "Todo el equipo de montura necesario", "Agua embotellada", "Acceso a baños y piscina del rancho"]'::jsonb
WHERE slug = 'paseo-caballo-sayulita';

-- 6. Cancun Manaties
UPDATE public.activities_explonix SET 
  description = 'Vive un encuentro único y conmovedor con los gentiles manatíes en las aguas cristalinas de Isla Mujeres. Durante este programa interactivo, aprenderás sobre la dieta, el comportamiento y los esfuerzos de conservación de estos increíbles mamíferos marinos mientras compartes el agua con ellos. Además del encuentro, disfrutarás de un día completo de relajación en nuestras instalaciones con acceso a piscinas, comida buffet y bebidas.',
  images = '["https://images.pexels.com/photos/18647911/pexels-photo-18647911.jpeg"]'::jsonb,
  what_you_will_do = '["Interactuarás de forma segura y respetuosa con los manatíes en el agua", "Aprenderás sobre la conservación marina de la mano de especialistas", "Disfrutarás de un día de club de playa en Isla Mujeres con comida y bebidas"]'::jsonb,
  itinerary = '["Cruce en ferry panorámico desde Cancún a Isla Mujeres", "Orientación educativa sobre los manatíes", "Encuentro interactivo en el agua (40 min)", "Almuerzo buffet internacional y barra libre", "Tiempo libre en piscinas y camastros", "Regreso en ferry a Cancún"]'::jsonb,
  requirements = '["Traje de baño puesto", "Cambio de ropa seca y toalla", "Protector solar biodegradable", "Efectivo para pago de impuesto de muelle"]'::jsonb,
  important_info = '{"No apto para": ["Mujeres con más de 5 meses de embarazo"], "Qué saber antes de ir": ["El impuesto de muelle ($15 USD) se paga al abordar", "No se permite ingresar al agua con cámaras, celulares o joyería"]}'::jsonb,
  included_general = '["Cruce en ferry ida y vuelta", "Encuentro en el agua con manatíes", "Almuerzo buffet y bebidas no alcohólicas", "Uso de instalaciones, taquillas y chaleco salvavidas"]'::jsonb
WHERE slug = 'manaties-isla-mujeres';

-- 7. Tolantongo
UPDATE public.activities_explonix SET 
  description = 'Escapa del bullicio de la ciudad y adéntrate en las majestuosas montañas de Hidalgo para descubrir las Grutas de Tolantongo. Relájate en las icónicas pozas termales color turquesa que se asientan en los acantilados, explora la cueva principal de donde brota el río y camina por el túnel de vapor. Un paraíso natural perfecto para desconectar.',
  images = '["https://images.pexels.com/photos/27703628/pexels-photo-27703628.jpeg"]'::jsonb,
  what_you_will_do = '["Te bañarás en las famosas pozas termales escalonadas en la montaña", "Explorarás el interior de las grutas y cascadas de agua caliente", "Caminarás por el río turquesa rodeado del cañón"]'::jsonb,
  itinerary = '["Salida desde el punto de encuentro", "Llegada al parque ecológico Tolantongo", "Exploración guiada de la Gruta Principal y el río", "Traslado interno hacia la zona de las Pozas", "Tiempo libre para relajarse en las aguas termales", "Regreso al punto de origen"]'::jsonb,
  requirements = '["Zapatos acuáticos (obligatorios por las piedras del río)", "Funda impermeable para celular", "Traje de baño y muda de ropa seca", "Dinero en efectivo (dentro del parque no aceptan tarjetas)"]'::jsonb,
  important_info = '{"No apto para": ["Personas con problemas severos de movilidad (hay múltiples escaleras y pendientes)"], "Qué saber antes de ir": ["Prohibido el uso de bloqueador solar o cremas dentro del río para proteger el ecosistema"]}'::jsonb,
  included_general = '["Transporte redondo", "Boleto de entrada general al parque Grutas de Tolantongo", "Coordinador de viaje", "Transporte interno dentro del parque"]'::jsonb
WHERE slug = 'cuevas-tolantongo';

-- 8. Tiburon Ballena desde Cabo
UPDATE public.activities_explonix SET 
  description = 'Vive una experiencia extraordinaria nadando junto al pez más grande del planeta en su hábitat natural. Este tour de día completo te lleva desde Los Cabos hasta la Bahía de La Paz, donde abordarás una embarcación especializada para buscar y hacer snorkel con el dócil tiburón ballena. Finaliza el día con unos deliciosos tacos locales en el malecón.',
  images = '["https://images.pexels.com/photos/6530412/pexels-photo-6530412.jpeg"]'::jsonb,
  what_you_will_do = '["Viajarás por carretera cruzando el desierto desde Los Cabos hasta La Paz", "Harás snorkel en mar abierto a pocos metros del majestuoso tiburón ballena", "Pasearás por el famoso Malecón de La Paz degustando comida local"]'::jsonb,
  itinerary = '["Pickup en tu hotel en Los Cabos", "Traslado terrestre hacia La Paz con desayuno ligero", "Abordaje de la embarcación y navegación hacia el área de avistamiento", "Snorkel en turnos controlados con el Tiburón Ballena", "Regreso a tierra y almuerzo de tacos tradicionales", "Traslado de regreso a Los Cabos"]'::jsonb,
  requirements = '["Traje de baño (ya puesto)", "Toalla y cambio de ropa seca", "Cámara de acción tipo GoPro", "Chamarra ligera para el traslado matutino"]'::jsonb,
  important_info = '{"No apto para": ["Menores de 8 años", "Mujeres embarazadas", "Personas que no sepan nadar", "Personas con cirugías recientes"], "Qué saber antes de ir": ["El avistamiento depende de la naturaleza, pero la tasa de éxito es del 95% en temporada"]}'::jsonb,
  included_general = '["Transporte terrestre redondo desde Los Cabos", "Desayuno ligero y almuerzo (tacos)", "Guía certificado", "Equipo de snorkel completo (visor, aletas, tubo)", "Chaleco salvavidas y traje de neopreno"]'::jsonb
WHERE slug = 'tiburon-ballena-desde-cabo';

-- 9. Mariposa Monarca
UPDATE public.activities_explonix SET 
  description = 'Adéntrate en los frondosos bosques de oyamel en Michoacán para ser testigo de uno de los fenómenos migratorios más asombrosos del mundo. Millones de mariposas monarca viajan desde Canadá para pasar el invierno en este santuario, cubriendo los árboles de un vibrante color naranja. Una caminata espiritual y en profunda conexión con la naturaleza.',
  images = '["https://images.pexels.com/photos/15217834/pexels-photo-15217834.jpeg"]'::jsonb,
  what_you_will_do = '["Caminarás por los senderos boscosos del Santuario El Rosario", "Observarás racimos gigantes de mariposas monarca colgando de los árboles", "Aprenderás sobre el ciclo de vida y la migración de la especie"]'::jsonb,
  itinerary = '["Llegada a las faldas del Santuario El Rosario", "Ascenso caminando o a caballo (opcional) hacia la zona núcleo", "Tiempo de observación en silencio de las mariposas (aprox 45 min)", "Senderismo de descenso", "Tiempo libre para comida local en el parador turístico"]'::jsonb,
  requirements = '["Calzado cómodo de montaña o tenis con buen agarre", "Ropa abrigada (se recomienda vestirse en capas)", "Protector solar y gorra", "Prismáticos o cámara con buen zoom"]'::jsonb,
  important_info = '{"No apto para": ["Mujeres embarazadas", "Personas con problemas cardíacos, respiratorios o de movilidad", "Personas propensas al mal de altura (supera los 3,000 msnm)"], "Qué saber antes de ir": ["Se debe guardar absoluto silencio en la zona núcleo para no alterar a las mariposas"]}'::jsonb,
  included_general = '["Entrada oficial al Santuario de la Mariposa Monarca", "Guía ejidatario local", "Tickets de peaje y estacionamiento"]'::jsonb
WHERE slug = 'mariposa-monarca-rosario';

-- 10. Safari Oceanico
UPDATE public.activities_explonix SET 
  description = 'Explora el lado más salvaje del Mar de Cortés, conocido como el "Acuario del Mundo". En esta expedición en panga, navegaremos mar adentro buscando encuentros espontáneos con la impresionante fauna local: grandes bancos de delfines, colonias de lobos marinos, mantarrayas gigantes y aves pelágicas.',
  images = '["https://images.pexels.com/photos/17126466/pexels-photo-17126466.jpeg"]'::jsonb,
  what_you_will_do = '["Navegarás en mar abierto por los alrededores de la Isla Espíritu Santo o Isla Cerralvo", "Saltarás al agua para hacer snorkel en los arrecifes cuando se presente la oportunidad", "Aprenderás sobre biología marina con guías expertos"]'::jsonb,
  itinerary = '["Encuentro en la marina de La Paz o La Ventana", "Zarpe y navegación de búsqueda en altamar", "Avistamiento de fauna y sesiones de snorkel espontáneas", "Pausa en una playa prístina para almorzar", "Regreso al puerto base"]'::jsonb,
  requirements = '["Chamarra rompevientos (el viento en altamar es frío)", "Traje de baño y toalla", "Protector solar estrictamente biodegradable", "Medicación para el mareo (tomada antes de zarpar)"]'::jsonb,
  important_info = '{"No apto para": ["Menores de 6 años y mayores de 75", "Mujeres embarazadas", "Personas con alta sensibilidad al mareo o problemas de columna"], "Qué saber antes de ir": ["Es una expedición de estilo safari; los encuentros con animales son 100% salvajes y no se pueden garantizar"]}'::jsonb,
  included_general = '["Navegación en panga con techo de sombra", "Guía biólogo marino bilingüe", "Equipo completo de snorkel", "Almuerzo tipo picnic y bebidas a bordo"]'::jsonb
WHERE slug = 'safari-oceanico-la-paz';

-- 11. Tiburon Ballena Biologo
UPDATE public.activities_explonix SET 
  description = 'Experimenta el nado con tiburones ballena desde una perspectiva científica y de conservación. Acompañado por biólogos marinos investigadores, aprenderás a identificar a los individuos a través de su patrón de manchas y comprenderás los protocolos estrictos para garantizar un encuentro pasivo, seguro y enriquecedor.',
  images = '["https://images.pexels.com/photos/34364422/pexels-photo-34364422.jpeg"]'::jsonb,
  what_you_will_do = '["Nadarás paralelamente al pez más grande del mundo en la bahía de La Paz", "Participarás en la foto-identificación científica de los tiburones observados", "Aprenderás datos fascinantes directamente de los investigadores que los protegen"]'::jsonb,
  itinerary = '["Reunión en las oficinas y charla técnica de conservación", "Caminata al muelle y abordaje", "Navegación corta hacia el Área de Refugio del Tiburón Ballena", "Nados controlados en grupos de máximo 5 personas", "Toma de datos y regreso al muelle"]'::jsonb,
  requirements = '["Traje de baño", "Toalla", "Cámara acuática (prohibido el uso de flash)", "Botella de agua reutilizable"]'::jsonb,
  important_info = '{"No apto para": ["Bebés y niños pequeños", "Personas que no sepan nadar en mar abierto", "Personas con movilidad reducida"], "Qué saber antes de ir": ["Se prohíbe terminantemente tocar a los tiburones ballena"]}'::jsonb,
  included_general = '["Guía biólogo marino certificado", "Embarcación con permisos oficiales de Semarnat", "Equipo de snorkel de alta gama y traje de neopreno", "Fotografías del encuentro con fines científicos"]'::jsonb
WHERE slug = 'nado-tiburon-ballena-biologo';

-- 12. Safari Delfines y Orcas
UPDATE public.activities_explonix SET 
  description = 'Una expedición de mar profundo para verdaderos amantes del océano. Pasaremos hasta 8 horas navegando en el Mar de Cortés en busca de los grandes depredadores pelágicos. Aunque los avistamientos de orcas son raros y especiales, las posibilidades de nadar con inmensas manadas de delfines salvajes y leones marinos hacen de este safari una experiencia épica.',
  images = '["https://images.pexels.com/photos/4784503/pexels-photo-4784503.jpeg"]'::jsonb,
  what_you_will_do = '["Explorarás zonas alejadas de la costa en busca de megafauna marina", "Te deslizarás al agua para interactuar con delfines en libertad (si las condiciones lo permiten)", "Disfrutarás del entorno virgen de las islas del Golfo de California"]'::jsonb,
  itinerary = '["Zarpe a primera hora de la mañana", "Navegación intensiva de exploración mar adentro (cubriendo grandes distancias)", "Interacciones y snorkel", "Parada breve para almuerzo a bordo", "Continuación de la búsqueda y regreso al atardecer"]'::jsonb,
  requirements = '["Ropa cómoda en capas y chamarra rompevientos", "Sombrero o gorra que no vuele con el viento y lentes polarizados", "Protector solar amigable con el arrecife", "Pastillas para el mareo"]'::jsonb,
  important_info = '{"No apto para": ["Mujeres embarazadas", "Personas con problemas de columna (el bote puede golpear fuerte las olas)", "Personas propensas a mareos severos"], "Qué saber antes de ir": ["Esta es una actividad de paciencia y búsqueda, pasaremos muchas horas en el barco"]}'::jsonb,
  included_general = '["Safari oceánico en embarcación rápida y segura", "Capitán experimentado y guía especializado", "Snacks, almuerzo ligero y bebidas hidratantes", "Equipo de snorkel"]'::jsonb
WHERE slug = 'safari-delfines-orcas-paz';

-- 13. Avistamiento de Ballenas Cabos
UPDATE public.activities_explonix SET 
  description = 'Cada invierno, las majestuosas ballenas jorobadas migran a las cálidas aguas de Los Cabos para aparearse y dar a luz. Sube a bordo de nuestras embarcaciones cómodas y seguras para presenciar los espectaculares saltos, aleteos y cantos de estos gigantes del océano, todo con el icónico Arco de Cabo San Lucas como telón de fondo.',
  images = '["https://images.pexels.com/photos/17854642/pexels-photo-17854642.jpeg"]'::jsonb,
  what_you_will_do = '["Escucharás el canto de las ballenas jorobadas (en botes equipados con hidrófonos)", "Verás a las crías recién nacidas aprender a nadar junto a sus madres", "Navegarás cerca del Fin de la Tierra y el Arco de Los Cabos"]'::jsonb,
  itinerary = '["Registro en la Marina de Cabo San Lucas", "Paseo panorámico por la Bahía, Playa del Amor y la colonia de Leones Marinos", "Navegación mar adentro en el Pacífico o el Mar de Cortés (dependiendo de la actividad de las ballenas)", "Tiempo de avistamiento y toma de fotografías", "Regreso a la marina"]'::jsonb,
  requirements = '["Cámara con buen zoom o teléfono con correa de seguridad", "Chamarra o suéter ligero (las mañanas y tardes pueden ser frías)", "Protector solar y lentes de sol"]'::jsonb,
  important_info = '{"No apto para": ["Niños menores de 4 años", "Mujeres con embarazo avanzado", "Personas con lesiones severas de espalda"], "Qué saber antes de ir": ["Los capitanes respetan estrictamente la distancia oficial dictada por las leyes de protección marina"]}'::jsonb,
  included_general = '["Embarcación estable con techo de sombra y baño marino", "Guía naturalista bilingüe experto en cetáceos", "Agua embotellada", "Chalecos salvavidas"]'::jsonb
WHERE slug = 'avistamiento-ballenas-cabos';

-- 14. Lancha Transparente Cabos
UPDATE public.activities_explonix SET 
  description = 'Descubre los secretos del Mar de Cortés de una forma completamente nueva: a bordo de una lancha con fondo y laterales totalmente transparentes. Mientras navegas hacia el famoso Arco de Cabo San Lucas, podrás ver bajo tus pies el arrecife de coral, coloridos peces tropicales y el fascinante relieve submarino sin necesidad de mojarte.',
  images = '["https://images.pexels.com/photos/5879318/pexels-photo-5879318.jpeg"]'::jsonb,
  what_you_will_do = '["Observarás la vida marina a través del acrílico transparente de la embarcación", "Visitarás el Dedo de Neptuno, la Playa del Amor y la Playa del Divorcio", "Tomarás la foto obligada frente al monumental Arco de Los Cabos"]'::jsonb,
  itinerary = '["Zarpe desde la marina", "Recorrido bordeando la costa hacia el Fin de la Tierra (Land''s End)", "Observación de peces desde la lancha", "Parada frente al Arco y la colonia de lobos marinos para fotos", "Regreso al puerto", "Opcional: Degustación de tequila en la marina"]'::jsonb,
  requirements = '["Ropa cómoda de playa y sombrero", "Prohibido estrictamente el uso de zapatos con tacón (se debe abordar descalzo o con sandalias suaves)", "Protector solar"]'::jsonb,
  important_info = '{"No apto para": ["Personas que pesen más de 120 kg (por distribución de peso en la lancha)", "Personas con vértigo o fobia al mar"], "Qué saber antes de ir": ["El impuesto de uso de marina ($100 MXN) no está incluido"]}'::jsonb,
  included_general = '["Paseo en embarcación 100% transparente", "Capitán y guía bilingüe", "Chalecos salvavidas (obligatorios durante el paseo)", "Cata de tequila al terminar (solo adultos)"]'::jsonb
WHERE slug = 'arco-lancha-transparente';

-- 15. Martinica Delfines Arrecife
UPDATE public.activities_explonix SET 
  description = 'Zarpa hacia las cálidas y turquesas aguas del Mar Caribe bordeando la pintoresca costa de Sotavento de la isla de Martinica. Este tour en barco te ofrece una mañana relajante donde buscaremos juguetones delfines en su hábitat y haremos paradas en hermosas calas coralinas para nadar y explorar el vibrante fondo marino.',
  images = '["https://images.pexels.com/photos/9406890/pexels-photo-9406890.jpeg"]'::jsonb,
  what_you_will_do = '["Navegarás por la costa caribeña disfrutando de los paisajes volcánicos de la isla", "Observarás delfines nadando en la proa del barco", "Harás snorkel en aguas cristalinas repletas de coloridos peces tropicales y tortugas marinas"]'::jsonb,
  itinerary = '["Salida desde el muelle principal", "Crucero escénico hacia el norte de la costa caribeña", "Búsqueda y observación de cetáceos", "Parada en una ensenada protegida para hacer snorkel", "Visita rápida a la histórica cueva de murciélagos", "Brindis con bebidas locales y regreso"]'::jsonb,
  requirements = '["Traje de baño y toalla", "Lentes de sol, sombrero y protector solar amigable con corales", "Cámara resistente al agua"]'::jsonb,
  important_info = '{"No apto para": ["Personas en silla de ruedas debido a los accesos del barco"], "Qué saber antes de ir": ["Traer identificación oficial (pasaporte) ya que es un tour internacional"]}'::jsonb,
  included_general = '["Recorrido en bote cómodo y seguro", "Guía local y capitán", "Equipo de snorkel (visor y tubo)", "Aperitivos caribeños, ponche de frutas y ron local"]'::jsonb
WHERE slug = 'delfines-arrecife-martinica';

-- 16. Tortugas Vallarta
UPDATE public.activities_explonix SET 
  description = 'Conéctate con la naturaleza y participa activamente en la conservación marina en las costas de Puerto Vallarta. Durante la temporada de desove, cientos de tortugas golfinas llegan a estas playas. Acompaña a los biólogos del campamento tortuguero al atardecer para liberar a las pequeñas crías recién nacidas, protegiéndolas de los depredadores hasta que alcancen el océano.',
  images = '["https://images.pexels.com/photos/10041664/pexels-photo-10041664.jpeg"]'::jsonb,
  what_you_will_do = '["Aprenderás sobre el ciclo de vida y los retos de supervivencia de las tortugas marinas", "Conocerás el corral de incubación donde se protegen los nidos rescatados", "Ayudarás a liberar una o más tortuguitas en la arena y las verás caminar hacia las olas al atardecer"]'::jsonb,
  itinerary = '["Llegada al campamento tortuguero (ubicado en la playa de Nuevo Vallarta/Boca de Tomates)", "Plática educativa y concientización impartida por biólogos", "Entrega de las crías en contenedores adecuados", "Caminata a la orilla del mar justo al ocultarse el sol", "Liberación y observación hasta que ingresan al agua"]'::jsonb,
  requirements = '["Ropa ligera y cómoda", "Repelente de insectos ecológico (indispensable para el atardecer en la playa)", "Cámara fotográfica (IMPORTANTE: Desactivar el flash)", "Sandalias fáciles de quitar"]'::jsonb,
  important_info = '{"No apto para": ["Menores de 5 años solo pueden observar, no manipular a las crías"], "Qué saber antes de ir": ["Está estrictamente prohibido tocar a las tortugas con las manos llenas de cremas, repelentes o arena seca; se deben seguir las instrucciones de los biólogos al pie de la letra"]}'::jsonb,
  included_general = '["Plática ecológica", "Participación en la liberación oficial", "Donativo directo al campamento tortuguero para apoyar sus labores", "Agua embotellada"]'::jsonb
WHERE slug = 'liberacion-tortugas-vallarta';

-- 17. Roatan Monos
UPDATE public.activities_explonix SET 
  description = 'Descubre el lado más exótico y tierno de la isla de Roatán. Visita un santuario dedicado a la preservación y rehabilitación de la fauna hondureña. Camina entre frondosos jardines tropicales donde interactuarás cara a cara con simpáticos monos capuchinos, coloridas guacamayas y tendrás la oportunidad única de sostener en tus brazos a un dócil perezoso de tres dedos.',
  images = '["https://images.pexels.com/photos/13544719/pexels-photo-13544719.jpeg"]'::jsonb,
  what_you_will_do = '["Cargarás y abrazarás a los famosos y tranquilos perezosos de la isla", "Verás a los curiosos monos ardilla saltar y jugar cerca de ti", "Disfrutarás de tiempo libre en un club de playa privado del Caribe"]'::jsonb,
  itinerary = '["Traslado desde tu hotel o puerto de cruceros al Santuario (Monkey and Sloth Hangout)", "Recorrido guiado por el parque interactuando con los animales rescatados", "Traslado a la costa oeste de la isla (West Bay o West End)", "Tiempo libre en club de playa para nadar y relajarse", "Regreso al punto de inicio"]'::jsonb,
  requirements = '["Ropa fresca tropical", "Repelente de insectos", "Traje de baño y toalla para la parte del club de playa", "Dinero extra para comida y bebidas en la playa"]'::jsonb,
  important_info = '{"Qué saber antes de ir": ["Al interactuar con los perezosos, se te pedirá quitarte joyas u objetos que puedan lastimarlos", "Los perezosos son animales muy sensibles; se requiere movimientos lentos y voz baja a su alrededor"]}'::jsonb,
  included_general = '["Transporte en vehículo con aire acondicionado", "Entrada al santuario de fauna", "Guía local experto", "Pase de entrada al club de playa con uso de instalaciones (sillas de playa, WiFi y baños)"]'::jsonb
WHERE slug = 'santuario-mono-perezoso';

-- 18. Lucha Libre CDMX
UPDATE public.activities_explonix SET 
  description = 'Sumérgete en la vibrante y folclórica cultura de México con una noche de Lucha Libre. Antes de dirigirte a la icónica Arena México, participarás en un taller interactivo donde conocerás la historia detrás de las máscaras y crearás la tuya propia. Después, disfrutarás de cervezas mientras gritas, ríes y te emocionas con las acrobacias aéreas de los técnicos y las rudezas de los rudos en la catedral de la lucha libre.',
  images = '["https://images.pexels.com/photos/30098651/pexels-photo-30098651.jpeg"]'::jsonb,
  what_you_will_do = '["Personalizarás tu propia máscara de luchador en un taller creativo", "Aprenderás sobre las leyendas del ring como El Santo y Blue Demon", "Experimentarás el ambiente eléctrico, los gritos y la pasión del espectáculo en vivo dentro de la Arena México"]'::jsonb,
  itinerary = '["Punto de encuentro en una cervecería de la Colonia Roma", "Charla cultural y taller de máscaras acompañado de cerveza", "Caminata en grupo hacia la Arena México (aprox. 15 min)", "Ingreso y acomodo en las butacas preferentes", "Disfrute de 2 horas de peleas estelares", "Fin del tour a las afueras de la arena"]'::jsonb,
  requirements = '["Calzado extremadamente cómodo", "Dinero en efectivo (dentro de la arena no aceptan tarjeta para snacks o souvenirs típicos)"]'::jsonb,
  important_info = '{"No apto para": ["Personas muy sensibles a los ruidos fuertes, gritos y luces estroboscópicas"], "Qué saber antes de ir": ["Por políticas estrictas de la Arena México, ESTÁ PROHIBIDO ingresar cámaras fotográficas profesionales, de video o GoPro. Solo se permite la cámara del celular", "La caminata de regreso al hotel no está incluida"]}'::jsonb,
  included_general = '["Entrada oficial a la Arena México", "Máscara de luchador de regalo", "Materiales para el taller", "Degustación de cerveza durante la previa", "Anfitrión bilingüe experto"]'::jsonb
WHERE slug = 'lucha-libre-cdmx';

-- 19. Murales Diego Rivera CDMX
UPDATE public.activities_explonix SET 
  description = 'Viaja a través de la convulsa y fascinante historia de México plasmada en las paredes de sus edificios más emblemáticos. En este recorrido cultural a pie por el Centro Histórico, un experto en historia del arte te guiará para decodificar los símbolos, los ideales políticos y las historias de amor ocultas en los monumentales frescos pintados por Diego Rivera y otros grandes exponentes del muralismo mexicano.',
  images = '["https://images.pexels.com/photos/18375509/pexels-photo-18375509.jpeg"]'::jsonb,
  what_you_will_do = '["Admirarás los inmensos murales del Palacio Nacional y la Secretaría de Educación Pública", "Descubrirás la técnica al fresco y el mensaje revolucionario detrás del arte", "Observarás el famoso mural ''Sueño de una tarde dominical en la Alameda Central''"]'::jsonb,
  itinerary = '["Encuentro en el Zócalo capitalino", "Recorrido por los patios de Palacio Nacional (sujeto a disponibilidad gubernamental)", "Visita a la Secretaría de Educación Pública (SEP)", "Caminata histórica por calle Tacuba hacia la Alameda", "Ingreso al Museo Mural Diego Rivera", "Fin del tour en las inmediaciones de Bellas Artes"]'::jsonb,
  requirements = '["Calzado muy cómodo para caminar varias horas por el centro", "Identificación oficial (Pasaporte o INE) obligatoria para ingresar a los recintos gubernamentales", "Sombrero y botella de agua"]'::jsonb,
  important_info = '{"No apto para": ["Personas en silla de ruedas (algunos recintos históricos no cuentan con rampas accesibles o elevadores habilitados)"], "Qué saber antes de ir": ["Los recintos como Palacio Nacional pueden cerrar sin previo aviso por eventos oficiales del gobierno. En tal caso, el guía adaptará la ruta hacia murales alternativos (San Ildefonso, Bellas Artes)"]}'::jsonb,
  included_general = '["Guía certificado experto en historia del arte", "Boletos de acceso a los museos del recorrido", "Auriculares de radio para escuchar claramente al guía en zonas concurridas"]'::jsonb
WHERE slug = 'murales-diego-rivera-cdmx';

-- 20. Excursion Amealco
UPDATE public.activities_explonix SET 
  description = 'Adéntrate en el corazón cultural del estado de Querétaro. Este viaje de día completo te llevará desde la herencia indígena de los otomíes hasta la majestuosidad geológica de la Sierra Gorda. Conocerás el Pueblo Mágico de Amealco, cuna de la famosa muñeca artesanal "Lele", pasearás por las pintorescas calles de Tequisquiapan y te maravillarás a las faldas de la Peña de Bernal, el tercer monolito más grande del mundo.',
  images = '["https://images.pexels.com/photos/30365352/pexels-photo-30365352.jpeg"]'::jsonb,
  what_you_will_do = '["Aprenderás a confeccionar tu propia muñeca otomí (Lele) junto a artesanas locales", "Caminarás por la plaza principal y los mercados de artesanías de Tequisquiapan", "Probarás las famosas gorditas de maíz quebrado a las faldas del monolito de Bernal"]'::jsonb,
  itinerary = '["Salida desde la ciudad de Querétaro", "Llegada a Amealco y taller de artesanía textil", "Traslado a Tequisquiapan y tiempo libre para explorar y almorzar", "Viaje hacia San Sebastián Bernal", "Caminata guiada por las calles del pueblo mágico de Bernal y vistas del monolito", "Regreso a Querétaro al atardecer"]'::jsonb,
  requirements = '["Ropa ligera para el día y un suéter para la tarde (el clima cambia drásticamente)", "Zapatos cómodos para caminar por calles empedradas", "Efectivo para comprar artesanías directamente a los productores locales"]'::jsonb,
  important_info = '{"Qué saber antes de ir": ["Este tour NO incluye el ascenso o escalada a la cima de la Peña de Bernal, solo la visita al pueblo a sus pies y miradores", "Es un tour de día completo con traslados largos entre los diferentes pueblos"]}'::jsonb,
  included_general = '["Transporte redondo desde Querétaro", "Guía certificado", "Materiales e instrucción para el taller de la muñeca artesanal en Amealco", "Seguro de viajero a bordo del transporte"]'::jsonb
WHERE slug = 'amealco-tequisquiapan-bernal';

-- 21. Morelia Centro
UPDATE public.activities_explonix SET 
  description = 'Descubre por qué el corazón de Morelia fue declarado Patrimonio de la Humanidad por la UNESCO. Construida majestuosamente con cantera rosa, esta ciudad virreinal esconde secretos, leyendas coloniales y joyas arquitectónicas inigualables. Camina junto a un historiador local a través de plazas señoriales, enormes acueductos y templos imponentes que te transportarán en el tiempo.',
  images = '["https://images.pexels.com/photos/29540904/pexels-photo-29540904.jpeg"]'::jsonb,
  what_you_will_do = '["Admirarás la imponente Catedral de Morelia y su órgano monumental", "Visitarás el interior del Palacio de Gobierno y sus murales que relatan la independencia", "Caminarás a lo largo del Acueducto y la fuente de las Tarascas", "Disfrutarás de los colores y olores del Mercado de Dulces y Artesanías"]'::jsonb,
  itinerary = '["Encuentro en la Plaza de Armas", "Visita guiada a la Catedral", "Recorrido por los portales virreinales y el Palacio de Gobierno", "Caminata por el callejón del romance hacia el Conservatorio de las Rosas", "Visita al Mercado de Dulces y el Palacio Clavijero", "Fin del recorrido cerca del Acueducto"]'::jsonb,
  requirements = '["Calzado muy cómodo (todo el recorrido es peatonal sobre adoquín)", "Sombrero, gorra o sombrilla", "Cámara fotográfica"]'::jsonb,
  important_info = '{"Qué saber antes de ir": ["Al tratarse de edificios religiosos activos, se requiere vestimenta decorosa (evitar escotes profundos o shorts muy cortos para ingresar a la Catedral)", "El itinerario es flexible al ser un tour privado"]}'::jsonb,
  included_general = '["Guía de turismo certificado exclusivo para tu grupo", "Diseño de ruta personalizada", "Recomendaciones gastronómicas locales"]'::jsonb
WHERE slug = 'tour-morelia-centro';

-- 22. Patzcuaro Janitzio
UPDATE public.activities_explonix SET 
  description = 'Viaja a la región lacustre de Michoacán, el hogar del imperio Purépecha. Este viaje te llevará a explorar las tranquilas aguas del Lago de Pátzcuaro a bordo de una lancha tradicional hasta llegar a la mítica isla de Janitzio. Observa a los pescadores desplegar sus icónicas redes en forma de mariposa y camina por los callejones empinados de la isla hasta llegar a la cima coronada por la colosal estatua de José María Morelos.',
  images = '["https://images.pexels.com/photos/16578772/pexels-photo-16578772.jpeg"]'::jsonb,
  what_you_will_do = '["Navegarás por el lago observando la técnica ancestral de la pesca con red de mariposa", "Subirás los estrechos senderos de Janitzio llenos de artesanías y olores a charales fritos", "Conocerás el encantador centro histórico de Pátzcuaro, la Plaza Vasco de Quiroga y la Basílica"]'::jsonb,
  itinerary = '["Salida desde Morelia hacia Pátzcuaro", "Llegada al muelle general y abordaje de la lancha colectiva", "Travesía por el lago y llegada a la Isla de Janitzio", "Tiempo libre para subir al mirador del monumento y probar la gastronomía de la isla", "Regreso al continente y caminata guiada por el centro de Pátzcuaro (Casa de los 11 Patios)", "Retorno a Morelia"]'::jsonb,
  requirements = '["Zapatos extremadamente cómodos y con suela antiderrapante", "Suéter o chamarra (el clima del lago suele ser frío por las mañanas)", "Efectivo en billetes pequeños para comprar souvenirs o comida en la isla"]'::jsonb,
  important_info = '{"No apto para": ["Personas en silla de ruedas o con movilidad severamente reducida (la isla de Janitzio tiene cientos de escalones empinados e irregulares)"], "Qué saber antes de ir": ["El clima puede ser muy cambiante, ir preparado para lluvia en verano"]}'::jsonb,
  included_general = '["Transportación redonda desde Morelia", "Boletos de lancha (viaje colectivo) hacia la isla", "Guía chofer experto en cultura purépecha"]'::jsonb
WHERE slug = 'patzcuaro-janitzio-redes';

-- 23. Bernal Freixenet
UPDATE public.activities_explonix SET 
  description = 'Deleita tus sentidos en la principal región vitivinícola del centro de México. Este tour combina la impresionante geología de Querétaro con su exquisita cultura del vino. Descenderás a 25 metros de profundidad para conocer las cavas de maduración de Finca Sala Vivé (Freixenet), aprenderás sobre la elaboración de vinos espumosos y terminarás la tarde paseando por el mágico pueblo de Bernal, bajo la sombra de su inmenso monolito.',
  images = '["https://images.pexels.com/photos/36789950/pexels-photo-36789950.jpeg"]'::jsonb,
  what_you_will_do = '["Aprenderás el método tradicional (champenoise) de elaboración de vinos espumosos", "Explorarás los oscuros y fríos túneles subterráneos repletos de barricas", "Disfrutarás de una cata de vino en copa de cristal (que podrás llevarte de recuerdo)", "Caminarás por Bernal para comprar dulces de leche y admirar la Peña"]'::jsonb,
  itinerary = '["Salida desde el centro de Querétaro", "Llegada a las instalaciones de Cavas Freixenet en Ezequiel Montes", "Recorrido guiado por un sommelier hacia el fondo de las cavas (1.5 hrs)", "Degustación de vino", "Traslado a San Sebastián Bernal", "Tiempo libre para explorar el pueblo, almorzar y tomar fotos (2 hrs)", "Regreso a Querétaro"]'::jsonb,
  requirements = '["Suéter ligero (la temperatura dentro de las cavas subterráneas es fría y constante, alrededor de 15°C)", "Zapatos cómodos para el descenso a las cavas y las calles empedradas de Bernal", "Identificación para comprobar mayoría de edad"]'::jsonb,
  important_info = '{"No apto para": ["Personas con claustrofobia extrema (el recorrido desciende varios pisos bajo tierra)"], "Qué saber antes de ir": ["Los menores de edad pueden hacer el recorrido pero no recibirán degustación de alcohol", "Este tour no incluye el ascenso a la cima de la Peña"]}'::jsonb,
  included_general = '["Transporte desde Querétaro", "Boleto de entrada a la Finca Sala Vivé by Freixenet", "Recorrido en cavas con sommelier", "Cata de vino y copa de recuerdo", "Visita guiada en Bernal"]'::jsonb
WHERE slug = 'bernal-freixenet-queretaro';

-- 24. Tranvia Queretaro
UPDATE public.activities_explonix SET 
  description = 'Descubre las historias, mitos y leyendas de la época virreinal de una manera divertida y nostálgica. A bordo de una réplica de un tranvía de principios de siglo XX, recorrerás las calles adoquinadas del centro de Santiago de Querétaro, pasando por sus monumentos más majestuosos mientras un guía caracterizado narra los pasajes más emocionantes que forjaron la Independencia de México.',
  images = '["https://images.pexels.com/photos/21952270/pexels-photo-21952270.jpeg"]'::jsonb,
  what_you_will_do = '["Viajarás cómodamente en un tranvía abierto ideal para tomar fotografías", "Admirarás la inmensidad de Los Arcos (el acueducto colonial de la ciudad)", "Conocerás el Teatro de la República y el Cerro de las Campanas desde tu asiento"]'::jsonb,
  itinerary = '["Encuentro en el punto de abordaje (Plaza de la Corregidora o Jardín Zenea)", "Inicio del recorrido panorámico", "Paso por el Acueducto, Templo de la Cruz, Panteón de los Queretanos Ilustres", "Paso por el Cerro de las Campanas (dependiendo de la ruta elegida)", "Regreso al punto de inicio"]'::jsonb,
  requirements = '["Cámara fotográfica o celular listo", "Sombrero y bloqueador solar para los recorridos diurnos", "Chamarra ligera para los recorridos nocturnos"]'::jsonb,
  important_info = '{"Qué saber antes de ir": ["Los asientos en el tranvía no están numerados, se recomienda llegar 15 minutos antes para elegir un buen lugar", "El tour es panorámico y no incluye descensos ni ingresos a los monumentos"]}'::jsonb,
  included_general = '["Boleto de abordaje al Tranvía Turístico", "Guía narrador a bordo (en español)"]'::jsonb
WHERE slug = 'tranvia-clasico-queretaro';

-- 25. Abejas Mayas Xkopek
UPDATE public.activities_explonix SET 
  description = 'A solo unas cuadras del centro de Valladolid, escóndete en la selva en Xkopek, un parque apícola único construido alrededor de un cenote seco. Aquí descubrirás el mundo sagrado de las abejas meliponas (abejas sin aguijón nativas de la región), veneradas por los antiguos mayas. Aprenderás sobre su forma de vida y degustarás las diferentes mieles medicinales que producen, rodeado de historias mayas.',
  images = '["https://images.pexels.com/photos/18231103/pexels-photo-18231103.jpeg"]'::jsonb,
  what_you_will_do = '["Descenderás a un misterioso cenote seco que sirve como refugio natural", "Caminarás por un sendero en la selva identificando flora endémica", "Visitarás un meliponario tradicional (jobones) para ver a las abejas de cerca y sin peligro", "Disfrutarás de una cata de diferentes tipos de miel virgen"]'::jsonb,
  itinerary = '["Llegada al parque Xkopek en Valladolid", "Caminata por la selva y descenso al cenote seco", "Charla sobre la deidad maya de las abejas y las especies nativas", "Observación de colmenas tradicionales", "Cata de mieles y descanso con agua de jamaica o chaya", "Oportunidad de compra de productos locales"]'::jsonb,
  requirements = '["Ropa ligera y zapatos cerrados para caminar por senderos de tierra y piedra", "Repelente de insectos 100% orgánico (los químicos fuertes dañan a las abejas)"]'::jsonb,
  important_info = '{"No apto para": ["Menores de 5 años (se requiere atención y silencio durante la observación de colmenas)", "Personas con movilidad reducida (el acceso al cenote seco es por un sendero irregular)"], "Qué saber antes de ir": ["Las abejas meliponas NO tienen aguijón, por lo que el recorrido es completamente seguro para personas alérgicas a las picaduras"]}'::jsonb,
  included_general = '["Entrada oficial al parque apícola Xkopek", "Guía local especializado en herencia maya", "Degustación de mieles y una bebida fresca natural"]'::jsonb
WHERE slug = 'abejas-mayas-xkopek';

-- 26. Museo Tequila Mezcal
UPDATE public.activities_explonix SET 
  description = 'El Museo del Tequila y el Mezcal (MUTEM) es un oasis cultural situado en la icónica y bulliciosa Plaza Garibaldi de la Ciudad de México. En este recorrido, aprenderás a distinguir entre un tequila y un mezcal, conocerás el proceso prehispánico y moderno de destilación del agave, y afinarás tu paladar en una cata guiada, culminando tu experiencia en la terraza con vistas a la plaza de los mariachis.',
  images = '["https://images.pexels.com/photos/19567689/pexels-photo-19567689.jpeg"]'::jsonb,
  what_you_will_do = '["Conocerás los diferentes tipos de agaves, herramientas de cosecha y el proceso de maduración", "Admirarás una increíble colección de botellas históricas de tequila y mezcal", "Aprenderás a catar, oler y degustar correctamente estos destilados mexicanos como un profesional", "Disfrutarás del ambiente festivo de la Plaza Garibaldi"]'::jsonb,
  itinerary = '["Llegada a Plaza Garibaldi y acceso al museo", "Recorrido por las exposiciones interactivas sobre jima y destilación", "Visita a la colección de botellas", "Paso a la sala de catas para degustación guiada", "Tiempo libre en la terraza mirador (La Cantina del Museo)"]'::jsonb,
  requirements = '["Identificación oficial con fotografía (pasaporte o INE)"]'::jsonb,
  important_info = '{"No apto para": ["Menores de 18 años (pueden ingresar al museo pero no participarán de la degustación)"], "Qué saber antes de ir": ["El traslado hacia y desde Plaza Garibaldi no está incluido", "Te sugerimos quedarte en la plaza después del recorrido para contratar una canción de mariachi tradicional"]}'::jsonb,
  included_general = '["Boleto de entrada al museo y exposiciones", "Guía experto embajador del agave", "Cata degustación de tequila y mezcal", "Aperitivos ligeros (sal de gusano, naranjas)"]'::jsonb
WHERE slug = 'museo-tequila-mezcal-cdmx';

-- =====================================================================================
-- 7. INSERTAR PAQUETES DE EXPERIENCIAS
-- =====================================================================================
INSERT INTO public.activity_packages_explonix (activity_id, package_name, price, features) VALUES
((SELECT id FROM public.activities_explonix WHERE slug='cabo-cuatrimoto-tequila'), 'Cuatrimoto Doble', 2600.00, '{"incluye": ["1 Cuatrimoto compartida para 2 personas", "Guía bilingüe", "Degustación Tequila"], "no_incluye": ["Entrada al parque $25 USD por persona", "Seguro colisión $25 USD"]}'::jsonb),
((SELECT id FROM public.activities_explonix WHERE slug='cabo-cuatrimoto-tequila'), 'Cuatrimoto Individual', 4200.00, '{"incluye": ["1 Cuatrimoto de uso exclusivo", "Guía bilingüe", "Degustación Tequila"], "no_incluye": ["Entrada al parque $25 USD", "Seguro colisión $25 USD"]}'::jsonb),

((SELECT id FROM public.activities_explonix WHERE slug='manaties-isla-mujeres'), 'Encuentro interactivo con Ferry', 3400.00, '{"incluye": ["Interacción de 40 min", "Ferry ida y vuelta", "Almuerzo buffet"], "no_incluye": ["Tasa portuaria obligatoria de $15 USD", "Paquete fotográfico"]}'::jsonb),

((SELECT id FROM public.activities_explonix WHERE slug='lucha-libre-cdmx'), 'Tour Taller + Lucha VIP', 3400.00, '{"incluye": ["Taller de máscara", "Máscara de regalo", "Entrada Arena México", "Cerveza ilimitada previa"], "no_incluye": ["Alimentos sólidos en la arena", "Transporte de regreso al hotel"]}'::jsonb),

((SELECT id FROM public.activities_explonix WHERE slug='museo-tequila-mezcal-cdmx'), 'Cata Grupo Reducido', 2600.00, '{"incluye": ["Entrada a MUTEM", "Degustación de 3 tequilas y 2 mezcales", "Snacks tradicionales"], "no_incluye": ["Bebidas adicionales en terraza"]}'::jsonb),
((SELECT id FROM public.activities_explonix WHERE slug='museo-tequila-mezcal-cdmx'), 'Tour Privado Exclusivo', 3500.00, '{"incluye": ["Entrada a MUTEM", "Cata privada premium", "Botella de obsequio"], "no_incluye": ["Traslados a la plaza"]}'::jsonb),

((SELECT id FROM public.activities_explonix WHERE slug='murales-diego-rivera-cdmx'), 'Tour a pie histórico', 2680.00, '{"incluye": ["Tour guiado especializado", "Entrada a museos SEP y Bellas Artes"], "no_incluye": ["Comidas", "Propinas"]}'::jsonb),

((SELECT id FROM public.activities_explonix WHERE slug='cuevas-tolantongo'), 'Acceso General desde CDMX', 1600.00, '{"incluye": ["Transporte redondo desde CDMX", "Entrada a las cuevas", "Transporte interno"], "no_incluye": ["Almuerzo y Desayuno"]}'::jsonb),

((SELECT id FROM public.activities_explonix WHERE slug='tiburon-ballena-desde-cabo'), 'Expedición de Snorkel Completa', 5100.00, '{"incluye": ["Traslado desde Los Cabos", "Equipo snorkel y traje neopreno", "Desayuno ligero y almuerzo de tacos"], "no_incluye": ["Impuesto portuario $5 USD"]}'::jsonb),

((SELECT id FROM public.activities_explonix WHERE slug='mariposa-monarca-rosario'), 'Santuario con transporte', 3200.00, '{"incluye": ["Entrada al santuario", "Tickets de peaje", "Transporte"], "no_incluye": ["Alquiler opcional de caballo de subida"]}'::jsonb),

((SELECT id FROM public.activities_explonix WHERE slug='amealco-tequisquiapan-bernal'), 'Tour Cultural 3 Pueblos', 3780.00, '{"incluye": ["Transporte", "Guía turístico", "Taller de muñecos Lele"], "no_incluye": ["Alimentos"]}'::jsonb),

((SELECT id FROM public.activities_explonix WHERE slug='safari-oceanico-la-paz'), 'Safari Oceánico', 5100.00, '{"incluye": ["Navegación en panga", "Biólogo marino", "Equipo snorkel", "Comida y bebidas"], "no_incluye": ["Propinas"]}'::jsonb),

((SELECT id FROM public.activities_explonix WHERE slug='nado-tiburon-ballena-biologo'), 'Nado en Yate Compartido', 4300.00, '{"incluye": ["Equipo snorkel", "Traje neopreno", "Guía biólogo marino"], "no_incluye": ["Transporte terrestre hasta la marina"]}'::jsonb),

((SELECT id FROM public.activities_explonix WHERE slug='safari-delfines-orcas-paz'), 'Expedición en alta mar', 5300.00, '{"incluye": ["Safari guiado 8 horas", "Snacks y bebidas"], "no_incluye": ["Alimentos fuertes"]}'::jsonb),

((SELECT id FROM public.activities_explonix WHERE slug='avistamiento-ballenas-cabos'), 'Avistamiento Clásico en Bote', 2200.00, '{"incluye": ["Embarcación segura", "Guía experto", "Agua y equipo salvavidas"], "no_incluye": ["Transporte del hotel a marina"]}'::jsonb),

((SELECT id FROM public.activities_explonix WHERE slug='crucero-pirata-cabos'), 'Show y Cena', 1900.00, '{"incluye": ["Espectáculo", "Cena barbacoa", "Barra Libre"], "no_incluye": ["Impuesto portuario de $5 USD"]}'::jsonb),

((SELECT id FROM public.activities_explonix WHERE slug='arco-lancha-transparente'), 'Recorrido cristal', 3500.00, '{"incluye": ["Paseo lancha cristal", "Visita Arco", "Cata de tequila"], "no_incluye": ["Impuesto muelle $100 MXN"]}'::jsonb),

((SELECT id FROM public.activities_explonix WHERE slug='delfines-arrecife-martinica'), 'Tour snorkel Caribe', 1800.00, '{"incluye": ["Guía bilingüe", "Aperitivos locales y bebidas"], "no_incluye": ["Propinas"]}'::jsonb),

((SELECT id FROM public.activities_explonix WHERE slug='tour-morelia-centro'), 'Tour Privado a Pie', 8460.00, '{"incluye": ["Guía local experto exclusivo", "Ruta histórica flexible"], "no_incluye": ["Alimentos y entradas a museos no especificados"]}'::jsonb),

((SELECT id FROM public.activities_explonix WHERE slug='nevado-toluca-cima'), 'Ascenso a cráter', 4500.00, '{"incluye": ["Guía profesional de montaña", "Bastones de apoyo", "Seguro de accidentes"], "no_incluye": ["Alimentos", "Propinas"]}'::jsonb),

((SELECT id FROM public.activities_explonix WHERE slug='patzcuaro-janitzio-redes'), 'Paseo cultural de un día', 3850.00, '{"incluye": ["Guía/conductor", "Boleto de lancha a isla Janitzio"], "no_incluye": ["Alimentos", "Propinas a pescadores"]}'::jsonb),

((SELECT id FROM public.activities_explonix WHERE slug='liberacion-tortugas-vallarta'), 'Liberación Atardecer', 1800.00, '{"incluye": ["Guía especializado en biología", "Donativo al campamento", "Participación en liberación"], "no_incluye": ["Traslados"]}'::jsonb),

((SELECT id FROM public.activities_explonix WHERE slug='bernal-freixenet-queretaro'), 'Cata y Pueblo Mágico', 1600.00, '{"incluye": ["Transporte desde centro", "Entrada a Cavas Freixenet", "Cata de vino"], "no_incluye": ["Ascenso a cima de la Peña"]}'::jsonb),

((SELECT id FROM public.activities_explonix WHERE slug='tranvia-clasico-queretaro'), 'Tour 1 Ruta Corta', 500.00, '{"incluye": ["Boleto en Tranvía", "Guía narrador"], "no_incluye": ["Descensos"]}'::jsonb),
((SELECT id FROM public.activities_explonix WHERE slug='tranvia-clasico-queretaro'), 'Tour 2 Rutas Completas', 900.00, '{"incluye": ["Boleto Tranvía ruta extendida", "Guía narrador"], "no_incluye": ["Descensos"]}'::jsonb),

((SELECT id FROM public.activities_explonix WHERE slug='aqua-nick-riviera-maya'), 'Pase Acceso Total', 5800.00, '{"incluye": ["Entrada total al parque", "Comidas y bebidas en Splash Bites", "Toallas"], "no_incluye": ["Lockers, se rentan por separado"]}'::jsonb),

((SELECT id FROM public.activities_explonix WHERE slug='santuario-mono-perezoso'), 'Visita a Santuario y Club de Playa', 3500.00, '{"incluye": ["Transporte", "Guía", "Entrada a parque de monos", "Pase de club de playa"], "no_incluye": ["Comidas y bebidas en club de playa"]}'::jsonb),

((SELECT id FROM public.activities_explonix WHERE slug='paseo-caballo-sayulita'), 'Paseo Corto (1 hora)', 2200.00, '{"incluye": ["Caballo y equipo", "Guía", "Agua", "Acceso a piscina del rancho"], "no_incluye": ["Propinas"]}'::jsonb),
((SELECT id FROM public.activities_explonix WHERE slug='paseo-caballo-sayulita'), 'Paseo Atardecer (2 horas)', 2150.00, '{"incluye": ["Caballo y equipo", "Paseo por la playa al atardecer", "Acceso a piscina"], "no_incluye": ["Propinas"]}'::jsonb),
((SELECT id FROM public.activities_explonix WHERE slug='paseo-caballo-sayulita'), 'Expedición Larga Selva (2.5 horas)', 2900.00, '{"incluye": ["Caballo y equipo", "Ruta extendida", "Acceso a piscina"], "no_incluye": ["Propinas"]}'::jsonb),

((SELECT id FROM public.activities_explonix WHERE slug='abejas-mayas-xkopek'), 'Tour Meliponas', 800.00, '{"incluye": ["Entrada a parque Xkopek", "Visita cenote seco", "Cata de mieles y bebida"], "no_incluye": ["Transporte al parque"]}'::jsonb);
-- =====================================================================================
-- 8. INSERTAR DETALLES MUNDIAL
-- =====================================================================================
INSERT INTO public.fifa_experiences_explonix (title, subtitle, description, items, image_url, order_index) VALUES
('Estadios y Museos', 'Recorridos Históricos', 'Visitas guiadas a los templos del fútbol y acceso a zonas restringidas.', '["Visitas guiadas a estadios FIFA y campos históricos", "Acceso a vestidores y zonas VIP (fotos y experiencias interactivas)", "Recorridos por museos de fútbol y exhibiciones temáticas"]', 'https://images.pexels.com/photos/12327672/pexels-photo-12327672.jpeg', 1),
('Fan Experiences', 'Interacción Total', 'Zonas de realidad virtual y encuentros con leyendas del deporte.', '["Clínicas de fútbol y retos de habilidades", "Realidad virtual de partidos históricos", "Meet & greet con leyendas"]', 'https://images.pexels.com/photos/33660694/pexels-photo-33660694.jpeg', 2),
('Viewing Parties', 'Eventos en Vivo', 'Proyección de partidos en pantallas gigantes con ambiente temático.', '["Pantallas gigantes", "Trivia y juegos recreativos", "Catering temático y snacks"]', 'https://images.pexels.com/photos/26832707/pexels-photo-26832707.jpeg', 3),
('Cultura y Ciudad', 'Recorridos Urbanos', 'Explora el lado futbolero de las sedes mundialistas.', '["Street football tours", "Bares deportivos icónicos", "Arte urbano y murales de fútbol"]', 'https://images.pexels.com/photos/13201287/pexels-photo-13201287.jpeg', 4),
('Experiencias educativas', 'Historia del fútbol y estrategias de juego', 'Descubre más acerca del fútbol', '["Talleres", "Trivia con premios"]', 'https://images.pexels.com/photos/8455345/pexels-photo-8455345.jpeg', 5);