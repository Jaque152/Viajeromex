-- Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================================
-- 1. LIMPIEZA PREVIA (Namespace Mextripia)
-- =====================================================================================
DROP TABLE IF EXISTS public.booking_items_mextripia CASCADE;
DROP TABLE IF EXISTS public.cart_items_mextripia CASCADE;
DROP TABLE IF EXISTS public.bookings_mextripia CASCADE;
DROP TABLE IF EXISTS public.activity_packages_mextripia CASCADE;
DROP TABLE IF EXISTS public.activities_mextripia CASCADE;
DROP TABLE IF EXISTS public.categories_mextripia CASCADE;
DROP TABLE IF EXISTS public.customers_mextripia CASCADE;
DROP TABLE IF EXISTS public.contact_messages_mextripia CASCADE;
DROP TABLE IF EXISTS public.custom_quotes_mextripia CASCADE;
DROP TABLE IF EXISTS public.fifa_experiences_mextripia CASCADE;

-- =====================================================================================
-- 2. CREACIÓN DE TABLAS ESTANDARIZADAS
-- =====================================================================================
CREATE TABLE public.categories_mextripia (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  slug VARCHAR NOT NULL UNIQUE
);

CREATE TABLE public.activities_mextripia (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  slug VARCHAR NOT NULL UNIQUE,
  description TEXT,
  category_id INTEGER REFERENCES public.categories_mextripia(id),
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

CREATE TABLE public.activity_packages_mextripia (
  id SERIAL PRIMARY KEY,
  activity_id INTEGER REFERENCES public.activities_mextripia(id),
  package_name VARCHAR NOT NULL, 
  price NUMERIC NOT NULL,
  features JSONB,
  min_pax INTEGER DEFAULT 1,
  max_pax INTEGER,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE public.customers_mextripia (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  phone VARCHAR,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.custom_quotes_mextripia (
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

CREATE TABLE public.contact_messages_mextripia (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR,
  phone VARCHAR,
  email VARCHAR,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.cart_items_mextripia (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR NOT NULL,
  package_id INTEGER REFERENCES public.activity_packages_mextripia(id),
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  pax_qty INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bookings_mextripia (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES public.customers_mextripia(id),
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

CREATE TABLE public.booking_items_mextripia (
  id SERIAL PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings_mextripia(id),
  package_id INTEGER REFERENCES public.activity_packages_mextripia(id),
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  pax_qty INTEGER DEFAULT 1,
  unit_price NUMERIC NOT NULL
);

CREATE TABLE public.fifa_experiences_mextripia (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  subtitle VARCHAR,
  description TEXT,
  items JSONB DEFAULT '[]'::jsonb,
  image_url TEXT,
  order_index INTEGER DEFAULT 0
);

-- =====================================================================================
-- 3. POLÍTICAS DE SEGURIDAD RLS
-- =====================================================================================
ALTER TABLE public.categories_mextripia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities_mextripia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_packages_mextripia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fifa_experiences_mextripia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers_mextripia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings_mextripia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_items_mextripia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_quotes_mextripia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages_mextripia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items_mextripia ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública catálogos" ON public.categories_mextripia FOR SELECT USING (true);
CREATE POLICY "Lectura pública actividades" ON public.activities_mextripia FOR SELECT USING (true);
CREATE POLICY "Lectura pública paquetes" ON public.activity_packages_mextripia FOR SELECT USING (true);
CREATE POLICY "Lectura pública fifa" ON public.fifa_experiences_mextripia FOR SELECT USING (true);
CREATE POLICY "Acceso total a clientes en checkout" ON public.customers_mextripia FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total a reservas en checkout" ON public.bookings_mextripia FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total a items de reserva" ON public.booking_items_mextripia FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir inserción anónima cotizaciones" ON public.custom_quotes_mextripia FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir inserción anónima contactos" ON public.contact_messages_mextripia FOR INSERT WITH CHECK (true);
CREATE POLICY "Acceso total carrito" ON public.cart_items_mextripia FOR ALL USING (true) WITH CHECK (true);

-- =====================================================================================
-- 4. INSERTAR CATEGORÍAS
-- =====================================================================================
INSERT INTO public.categories_mextripia (name, slug) VALUES 
('Tours Urbanos', 'tours-urbanos'),
('Clases y Talleres', 'clases-talleres'),
('Experiencias Acuáticas', 'experiencias-acuaticas'),
('Rutas Tradicionales', 'rutas-tradicionales');

-- =====================================================================================
-- 5. INSERTAR 19 EXPERIENCIAS GASTRONÓMICAS (Con imágenes contextualmente precisas)
-- =====================================================================================
INSERT INTO public.activities_mextripia (title, slug, category_id, location, duration, description, images, included_general, important_info) VALUES
(
  'Plan Gastronómico "Sabor Local" y Tour San Rafael & Mercado Tacuba', 
  'sabor-local-san-rafael', 1, 'Entrada principal del Mercado San Rafael', '3 horas aproximadamente', 
  'Descubre los sabores auténticos de la Ciudad de México con nuestro recorrido guiado por los mercados más tradicionales. Este tour incluye degustaciones de antojitos, bebidas locales, productos artesanales y un acercamiento a la cultura culinaria del corazón de la ciudad.',
  '["https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=2070"]'::jsonb, -- Colorful Mexican market stall
  '["Guía gastronómico experto.", "Degustaciones en 5-7 puestos seleccionados del mercado.", "Bebidas típicas de la zona.", "Experiencia cultural y breve historia de los mercados visitados.", "Mapa y recomendaciones para seguir explorando por tu cuenta."]'::jsonb,
  '{"Horario de inicio": ["10:00 a.m."], "Notas": ["Todos nuestros servicios turísticos ofrecen guía español e inglés.", "El servicio de transporte no está contemplado; en caso de requerirse, tendrá un costo adicional."]}'::jsonb
),
(
  'Plan Gastronómico "Cocina Abierta Mexicana" y Tour Gourmet CDMX', 
  'cocina-abierta-gourmet', 1, 'Lobby del restaurante principal designado', '3 horas aproximadamente', 
  'Sumérgete en los sabores contemporáneos y tradicionales de la Ciudad de México con nuestro recorrido guiado por restaurantes y bares de cocina abierta. Este tour incluye degustaciones de platillos gourmet, bebidas típicas, y la oportunidad de ver a los chefs en acción.',
  '["https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=2070"]'::jsonb, -- Modern Mexican restaurant plating
  '["Guía gastronómico especializado en cocina mexicana.", "Degustaciones en 1-2 restaurantes y bares seleccionados.", "Bebidas tradicionales y cocteles artesanales.", "Experiencia interactiva con chefs y explicación de la preparación de platillos.", "Mapa y recomendaciones para continuar explorando la escena gastronómica."]'::jsonb,
  '{"Horario de inicio": ["6:30 p.m."], "Notas": ["Todos nuestros servicios turísticos ofrecen guía español e inglés.", "El servicio de transporte no está contemplado."]}'::jsonb
),
(
  'Plan Gastronómico "Sabor Local" – Master Class de Churros', 
  'master-class-churros', 2, 'Dirección proporcionada una vez realizada la reserva', '2 horas aproximadamente', 
  'Sumérgete en el arte de la repostería mexicana con nuestra exclusiva Master Class de Churros. Guiados por un chef pastelero local, aprenderás a preparar churros auténticos con técnicas tradicionales, acompañados de una deliciosa ganache mexicana.',
  '["https://images.unsplash.com/photo-1603532648955-039310d9ed75?q=80&w=2070"]'::jsonb, -- Hands frying churros
  '["Clase práctica dirigida por un chef pastelero mexicano.", "Preparación de churros tradicionales y ganache mexicana.", "Degustación de tus propios churros acompañados de café artesanal.", "Recetas y consejos para replicar en casa.", "Ambiente íntimo y personalizado."]'::jsonb,
  '{"Horarios disponibles": ["Mañana: 10:00 a.m.", "Tarde: 4:00 p.m."], "Notas": ["Todos nuestros servicios turísticos ofrecen guía español e inglés."]}'::jsonb
),
(
  'Plan Gastronómico "Fiesta Xochimilca" y Tour Cultural y Degustación en Trajinera', 
  'fiesta-xochimilca-trajinera', 4, 'Embarcadero Las Flores Nativitas, Xochimilco', 'Aproximadamente 2 horas', 
  'Embárcate en una experiencia única en los canales de Xochimilco, donde la tradición se mezcla con la diversión. Disfruta de una fiesta a bordo de una trajinera, degustando tequila, mezcal y cócteles artesanales, mientras participas en juegos interactivos y karaoke.',
  '["https://images.unsplash.com/photo-1512813689649-1236828f767b?q=80&w=2070"]'::jsonb, -- Colorful trajineras on Xochimilco canal
  '["Recorrido en trajinera por los canales de Xochimilco.", "Degustación ilimitada de tequila, mezcal y cócteles artesanales.", "Snacks mexicanos tradicionales.", "Juegos interactivos y karaoke.", "Guía local experto en cultura y traditions."]'::jsonb,
  '{"Horario de inicio": ["Flexible, según preferencia del cliente."], "Notas": ["Todos nuestros servicios turísticos ofrecen guía español e inglés."]}'::jsonb
),
(
  'Plan Gastronómico "Ranchero Capitalino" y Paseo a Caballo y Barbacoa en el Ajusco', 
  'ranchero-capitalino-ajusco', 4, 'Recogida en tu alojamiento en la Ciudad de México', 'Aproximadamente 6 horas', 
  'Escápate del bullicio urbano y vive una experiencia ecuestre única en el Parque Nacional Ajusco. Este tour privado te llevará por senderos montañosos rodeados de naturaleza. Al finalizar el paseo, deleitarás tu paladar con una auténtica barbacoa ranchera.',
  '["https://images.unsplash.com/photo-1593955106979-b13182855167?q=80&w=2070"]'::jsonb, -- Horseback riding in Mexican landscape
  '["Guía experto en equitación y naturaleza.", "Caballos bien entrenados y equipo de seguridad.", "Recorrido por senderos del Parque Nacional Ajusco.", "Almuerzo de barbacoa con carne, guarniciones y vino.", "Tiempo libre para disfrutar del entorno natural."]'::jsonb,
  '{"Horario de inicio": ["Flexible, según preferencia del cliente."], "Notas": ["Todos nuestros servicios turísticos ofrecen guía español e inglés."]}'::jsonb
),
(
  'Plan Gastronómico "Aventura Pirata" y Sunset Dinner & Show en Los Cabos', 
  'aventura-pirata-cabos', 3, 'Marina de Cabo San Lucas', 'Aproximadamente 2.5 a 3 horas', 
  'Embárcate en una experiencia única en Los Cabos con nuestro tour en barco pirata al atardecer. Disfruta de una cena a bordo mientras contemplas la puesta de sol sobre el Mar de Cortés, acompañado de un show interactivo con música, entretenimiento y animación pirata.',
  '["https://images.unsplash.com/photo-1544552866-49ce864ff896?q=80&w=2070"]'::jsonb, -- Wooden pirate galleon on water at sunset
  '["Guía y tripulación profesional a bordo.", "Cena buffet con especialidades locales e internacionales.", "Bebidas incluidas (refrescos, agua y selección de cocteles).", "Show en vivo con animación pirata, música y entretenimiento.", "Experiencia de navegación al atardecer con vistas panorámicas."]'::jsonb,
  '{"Horario de inicio": ["Salida al atardecer (aproximadamente 6:00 p.m.)"], "Notas": ["El servicio de transporte no está contemplado."]}'::jsonb
),
(
  'Plan Gastronómico "Sabores Nocturnos" y Tour Nocturno en San Miguel de Allende', 
  'sabores-nocturnos-san-miguel', 1, 'Hotel Boutique Cantera 1910, Zona Centro', 'Aproximadamente 3 horas', 
  'Embárcate en un recorrido culinario nocturno de 3 horas por el corazón de San Miguel de Allende. Visita siete paradas gastronómicas cuidadosamente seleccionadas, donde podrás degustar platos emblemáticos de la cocina mexicana, preparados por chefs galardonados.',
  '["https://images.unsplash.com/photo-1605658140614-27ac69542a1f?q=80&w=2070"]'::jsonb, -- Ambient shot of colonial streets in San Miguel de Allende at night
  '["Guía experto en gastronomía y cultura local.", "Degustaciones en 3 establecimientos seleccionados.", "Platos representativos como ensalada de remolacha, chile en nogada, taco de jícama.", "Información sobre la historia culinaria y arquitectónica."]'::jsonb,
  '{"Horario de inicio": ["6:00 p.m."], "Notas": ["El servicio de transporte no está contemplado."]}'::jsonb
),
(
  'Plan Gastronómico Clase de Cocina Mexicana en San Miguel de Allende', 
  'clase-cocina-mexicana-san-miguel', 2, 'Dirección proporcionada al confirmar la reserva', 'Aproximadamente 3 horas', 
  'Sumérgete en la rica tradición culinaria de México con esta clase práctica en San Miguel de Allende. Aprenderás a preparar mole auténtico, enmoladas y arroz mexicano, guiado por un chef experto. Al finalizar, disfrutarás de una comida completa acompañada de vino regional.',
  '["https://images.unsplash.com/photo-1506368249639-73a05d6f6488?q=80&w=2070"]'::jsonb, -- Preparing Mexican food
  '["Clase de cocina impartida por un chef profesional.", "Preparación de mole, enmoladas y arroz mexicano.", "Comida completa con los platillos preparados.", "Vino regional y bebida de cacao.", "Recetas para llevar a casa."]'::jsonb,
  '{"Horario de inicio": ["Flexible, según preferencia del cliente."], "Notas": ["Todos nuestros servicios turísticos ofrecen guía español e inglés.", "El servicio de transporte no está contemplado."]}'::jsonb
),
(
  'Plan Gastronómico “Tacos y Tequila” Recorrido Gastronómico a Pie', 
  'tacos-tequila-san-miguel', 1, 'Se confirmará una vez que esté lista la reserva.', 'Aproximadamente 3.5 horas', 
  'Embárcate en un recorrido culinario de 3.5 horas por el corazón de San Miguel de Allende, explorando cinco paradas gastronómicas seleccionadas. Disfruta de tacos gourmet y cócteles innovadores como margaritas de jalapeño, mientras aprendes sobre la historia y cultura de la ciudad.',
  '["https://images.unsplash.com/photo-1565299543923-37dd37887442?q=80&w=2070"]'::jsonb, -- Modern gourmet tacos and a margarita
  '["Guía experto en gastronomía y cultura local.", "Degustaciones en 3 establecimientos seleccionados.", "Tres cócteles innovadores, incluyendo margarita de jalapeño.", "Información sobre la historia culinaria de San Miguel de Allende.", "Grupo pequeño limitado a 10 personas."]'::jsonb,
  '{"Horario de inicio": ["Flexible, según preference del cliente."], "Notas": ["Todos nuestros servicios turísticos ofrecen guía español e inglés.", "El servicio de transporte no está contemplado."]}'::jsonb
),
(
  'Plan Gastronómico “Sabores de Oaxaca” Experiencia Culinaria Tradicional', 
  'sabores-oaxaca-experiencia', 4, 'Dirección proporcionada al confirmar la reserva.', 'Aproximadamente 5 horas', 
  'Sumérgete en la rica tradición culinaria de Oaxaca con esta experiencia práctica de 5 horas. Bajo la guía de cocineras locales, aprenderás a preparar platos emblemáticos utilizando métodos ancestrales y utensilios tradicionales.',
  '["https://images.unsplash.com/photo-1599974519780-60b7643b67be?q=80&w=2070"]'::jsonb, -- Oaxacan comal cooking tlayudas
  '["Guía experto en gastronomía local.", "Visita a un mercado local para seleccionar ingredientes frescos.", "Elaboración de tortillas, empanadas y quesadillas.", "Preparación de sopas y moles tradicionales.", "Postre tradicional oaxaqueño."]'::jsonb,
  '{"Horario de inicio": ["9:00 a.m."], "Notas": ["Todos nuestros servicios turísticos ofrecen guía español e inglés.", "El servicio de transporte no está contemplado."]}'::jsonb
),
(
  'Plan Gastronómico “Raíces del Agave” y Tour de Mezcal Ancestral', 
  'raices-agave-mezcal-puerto-escondido', 4, 'Recogida en tu alojamiento en Puerto Escondido.', 'Aproximadamente 2 horas y 30 minutos', 
  'Sumérgete en la tradición oaxaqueña con una visita guiada a una destilería ancestral de mezcal. Descubre el proceso artesanal de producción del mezcal, desde la cocción del agave hasta la destilación en alambiques de cobre.',
  '["https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070"]'::jsonb, -- Rustic mezcal tasting setup
  '["Recorrido guiado por la destilería ancestral.", "Cata de cinco mezcales artesanales.", "Botanas locales: guacamole, cacahuates, chapulines y más.", "Presentación didáctica sobre el origen y proceso del mezcal."]'::jsonb,
  '{"Horario de inicio": ["Flexible, según preferencia del cliente."], "Notas": ["Todos nuestros servicios turísticos ofrecen guía español e inglés.", "El servicio de transporte no está contemplado."]}'::jsonb
),
(
  'Plan Gastronómico “Aventura Mexicana” y Paseo a Caballo y Degustación de Tequila', 
  'aventura-mexicana-caballo-tequila', 4, 'Recogida en tu alojamiento en Puerto Vallarta.', 'Aproximadamente 5 horas', 
  'Embárcate en una experiencia única en Puerto Vallarta que combina la belleza natural de la Sierra Madre con la rica tradición mexicana. Este tour incluye un paseo a caballo por senderos selváticos, una refrescante parada en el río Cuale, una degustación de tequilas y una comida tradicional.',
  '["https://images.unsplash.com/photo-1553966012-dd33086ea262?q=80&w=2070"]'::jsonb, -- Horseback riders crossing a river in a lush environment
  '["Paseo guiado a caballo por la Sierra Madre.", "Oportunidad de nadar con los caballos en el río Cuale (según condiciones).", "Degustación de tequilas artesanales boutique.", "Comida tradicional mexicana."]'::jsonb,
  '{"Horario de inicio": ["10:30 a.m."], "Notas": ["Todos nuestros servicios turísticos ofrecen guía español e inglés."]}'::jsonb
),
(
  'Plan Gastronómico “Navegando Sabores” y Tour de Lujo en Yate y Snorkel', 
  'navegando-sabores-yate-snorkel', 3, 'Terminal Marítima, Puerto Vallarta', 'Aproximadamente 5 horas', 
  'Embárcate en una experiencia exclusiva por la Bahía de Banderas a bordo de un elegante catamarán Leopard. Disfruta de actividades acuáticas como snorkel y paddleboard en la playa Majahuitas, mientras degustas un delicioso almuerzo mexicano acompañado de barra libre premium.',
  '["https://images.unsplash.com/photo-1534008757030-27299c4371b6?q=80&w=2070"]'::jsonb, -- Sleek luxury yacht in turquoise Caribbean water
  '["Crucero en catamarán Leopard con tripulación profesional.", "Equipo de snorkel y paddleboard.", "Almuerzo mexicano con guacamole, cócteles de camarones y fruta fresca.", "Traslado de ida y vuelta desde tu alojamiento en Puerto Vallarta."]'::jsonb,
  '{"Horario de inicio": ["8:00 a.m."], "Notas": ["Todos nuestros servicios turísticos ofrecen guía español e inglés."]}'::jsonb
),
(
  'Plan Gastronómico “Amanecer en la Selva” y Desayuno Flotante Privado', 
  'amanecer-selva-desayuno-flotante', 3, 'Recogida en tu alojamiento en Cancún.', 'Aproximadamente 6 horas', 
  'Comienza tu día de manera única con un desayuno flotante privado en el corazón de la selva maya. Esta experiencia exclusiva te permite disfrutar de una bandeja gourmet en la piscina, rodeado de la tranquilidad de la naturaleza. Incluye también una sesión de temazcal.',
  '["https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?q=80&w=2070"]'::jsonb, -- Luxury jungle pool with floating breakfast tray
  '["Desayuno flotante gourmet: huevos, chilaquiles, frijoles, café, pan bagel con frutas.", "Sesión guiada de meditación en temazcal (20-25 minutos).", "Acceso a áreas comunes del hotel de 9:00 a.m. a 6:00 p.m.", "Bebida de bienvenida (coctel de autor)."]'::jsonb,
  '{"Horario de inicio": ["Flexible, según preferencia del cliente."], "Notas": ["Todos nuestros servicios turísticos ofrecen guía español e inglés."]}'::jsonb
),
(
  'Plan Gastronómico “Sabor Maya” y Clase de Cocina en Playa del Carmen', 
  'sabor-maya-clase-cocina', 2, '50 Avenida Nte., Ejidal, Playa del Carmen', 'Aproximadamente 3 horas', 
  'Sumérgete en la auténtica cocina mexicana con esta clase práctica en Playa del Carmen. Guiado por la chef Alma, aprenderás a preparar platillos tradicionales como tortillas hechas a mano, salsas frescas y guacamole, utilizando ingredientes locales frescos.',
  '["https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2070"]'::jsonb, -- Preparing Mexican ingredients
  '["Clase de cocina impartida por chef profesional.", "Visita al mercado local para seleccionar ingredientes frescos.", "Preparación de tortillas, salsas y guacamole.", "Almuerzo con los platillos preparados.", "Recetas familiares para llevar a casa."]'::jsonb,
  '{"Horario de inicio": ["10:00 a.m."], "Notas": ["Todos nuestros servicios turísticos ofrecen guía español e inglés."]}'::jsonb
),
(
  'Plan Gastronómico “Sabores Locales” en Cancún', 
  'sabores-locales-cancun', 1, 'Recogida en tu alojamiento en Cancún.', 'Aproximadamente 4 horas y 30 minutos', 
  'Embárcate en un recorrido de medio día por el corazón de Cancún, explorando mercados locales, puestos de comida callejera y callejones llenos de arte urbano. Este tour te permitirá degustar una variedad de especialidades locales, como barbacoa y tacos.',
  '["https://images.unsplash.com/photo-1512132411229-c30391241dd8?q=80&w=2070"]'::jsonb, -- Authentic night taco stall in Cancun
  '["Guía local experto en gastronomía y cultura.", "Degustaciones en varios puestos de comida y mercados locales.", "Visita a murales y arte urbano en callejones ocultos.", "Información sobre la historia y tradiciones culinarias de Cancún."]'::jsonb,
  '{"Horario de inicio": ["Flexible, según preference del cliente."], "Notas": ["Todos nuestros servicios turísticos ofrecen guía español e inglés."]}'::jsonb
),
(
  'Plan Gastronómico “Paraíso Privado” Club de Playa de Lujo en Costa Maya', 
  'paraiso-privado-club-playa-costa-maya', 3, 'Puerto de cruceros de Costa Maya.', 'Aproximadamente 4 horas y 30 minutos', 
  'Escapa de las multitudes y disfruta de una experiencia exclusiva en la Costa Maya. Este tour ofrece acceso a un club de playa privado donde podrás relajarte en tu propio deck con baño y ducha privados, mientras disfrutas de un servicio personalizado de alimentos y bebidas.',
  '["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070"]'::jsonb, -- Overwater hammocks at a luxury beach club
  '["Acceso a un deck privado con baño y ducha.", "Servicio personalizado de alimentos y bebidas.", "Actividades acuáticas: snorkel, kayak y paddleboard.", "Actividades terrestres: juegos de mesa, fútbol y voleibol."]'::jsonb,
  '{"Horario de inicio": ["Flexible, según la llegada del crucero."], "Notas": ["Todos nuestros servicios turísticos ofrecen guía español e inglés."]}'::jsonb
),
(
  'Plan Gastronómico "Navegando Sabores" y Tour Privado en Yate a Isla Mujeres', 
  'yate-privado-isla-mujeres', 3, 'Recogida en tu alojamiento en Cancún.', 'Aproximadamente 4 horas', 
  'Embárcate en una experiencia exclusiva a bordo de un yate privado de 42 pies, navegando por las aguas cristalinas del Caribe mexicano. Este tour personalizado incluye un recorrido por la laguna Nichupté, una parada para snorkel en Isla Mujeres y una deliciosa comida a bordo.',
  '["https://images.unsplash.com/photo-1569263991206-8b2b95b452ac?q=80&w=2070"]'::jsonb, -- Private yacht anchored in turquoise Caribbean water
  '["Recorrido en yate privado de 42 pies.", "Parada para snorkel en Isla Mujeres.", "Comida a bordo (ceviche fresco)."]'::jsonb,
  '{"Horario de inicio": ["Flexible, según preference del cliente."], "Notas": ["Todos nuestros servicios turísticos ofrecen guía español e inglés.", "El servicio de transporte no está contemplado."]}'::jsonb
),
(
  'Plan Gastronómico "Ritmos del Mar" y Crucero al Atardecer con Cena y Show Nocturno', 
  'ritmos-del-mar-crucero-vallarta', 3, 'Terminal Marítima de Puerto Vallarta', 'Aproximadamente 5 horas', 
  'Embárcate en una experiencia única en Puerto Vallarta con un elegante crucero al atardecer por la Bahía de Banderas. Disfruta de una cena buffet a la luz de las velas en la playa privada de Las Caletas, acompañada de música en vivo y un espectáculo nocturno.',
  '["https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?q=80&w=2070"]'::jsonb, -- Candlelit dinner setup on a secluded beach at night under lights
  '["Crucero al atardecer en catamarán desde Puerto Vallarta.", "Cena buffet internacional a la luz de las velas en la playa.", "Espectáculo nocturno \"Ritmos del Mar\" con música, danza y acrobacias.", "Barra libre nacional (bebidas alcohólicas y no alcohólicas)."]'::jsonb,
  '{"Horario de inicio": ["17:00 h (hora local)."], "Notas": ["Todos nuestros servicios turísticos ofrecen guía español e inglés."]}'::jsonb
);

-- =====================================================================================
-- 6. INSERTAR PAQUETES DE PRECIOS EXACTOS
-- =====================================================================================
INSERT INTO public.activity_packages_mextripia (activity_id, package_name, price, min_pax, max_pax) VALUES
-- 1. Sabor Local San Rafael
((SELECT id FROM public.activities_mextripia WHERE slug='sabor-local-san-rafael'), '1 - 3 personas', 1670.00, 1, 3),
((SELECT id FROM public.activities_mextripia WHERE slug='sabor-local-san-rafael'), '4 - 6 personas', 1450.00, 4, 6),
((SELECT id FROM public.activities_mextripia WHERE slug='sabor-local-san-rafael'), '7+ personas', 1230.00, 7, 20),

-- 2. Cocina Abierta Gourmet
((SELECT id FROM public.activities_mextripia WHERE slug='cocina-abierta-gourmet'), '1 - 3 personas', 1950.00, 1, 3),
((SELECT id FROM public.activities_mextripia WHERE slug='cocina-abierta-gourmet'), '4 - 6 personas', 1600.00, 4, 6),
((SELECT id FROM public.activities_mextripia WHERE slug='cocina-abierta-gourmet'), '7+ personas', 1430.00, 7, 20),

-- 3. Master Class Churros
((SELECT id FROM public.activities_mextripia WHERE slug='master-class-churros'), '1 - 3 personas', 1500.00, 1, 3),
((SELECT id FROM public.activities_mextripia WHERE slug='master-class-churros'), '4 - 6 personas', 1300.00, 4, 6),
((SELECT id FROM public.activities_mextripia WHERE slug='master-class-churros'), '7+ personas', 1050.00, 7, 20),

-- 4. Fiesta Xochimilca
((SELECT id FROM public.activities_mextripia WHERE slug='fiesta-xochimilca-trajinera'), '1 - 3 personas', 900.00, 1, 3),
((SELECT id FROM public.activities_mextripia WHERE slug='fiesta-xochimilca-trajinera'), '4 - 6 personas', 850.00, 4, 6),
((SELECT id FROM public.activities_mextripia WHERE slug='fiesta-xochimilca-trajinera'), '7+ personas', 750.00, 7, 20),

-- 5. Ranchero Ajusco
((SELECT id FROM public.activities_mextripia WHERE slug='ranchero-capitalino-ajusco'), '1 - 4 personas', 1250.00, 1, 4),
((SELECT id FROM public.activities_mextripia WHERE slug='ranchero-capitalino-ajusco'), '5 - 6 personas', 1000.00, 5, 6),
((SELECT id FROM public.activities_mextripia WHERE slug='ranchero-capitalino-ajusco'), '7+ personas', 875.00, 7, 20),

-- 6. Aventura Pirata
((SELECT id FROM public.activities_mextripia WHERE slug='aventura-pirata-cabos'), '1 - 3 personas', 1900.00, 1, 3),
((SELECT id FROM public.activities_mextripia WHERE slug='aventura-pirata-cabos'), '4 - 6 personas', 1850.00, 4, 6),
((SELECT id FROM public.activities_mextripia WHERE slug='aventura-pirata-cabos'), '7+ personas', 1700.00, 7, 20),

-- 7. Sabores Nocturnos San Miguel
((SELECT id FROM public.activities_mextripia WHERE slug='sabores-nocturnos-san-miguel'), '1 - 3 personas', 1600.00, 1, 3),
((SELECT id FROM public.activities_mextripia WHERE slug='sabores-nocturnos-san-miguel'), '4 - 6 personas', 1500.00, 4, 6),
((SELECT id FROM public.activities_mextripia WHERE slug='sabores-nocturnos-san-miguel'), '7+ personas', 1320.00, 7, 20),

-- 8. Clase Cocina Mexicana San Miguel
((SELECT id FROM public.activities_mextripia WHERE slug='clase-cocina-mexicana-san-miguel'), '1 - 3 personas', 3500.00, 1, 3),
((SELECT id FROM public.activities_mextripia WHERE slug='clase-cocina-mexicana-san-miguel'), '4 - 6 personas', 3400.00, 4, 6),
((SELECT id FROM public.activities_mextripia WHERE slug='clase-cocina-mexicana-san-miguel'), '7+ personas', 3150.00, 7, 20),

-- 9. Tacos y Tequila San Miguel
((SELECT id FROM public.activities_mextripia WHERE slug='tacos-tequila-san-miguel'), '1 - 3 personas', 1680.00, 1, 3),
((SELECT id FROM public.activities_mextripia WHERE slug='tacos-tequila-san-miguel'), '4 - 6 personas', 1500.00, 4, 6),
((SELECT id FROM public.activities_mextripia WHERE slug='tacos-tequila-san-miguel'), '7+ personas', 1350.00, 7, 20),

-- 10. Sabores de Oaxaca
((SELECT id FROM public.activities_mextripia WHERE slug='sabores-oaxaca-experiencia'), '1 - 3 personas', 4600.00, 1, 3),
((SELECT id FROM public.activities_mextripia WHERE slug='sabores-oaxaca-experiencia'), '4 - 6 personas', 4450.00, 4, 6),
((SELECT id FROM public.activities_mextripia WHERE slug='sabores-oaxaca-experiencia'), '7+ personas', 4380.00, 7, 20),

-- 11. Raíces del Agave Puerto Escondido
((SELECT id FROM public.activities_mextripia WHERE slug='raices-agave-mezcal-puerto-escondido'), '1 persona', 1500.00, 1, 1),
((SELECT id FROM public.activities_mextripia WHERE slug='raices-agave-mezcal-puerto-escondido'), '2 personas', 1400.00, 2, 2),
((SELECT id FROM public.activities_mextripia WHERE slug='raices-agave-mezcal-puerto-escondido'), '3 - 4 personas', 1300.00, 3, 4),
((SELECT id FROM public.activities_mextripia WHERE slug='raices-agave-mezcal-puerto-escondido'), '5+ personas', 1200.00, 5, 20),

-- 12. Aventura Mexicana Caballo y Tequila
((SELECT id FROM public.activities_mextripia WHERE slug='aventura-mexicana-caballo-tequila'), '1 persona', 2100.00, 1, 1),
((SELECT id FROM public.activities_mextripia WHERE slug='aventura-mexicana-caballo-tequila'), '2 personas', 2000.00, 2, 2),
((SELECT id FROM public.activities_mextripia WHERE slug='aventura-mexicana-caballo-tequila'), '3 - 4 personas', 1850.00, 3, 4),
((SELECT id FROM public.activities_mextripia WHERE slug='aventura-mexicana-caballo-tequila'), '5+ personas', 1700.00, 5, 20),

-- 13. Navegando Sabores Yate y Snorkel
((SELECT id FROM public.activities_mextripia WHERE slug='navegando-sabores-yate-snorkel'), '1 persona', 4500.00, 1, 1),
((SELECT id FROM public.activities_mextripia WHERE slug='navegando-sabores-yate-snorkel'), '2 personas', 4350.00, 2, 2),
((SELECT id FROM public.activities_mextripia WHERE slug='navegando-sabores-yate-snorkel'), '3 - 4 personas', 4200.00, 3, 4),
((SELECT id FROM public.activities_mextripia WHERE slug='navegando-sabores-yate-snorkel'), '5+ personas', 4000.00, 5, 40),

-- 14. Amanecer Selva Desayuno Flotante
((SELECT id FROM public.activities_mextripia WHERE slug='amanecer-selva-desayuno-flotante'), '1 persona', 6500.00, 1, 1),
((SELECT id FROM public.activities_mextripia WHERE slug='amanecer-selva-desayuno-flotante'), '2 personas', 6400.00, 2, 2),
((SELECT id FROM public.activities_mextripia WHERE slug='amanecer-selva-desayuno-flotante'), '3 - 4 personas', 6250.00, 3, 4),
((SELECT id FROM public.activities_mextripia WHERE slug='amanecer-selva-desayuno-flotante'), '5+ personas', 6100.00, 5, 20),

-- 15. Sabor Maya Clase Cocina Playa del Carmen
((SELECT id FROM public.activities_mextripia WHERE slug='sabor-maya-clase-cocina'), '1 persona', 2900.00, 1, 1),
((SELECT id FROM public.activities_mextripia WHERE slug='sabor-maya-clase-cocina'), '2 personas', 2800.00, 2, 2),
((SELECT id FROM public.activities_mextripia WHERE slug='sabor-maya-clase-cocina'), '3+ personas', 2690.00, 3, 20),

-- 16. Sabores Locales Cancún
((SELECT id FROM public.activities_mextripia WHERE slug='sabores-locales-cancun'), '1 persona', 1600.00, 1, 1),
((SELECT id FROM public.activities_mextripia WHERE slug='sabores-locales-cancun'), '2 personas', 1550.00, 2, 2),
((SELECT id FROM public.activities_mextripia WHERE slug='sabores-locales-cancun'), '3 - 4 personas', 1400.00, 3, 4),
((SELECT id FROM public.activities_mextripia WHERE slug='sabores-locales-cancun'), '5+ personas', 1300.00, 5, 20),

-- 17. Paraíso Privado Club Playa
((SELECT id FROM public.activities_mextripia WHERE slug='paraiso-privado-club-playa-costa-maya'), '1 - 4 personas', 6475.00, 1, 4),
((SELECT id FROM public.activities_mextripia WHERE slug='paraiso-privado-club-playa-costa-maya'), '5+ personas', 3916.00, 5, 20),

-- 18. Navegando Sabores Tour Privado Yate Isla Mujeres
((SELECT id FROM public.activities_mextripia WHERE slug='yate-privado-isla-mujeres'), '1 - 4 personas', 8850.00, 1, 4),
((SELECT id FROM public.activities_mextripia WHERE slug='yate-privado-isla-mujeres'), '5+ personas', 5683.00, 5, 20),

-- 19. Ritmos del Mar Crucero Atardecer
((SELECT id FROM public.activities_mextripia WHERE slug='ritmos-del-mar-crucero-vallarta'), '1 - 3 personas', 5800.00, 1, 3),
((SELECT id FROM public.activities_mextripia WHERE slug='ritmos-del-mar-crucero-vallarta'), '4 - 6 personas', 5600.00, 4, 6),
((SELECT id FROM public.activities_mextripia WHERE slug='ritmos-del-mar-crucero-vallarta'), '7+ personas', 5430.00, 7, 20);

-- =====================================================================================
-- 7. INSERTAR DETALLES MUNDIAL
-- =====================================================================================
INSERT INTO public.fifa_experiences_mextripia (title, subtitle, description, items, image_url, order_index) VALUES
('Experiencias Culinarias VIP', 'Acceso Exclusivo', 'Degustaciones de alto nivel en recintos privados durante los partidos clave.', '["Cenas maridaje con chefs reconocidos", "Acceso a zonas VIP", "Servicio de mixología de autor"]', 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070', 1),
('Viewing Parties Gourmet', 'Eventos en Vivo', 'Proyección de partidos en entornos de lujo con catering ininterrumpido.', '["Pantallas gigantes 4K", "Estaciones de comida en vivo", "Ambiente selecto y privado"]', 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070', 2);