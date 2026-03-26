-- Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Limpieza previa (CUIDADO en producción)
DROP TABLE IF EXISTS public.booking_items CASCADE;
DROP TABLE IF EXISTS public.cart_items CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.activity_availability CASCADE;
DROP TABLE IF EXISTS public.activity_packages CASCADE;
DROP TABLE IF EXISTS public.activities CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.service_levels CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.contact_messages CASCADE;
DROP TABLE IF EXISTS public.custom_quotes CASCADE;

-- Tablas de Catálogos
CREATE TABLE public.categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  slug VARCHAR NOT NULL UNIQUE
);

CREATE TABLE public.service_levels (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE
);

-- Tablas Principales de Catálogo de Tours
CREATE TABLE public.activities (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  slug VARCHAR NOT NULL UNIQUE,
  description TEXT,
  category_id INTEGER REFERENCES public.categories(id),
  location VARCHAR,
  image_url TEXT,
  duration VARCHAR,
  itinerary JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.activity_packages (
  id SERIAL PRIMARY KEY,
  activity_id INTEGER REFERENCES public.activities(id),
  level_id INTEGER REFERENCES public.service_levels(id),
  price NUMERIC NOT NULL,
  features JSONB,
  min_pax INTEGER DEFAULT 1,
  max_pax INTEGER,
  is_active BOOLEAN DEFAULT TRUE
);

-- Tabla de Disponibilidad (Por fecha y hora)
CREATE TABLE public.activity_availability (
  id SERIAL PRIMARY KEY,
  package_id INTEGER REFERENCES public.activity_packages(id),
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  remaining_slots INTEGER NOT NULL,
  UNIQUE(package_id, scheduled_date, scheduled_time)
);

-- Tablas de Clientes y Cotizaciones
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  phone VARCHAR,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.custom_quotes (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR NOT NULL,
  customer_email VARCHAR NOT NULL,
  phone VARCHAR,
  destination VARCHAR,
  pax_qty INTEGER,
  budget VARCHAR,
  special_requests TEXT,
  start_date DATE,
  end_date DATE,
  status VARCHAR DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.contact_messages (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR,
  phone VARCHAR,
  email VARCHAR,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tablas de Operación (Carrito y Reservas)
CREATE TABLE public.cart_items (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR NOT NULL,
  package_id INTEGER REFERENCES public.activity_packages(id),
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  pax_qty INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES public.customers(id),
  session_id VARCHAR, -- Opcional, para rastrear de qué sesión vino
  total_amount NUMERIC NOT NULL,
  payment_status VARCHAR DEFAULT 'pending',
  rfc VARCHAR,
  razon_social VARCHAR,
  direccion_facturacion TEXT,
  ciudad_facturacion VARCHAR,
  estado_facturacion VARCHAR,
  codigo_postal_facturacion VARCHAR,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.booking_items (
  id SERIAL PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id),
  package_id INTEGER REFERENCES public.activity_packages(id),
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  pax_qty INTEGER DEFAULT 1,
  unit_price NUMERIC NOT NULL
);

-- Políticas de ACCESO para el flujo de Checkout
-- Esto permite hacer SELECT, INSERT y UPDATE durante la compra
CREATE POLICY "Acceso total a clientes en checkout" 
ON public.customers FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Acceso total a reservas en checkout" 
ON public.bookings FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Acceso total a items de reserva en checkout" 
ON public.booking_items FOR ALL USING (true) WITH CHECK (true);

-----------------------------------------------------
-- INSERTAR DATOS
-----------------------------------------------------
-- Esto vacía las tablas y reinicia sus contadores a 1
TRUNCATE TABLE 
  public.activity_packages,
  public.activities,
  public.activity_availability,
  public.bookings,
  public.booking_items,
  public.cart_items,
  public.contact_messages,
  public.categories,
  public.service_levels,
  public.custom_quotes,
  public.customers
RESTART IDENTITY CASCADE;

-- ==========================================
-- 1. INSERTAR LOS CATÁLOGOS 
-- ==========================================
INSERT INTO public.categories (name, slug) VALUES 
('Naturaleza', 'naturaleza'),
('Aventura', 'aventura'),
('Cultura', 'cultura'),
('Gastronomía', 'gastronomia');

INSERT INTO public.service_levels (name) VALUES 
('Básico'), 
('Premium'), 
('Aventurero');
-- ==========================================
-- 3. INSERTAR LAS EXPERIENCIAS DE DTOUR
-- ==========================================

INSERT INTO public.activities (title, slug, category_id, location, duration, description, itinerary) VALUES
-- AVENTURA
('Cabo San Lucas: Tour en Cuatrimoto', 'cabo-cuatrimoto-tequila', 2, 'Cabo San Lucas, BCS', '2.5 a 3 horas', 'Acelera la adrenalina y descubre el lado más aventurero de Cabo San Lucas...', '["Explicación de seguridad", "Recorrido por caminos desérticos", "Paradas panorámicas", "Playa de Migriño", "Degustación de tequila"]'::jsonb),
('Los Cabos: Crucero Pirata al Atardecer', 'crucero-pirata-cabos', 2, 'Los Cabos, BCS', '2 horas', 'Vive una noche diferente a bordo de un auténtico barco pirata...', '["Salida de Muelle Cero", "Crucero y puesta de sol en El Arco", "Cena a bordo", "Espectáculo pirata interactivo", "Regreso al puerto"]'::jsonb),
('Nevado de Toluca: Alcanza la Cima', 'nevado-toluca-cima', 2, 'Estado de México', '1 día', 'Disfruta de una aventura única subiendo al cuarto volcán más alto de México...', '["Encuentro en Mercado Michoacán", "Ascenso por el Paso del Quetzal", "Llegada al cráter y lagunas", "Descenso"]'::jsonb),
('Riviera Maya: Aqua Nick Park', 'aqua-nick-riviera-maya', 2, 'Riviera Maya, QROO', '1 día', 'Vive un día lleno de diversión en Aqua Nick Park...', NULL),
('Sayulita: Paseo a Caballo', 'paseo-caballo-sayulita', 2, 'Sayulita, Nayarit', '1 a 2 horas', 'Disfruta de un recorrido a caballo por la selva y la playa de Sayulita...', '["Instrucciones en Rancho Mi Chaparrita", "Recorrido por la selva", "Paseo por la playa", "Regreso al rancho"]'::jsonb),

-- NATURALEZA
('Cancún: Nada con manatíes en Isla Mujeres', 'manaties-isla-mujeres', 1, 'Isla Mujeres, QROO', '1 día', 'Vive un encuentro único con los gentiles manatíes en Isla Mujeres.', '["Ferry desde Playa Langosta", "Encuentro con manatíes", "Almuerzo buffet", "Tiempo libre en instalaciones", "Ferry de regreso"]'::jsonb),
('Cuevas de Tolantongo', 'cuevas-tolantongo', 1, 'Hidalgo', '4 horas', 'Sumérgete en un paraíso turquesa oculto entre las montañas.', '["Exploración de cuevas", "Nado en pozas termales", "Túnel del Paraíso", "Senderismo opcional"]'::jsonb),
('Desde Cabo: Nado con Tiburones Ballena', 'tiburon-ballena-desde-cabo', 1, 'La Paz, BCS', '10 horas', 'Vive una experiencia extraordinaria nadando junto al pez más grande del planeta.', '["Traslado desde Los Cabos a La Paz", "Abordaje de embarcación", "Snorkel con tiburón ballena", "Tiempo libre en el malecón de La Paz", "Almuerzo de tacos", "Regreso a Los Cabos"]'::jsonb),
('El Rosario: Santuario de la Mariposa Monarca', 'mariposa-monarca-rosario', 1, 'Michoacán', '5 horas', 'Experimenta la magia de las mariposas monarca en su santuario más grande.', '["Llegada al santuario", "Paseo a caballo (opcional)", "Avistamiento de mariposas en el bosque", "Senderismo de descenso"]'::jsonb),
('La Paz o La Ventana: Safari Oceánico', 'safari-oceanico-la-paz', 1, 'La Paz, BCS', '5 horas', 'Explora el lado salvaje del Mar de Cortés.', '["Salida desde La Paz o La Ventana", "Navegación en busca de fauna", "Snorkel con rayas o delfines", "Pausa para alimentos en el mar", "Regreso"]'::jsonb),
('La Paz: Nado con Tiburón Ballena (Biólogo)', 'nado-tiburon-ballena-biologo', 1, 'La Paz, BCS', '4 horas', 'Nada junto a tiburones ballena guiado por biólogos marinos.', '["Caminata al muelle desde Eco Migrations", "Navegación al Área Protegida", "Nado con tiburones ballena", "Toma de fotos de identificación", "Regreso"]'::jsonb),
('La Paz: Safari Delfines, Orcas y Leones Marinos', 'safari-delfines-orcas-paz', 1, 'La Paz, BCS', '8 horas', 'Explora la extraordinaria riqueza marina en un safari oceánico de día completo.', NULL),
('Los Cabos: Avistamiento de Ballenas', 'avistamiento-ballenas-cabos', 1, 'Los Cabos, BCS', '2.5 horas', 'Descubre la grandeza natural de Baja California presenciando a las ballenas.', '["Salida de Marina Cabo San Lucas", "Parada en El Arco y colonia de leones", "Navegación en mar abierto", "Avistamiento de ballenas", "Regreso"]'::jsonb),
('Los Cabos: Tour al Arco en Lancha Transparente', 'arco-lancha-transparente', 1, 'Los Cabos, BCS', '4 horas', 'Disfruta de un recorrido único hacia el Arco de Cabo San Lucas en lancha transparente.', '["Recorrido en lancha transparente", "Observación de formaciones rocosas y lobos marinos", "Degustación de tequila", "Tiempo libre para compras", "Opcional: Playa del Médano"]'::jsonb),
('Martinica: Avistamiento de Delfines y Arrecife', 'delfines-arrecife-martinica', 1, 'Martinica', '4 horas', 'Navega por la Costa de Sotavento, busca delfines y explora arrecifes de coral.', '["Crucero por Costa de Sotavento", "Avistamiento de delfines", "Exploración de arrecife de coral", "Visita a cueva de murciélagos", "Aperitivos"]'::jsonb),
('Puerto Vallarta: Liberación de Tortuguitas', 'liberacion-tortugas-vallarta', 1, 'Puerto Vallarta, JAL', '2.5 horas', 'Vive una experiencia única ayudando a liberar crías de tortuga golfina.', '["Caminata a la zona de conservación", "Charla educativa sobre incubación", "Liberación de tortugas al atardecer"]'::jsonb),
('Roatán: Santuario del Mono y el Perezoso', 'santuario-mono-perezoso', 1, 'Roatán, Honduras', '4 horas', 'Aprende sobre la fauna local de Roatán e interactúa con perezosos, monos e iguanas.', '["Visita a Monkey and Sloth Hangout", "Interacción con animales", "Visita a Parque de Iguanas", "Relajación en Club de Playa West End"]'::jsonb),

-- CULTURA
('CDMX: Máscara de Lucha Libre y Espectáculo', 'lucha-libre-cdmx', 3, 'CDMX', '3.5 horas', 'Diseña tu propia máscara mientras disfrutas de cerveza y vibra con un combate en vivo.', '["Encuentro en Colonia Roma", "Historia de la lucha libre", "Taller de diseño de máscara", "Cerveza ilimitada", "Traslado a la Arena", "Función en vivo"]'::jsonb),
('CDMX: Murales de Diego Rivera', 'murales-diego-rivera-cdmx', 3, 'CDMX', '2 a 3.5 horas', 'Sumérgete en la historia de México a través de los murales de Diego Rivera.', '["Secretaría de Educación Pública", "Palacio de Bellas Artes", "Museo Mural Diego Rivera"]'::jsonb),
('Excursión a Amealco, Tequisquiapan y Bernal', 'amealco-tequisquiapan-bernal', 3, 'Querétaro', '9 horas', 'Una travesía por el alma de Querétaro y la cultura otomí.', '["Taller de muñecas otomíes en Amealco", "Tiempo libre en Tequisquiapan", "Visita a la Peña de Bernal"]'::jsonb),
('Morelia: Tour centro histórico', 'tour-morelia-centro', 3, 'Morelia, MICH', '2 horas', 'Explora el centro histórico de Morelia.', '["Catedral de Morelia", "Palacio de Gobierno", "Templo Las Monjas", "Acueducto", "Fuente de las Tarascas", "Templo de San Diego"]'::jsonb),
('Pátzcuaro – Janitzio: Redes de mariposas', 'patzcuaro-janitzio-redes', 3, 'Michoacán', '8 horas', 'Descubre la tradición de las redes de mariposa en Janitzio.', '["Paseo en barco por Janitzio", "Observación de pescadores", "Visita al centro de Pátzcuaro (Casa de los Once Patios, Basílica)"]'::jsonb),
('Querétaro: Peña de Bernal y Cavas Freixenet', 'bernal-freixenet-queretaro', 3, 'Querétaro', '6 horas', 'Combina la majestuosidad de la Peña de Bernal con la sofisticación de Cavas Freixenet.', '["Salida de Jardín de la Corregidora", "Visita y cata en Freixenet (1.5h)", "Visita guiada y paseo en Bernal (2h)", "Regreso"]'::jsonb),
('Querétaro: Tranvía Clásico', 'tranvia-clasico-queretaro', 3, 'Querétaro', '1 a 2 horas', 'Explora los sitios emblemáticos de Querétaro a bordo de un tranvía clásico.', '["Acueducto", "Templo de San Francisco", "Cerro de las Campanas", "Teatro de la República"]'::jsonb),
('Valladolid: Abejas Mayas y Cata en Xkopek', 'abejas-mayas-xkopek', 3, 'Valladolid, YUC', '1.5 horas', 'Adéntrate en el mundo sagrado de las abejas meliponas.', '["Descenso a cenote seco", "Caminata por sendero en selva", "Visita a meliponario tradicional", "Degustación de miel maya"]'::jsonb),

-- GASTRONOMÍA
('CDMX: Museo del Tequila y Mezcal', 'museo-tequila-mezcal-cdmx', 4, 'CDMX', '2 horas', 'Sumérgete en el mundo del tequila y mezcal en la plaza Garibaldi.', '["Historia de la destilación", "Recorrido por el museo", "Degustación guiada", "Exploración de Plaza Garibaldi"]'::jsonb);
-- ==========================================
-- 4. INSERTAR LOS PAQUETES DE CADA EXPERIENCIA
-- ==========================================
-- 1. CABO SAN LUCAS: CUATRIMOTOS
UPDATE public.activities SET 
  images = '["https://media.tacdn.com/media/attractions-splice-spp-674x446/12/6d/be/63.jpg"]'::jsonb,
  included_general = '["Guía turístico bilingüe", "Equipo de seguridad (casco, gafas y paliacate)", "Agua purificada", "Capacitación e introducción al manejo"]'::jsonb,
  requirements = '["Calzado cerrado y cómodo", "Protector solar", "Ropa cómoda que se pueda ensuciar"]'::jsonb,
  restrictions = '["Mujeres embarazadas"]'::jsonb
WHERE slug = 'cabo-cuatrimoto-tequila';

-- 2. CANCÚN: MANATÍES
UPDATE public.activities SET 
  images = '["https://eplat.com/content/themes/base/images/cancun/activities/p105/a28113/Manati07.jpg?width=920&height=520&mode=crop&autorotate=true"]'::jsonb,
  included_general = '["Encuentro con manatíes con instructor especializado", "Acceso a taquillas, duchas, tumbonas y piscina"]'::jsonb,
  requirements = '["Bañador", "Protector solar biodegradable"]'::jsonb,
  restrictions = '["Menores de 8 años", "Embarazadas y personas con problemas de movilidad", "Prohibido el uso de cámaras o celulares durante el encuentro"]'::jsonb
WHERE slug = 'manaties-isla-mujeres';

-- 3. CDMX: LUCHA LIBRE
UPDATE public.activities SET 
  images = '["https://www.radiomas.mx/wp-content/uploads/sites/6/2021/05/magia-blanca-regresado-brios-lucha_0_20_912_568.jpg"]'::jsonb,
  included_general = '["Anfitrión bilingüe especializado", "Taller de diseño y elaboración", "Regalo vintage sorpresa"]'::jsonb,
  requirements = '[]'::jsonb,
  restrictions = '["Personas con problemas de movilidad"]'::jsonb
WHERE slug = 'lucha-libre-cdmx';

-- 4. CDMX: TEQUILA Y MEZCAL
UPDATE public.activities SET 
  images = '["https://www.dondeir.com/wp-content/uploads/2025/09/15-de-septiembre.jpg"]'::jsonb,
  included_general = '["Entrada al Museo del Tequila y Mezcal (MUTEM)", "Acceso a exposiciones permanentes"]'::jsonb,
  requirements = '["Identificación oficial"]'::jsonb,
  restrictions = '["Menores de 18 años", "Personas en silla de ruedas"]'::jsonb
WHERE slug = 'museo-tequila-mezcal-cdmx';

-- 5. CDMX: MURALES DIEGO RIVERA
UPDATE public.activities SET 
  images = '["https://offloadmedia.feverup.com/cdmxsecreta.com/wp-content/uploads/2025/01/31143233/mural-Sueno-de-una-tarde-dominical-en-la-Alameda-Central.jpg"]'::jsonb,
  included_general = '["Guía experto en historia y arte"]'::jsonb,
  requirements = '["Calzado cómodo para caminar", "Pasaporte o identificación oficial"]'::jsonb,
  restrictions = '[]'::jsonb
WHERE slug = 'murales-diego-rivera-cdmx';

-- 6. CUEVAS DE TOLANTONGO
UPDATE public.activities SET 
  images = '["https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/93/a5/31/caption.jpg?w=1200&h=-1&s=1"]'::jsonb,
  included_general = '["Alquiler de taquilla"]'::jsonb,
  requirements = '["Gafas de sol", "Bañador", "Muda de ropa", "Toalla", "Calzado acuático", "Dinero en efectivo", "Pasaporte o copia"]'::jsonb,
  restrictions = '["Personas en silla de ruedas"]'::jsonb
WHERE slug = 'cuevas-tolantongo';

-- 7. DESDE CABO: TIBURÓN BALLENA
UPDATE public.activities SET 
  images = '["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRe3xq1vGg4Zf77BQnbFArD0sqNlQJxAIdDxw&s"]'::jsonb,
  included_general = '["Transporte redondo", "Desayuno ligero", "Guía certificado", "Equipo de snorkel, chaleco y traje de neopreno", "Tiempo libre en La Paz"]'::jsonb,
  requirements = '["Traje de baño", "Toalla", "Cámara", "Chamarra ligera"]'::jsonb,
  restrictions = '["Menores de 8 años", "Mujeres embarazadas", "Personas con problemas de espalda o cuello", "Personas con movilidad reducida o silla de ruedas"]'::jsonb
WHERE slug = 'tiburon-ballena-desde-cabo';

-- 8. EL ROSARIO: MARIPOSA MONARCA
UPDATE public.activities SET 
  images = '["https://offloadmedia.feverup.com/cdmxsecreta.com/wp-content/uploads/2022/01/24105143/R-1024x683.jpg"]'::jsonb,
  included_general = '["Entrada al santuario El Rosario", "Tickets de peaje y aparcamiento"]'::jsonb,
  requirements = '["Calzado cómodo y de senderismo", "Ropa abrigada", "Protector solar", "Agua", "Prismáticos y cámara"]'::jsonb,
  restrictions = '["Embarazadas", "Personas con problemas de movilidad o espalda", "Problemas cardíacos o respiratorios", "Personas sensibles al mal de altura (está a más de 3,000 msnm)"]'::jsonb
WHERE slug = 'mariposa-monarca-rosario';

-- 9. EXCURSIÓN AMEALCO, TEQUISQUIAPAN, BERNAL
UPDATE public.activities SET 
  images = '["https://descubreenmexico.com/wp-content/uploads/2022/03/amealco.webp"]'::jsonb,
  included_general = '["Guía turístico profesional", "Taller de elaboración de muñecos Lele", "Acompañamiento en recorrido"]'::jsonb,
  requirements = '["Ropa y calzado cómodo"]'::jsonb,
  restrictions = '[]'::jsonb
WHERE slug = 'amealco-tequisquiapan-bernal';

-- 10. LA PAZ / LA VENTANA: SAFARI OCEÁNICO
UPDATE public.activities SET 
  images = '["https://www.dresseldivers.com/wp-content/uploads/diving-safari-maldivas-safari-de-buceo-1.jpg"]'::jsonb,
  included_general = '["Safari en panga con área sombreada", "Guía biólogo marino bilingüe", "Equipo completo de snorkel"]'::jsonb,
  requirements = '["Chamarra o cortavientos", "Traje de baño y toalla", "Protector solar biodegradable", "Camiseta de manga larga", "Medicación para el mareo"]'::jsonb,
  restrictions = '["Menores de 6 años y mayores de 75 años", "Embarazadas", "Problemas de espalda o movilidad", "Personas que no saben nadar", "Alta sensibilidad al mareo"]'::jsonb
WHERE slug = 'safari-oceanico-la-paz';

-- 11. LA PAZ: NADO TIBURÓN BALLENA BIÓLOGO
UPDATE public.activities SET 
  images = '["https://cdn1.yumping.com.mx/emp/fotos/301/P/040314/640/p-40314-impresionante-nado-con-tiburones-ballena_15833444454321.jpg"]'::jsonb,
  included_general = '["Equipo completo de snorkel y traje de neopreno", "Guía bilingüe biólogo marino", "Fotografías de identificación científica"]'::jsonb,
  requirements = '["Traje de baño", "Protector solar biodegradable", "Botella de agua reutilizable"]'::jsonb,
  restrictions = '["Bebés menores de 1 año", "Mujeres embarazadas", "Personas con movilidad reducida"]'::jsonb
WHERE slug = 'nado-tiburon-ballena-biologo';

-- 12. LA PAZ: SAFARI DELFINES Y ORCAS
UPDATE public.activities SET 
  images = '["https://cdn.getyourguide.com/image/format=auto,fit=crop,gravity=auto,quality=60,width=390,height=260/tour_img/4584ecff49371464d9f32531117d8a3eb49dbf62ce4aada574e435ab4ffa5038.jpeg"]'::jsonb,
  included_general = '["Safari oceánico guiado de exploración", "Guía bilingüe especializado"]'::jsonb,
  requirements = '["Ropa cómoda y de abrigo ligero", "Gafas de sol y sombrero", "Protector solar biodegradable", "Medicación para el mareo"]'::jsonb,
  restrictions = '["Mujeres embarazadas", "Personas con problemas severos de movilidad", "Personas con alta sensibilidad al mareo"]'::jsonb
WHERE slug = 'safari-delfines-orcas-paz';

-- 13. LOS CABOS: AVISTAMIENTO DE BALLENAS
UPDATE public.activities SET 
  images = '["https://www.toursloscabos.com/wp-content/uploads/2016/02/Whale-Watching-San-Lucas.jpg"]'::jsonb,
  included_general = '["Embarcación con área sombreada y sanitario marino", "Guía bilingüe", "Agua embotellada y chaleco salvavidas"]'::jsonb,
  requirements = '["Protector solar biodegradable", "Chamarra o sudadera ligera", "Medicación contra el mareo"]'::jsonb,
  restrictions = '["Niños menores de 4 años", "Mujeres embarazadas", "Personas con afecciones de espalda"]'::jsonb
WHERE slug = 'avistamiento-ballenas-cabos';

-- 14. LOS CABOS: CRUCERO PIRATA
UPDATE public.activities SET 
  images = '["https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/0b/c2/b6/c6.jpg"]'::jsonb,
  included_general = '["Espectáculo interactivo en vivo a bordo", "Cena barbacoa estilo pirata", "Barra libre ilimitada"]'::jsonb,
  requirements = '["Tarjeta de crédito o efectivo para gastos adicionales y propinas"]'::jsonb,
  restrictions = '[]'::jsonb
WHERE slug = 'crucero-pirata-cabos';

-- 15. LOS CABOS: LANCHA TRANSPARENTE
UPDATE public.activities SET 
  images = '["https://auika.com/wp-content/uploads/2022/07/lancha-transparente-4.jpeg"]'::jsonb,
  included_general = '["Paseo por la bahía en lancha de cristal", "Visita guiada al Arco"]'::jsonb,
  requirements = '["Toalla", "Ropa de playa", "Traje de baño"]'::jsonb,
  restrictions = '["Personas recién operadas", "Personas con fuerte mareo por movimiento", "Mayores de 95 años", "Prohibido zapatos de tacón"]'::jsonb
WHERE slug = 'arco-lancha-transparente';

-- 16. MARTINICA: DELFINES Y ARRECIFES
UPDATE public.activities SET 
  images = '["https://storage.googleapis.com/medicina-responsable.appspot.com/1653297245809.jpg?GoogleAccessId=firebase-adminsdk-2sbvv%40medicina-responsable.iam.gserviceaccount.com&Expires=2524604400&Signature=WmDm9nHt%2BkabvtcDvwnD7gf6DQkwVa4PY9QUzeEcwJ%2Fwjwu7OtZQ%2B%2F8V5ZMnvAJd9oasT8GEHZGwRhU2%2FVfLqFDzDhKiNSc49Y%2BElB6GQ57ekOyruHxe7%2Ba23dJyhyDveQ4uTGjzoJEO%2FCDw6Wlc5w5NgGXssv3vG4HeaP%2FNO3FD2jhXczr%2FmnsHoYWdUu2o6MTHAGpcor%2F3JInFB3LobWcqVFLtJII%2Bw7HoyDelT2reAawfaOey2dKlmAog2SFaodGKIM%2B%2BR0ztR1Pmtd6VIsC6YWig8yEeF6VE2T%2BgvPKOE1rLrxKm0aU%2B9kYKA9VpN1xFkGJC60KETc2TWwLmzw%3D%3D"]'::jsonb,
  included_general = '["Guía bilingüe", "Aperitivos y refrescos locales"]'::jsonb,
  requirements = '["Protector solar", "Gafas de sol y sombrero", "Calzado cómodo para el barco", "Traje de baño"]'::jsonb,
  restrictions = '["Personas con movilidad reducida (según accesibilidad del barco)"]'::jsonb
WHERE slug = 'delfines-arrecife-martinica';

-- 17. MORELIA: TOUR CENTRO HISTÓRICO
UPDATE public.activities SET 
  images = '["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUtxe9vxoMeLYfhIIYrkOm8QBgm2Nmi1zHsQ&s"]'::jsonb,
  included_general = '["Tour a pie con guía local experto"]'::jsonb,
  requirements = '["Calzado cómodo (hay superficies irregulares)"]'::jsonb,
  restrictions = '[]'::jsonb
WHERE slug = 'tour-morelia-centro';

-- 18. NEVADO DE TOLUCA
UPDATE public.activities SET 
  images = '["https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/4b/62/4d/photo4jpg.jpg?w=1200&h=1200&s=1"]'::jsonb,
  included_general = '["Guía profesional", "Tasas de montaña", "Material técnico", "Seguro"]'::jsonb,
  requirements = '["Calzado de senderismo", "Ropa de lluvia y abrigo", "Guantes y gafas de sol", "Muda de ropa y toalla"]'::jsonb,
  restrictions = '["Embarazadas", "Personas con problemas de espalda o movilidad", "Problemas respiratorios, epilepsia o hemofilia"]'::jsonb
WHERE slug = 'nevado-toluca-cima';

-- 19. PÁTZCUARO - JANITZIO
UPDATE public.activities SET 
  images = '["https://media-cdn.tripadvisor.com/media/photo-s/1c/11/e5/5d/patzcuaro-y-janitzio.jpg"]'::jsonb,
  included_general = '["Guía/conductor bilingüe", "Paseo en barco por la isla", "Entradas y admisiones"]'::jsonb,
  requirements = '["Calzado cómodo", "Gorra", "Cámara", "Dinero en efectivo"]'::jsonb,
  restrictions = '["Menores de 10 años", "Personas en silla de ruedas", "Personas con peso superior a 100 kg", "Personas con hipertensión"]'::jsonb
WHERE slug = 'patzcuaro-janitzio-redes';

-- 20. PUERTO VALLARTA: LIBERACIÓN TORTUGAS
UPDATE public.activities SET 
  images = '["https://livingandtravel.com.mx/wp-content/uploads/2023/07/arton26280.jpg"]'::jsonb,
  included_general = '["Guía especializado", "Experiencia de liberación", "Agua"]'::jsonb,
  requirements = '["Protector solar biodegradable", "Ropa cómoda", "Repelente de insectos"]'::jsonb,
  restrictions = '["Menores de 5 años (solo observan)", "Personas con problemas de movilidad", "Problemas respiratorios o hipertensión", "Baja condición física"]'::jsonb
WHERE slug = 'liberacion-tortugas-vallarta';

-- 21. QUERÉTARO: PEÑA Y FREIXENET
UPDATE public.activities SET 
  images = '["https://www.entornoturistico.com/wp-content/uploads/2021/08/Postal-de-la-Pen%CC%83a-de-Bernal.jpg"]'::jsonb,
  included_general = '["Visita a Peña de Bernal", "Visita a las cuevas de Freixenet", "Cata de vino", "Guía en vivo"]'::jsonb,
  requirements = '["Calzado cómodo para descenso a cuevas", "Protector solar", "Agua"]'::jsonb,
  restrictions = '["Personas con claustrofobia"]'::jsonb
WHERE slug = 'bernal-freixenet-queretaro';

-- 22. QUERÉTARO: TRANVÍA CLÁSICO
UPDATE public.activities SET 
  images = '["https://cdn.getyourguide.com/image/format=auto,fit=crop,gravity=center,quality=60,width=450,height=450,dpr=2/tour_img/4b24fd4aa45b6308aa7dbe552e09a2610b362ea96273c6dd0e6dd88bd3559b52.jpg"]'::jsonb,
  included_general = '["Tour guiado en tranvía clásico", "Guía en español"]'::jsonb,
  requirements = '["Llegar 10 minutos antes de la salida"]'::jsonb,
  restrictions = '[]'::jsonb
WHERE slug = 'tranvia-clasico-queretaro';

-- 23. RIVIERA MAYA: AQUA NICK
UPDATE public.activities SET 
  images = '["https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/18/71/c2/es-hora-de-experimentar.jpg?w=900&h=500&s=1"]'::jsonb,
  included_general = '["Acceso ilimitado a atracciones, ríos y piscinas", "Toallas y tumbonas"]'::jsonb,
  requirements = '["Pasaporte o ID oficial", "Traje de baño y cambio de ropa", "Sandalias o calzado acuático", "Protector solar biodegradable"]'::jsonb,
  restrictions = '["Embarazadas", "Problemas de espalda o cardíacos", "Silla de ruedas (para atracciones)"]'::jsonb
WHERE slug = 'aqua-nick-riviera-maya';

-- 24. ROATÁN: SANTUARIO MONO Y PEREZOSO
UPDATE public.activities SET
  images = '["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8NzXBGrK8J_LAMZm6LN1StsGqL99kywssXw&s"]'::jsonb,
  included_general = '["Guía bilingüe", "Entrada a los santuarios", "Acceso a Club de playa con sillas, duchas y WiFi"]'::jsonb,
  requirements = '["Protector solar", "Repelente de insectos"]'::jsonb,
  restrictions = '["Personas con problemas de movilidad"]'::jsonb
WHERE slug = 'santuario-mono-perezoso';

-- 25. SAYULITA: PASEO A CABALLO
UPDATE public.activities SET 
  images = '["https://media.tacdn.com/media/attractions-splice-spp-674x446/11/0d/de/1c.jpg"]'::jsonb,
  included_general = '["Agua embotellada", "Todo el equipo necesario para montar", "Acceso a piscina del rancho"]'::jsonb,
  requirements = '["Calzado cerrado o de senderismo (prohibidas chanclas)", "Ropa transpirable", "Repelente y protector solar"]'::jsonb,
  restrictions = '["Bebés menores de 1 año y mayores de 70 años", "Embarazadas", "Personas en silla de ruedas o problemas de espalda", "Peso máximo 150 kg"]'::jsonb
WHERE slug = 'paseo-caballo-sayulita';

-- 26. VALLADOLID: ABEJAS MAYAS XKOPEK
UPDATE public.activities SET 
  images = '["https://www.nationalgeographic.com.es/medio/2020/11/18/abeja-en-un-panal_144b397e.jpg"]'::jsonb,
  included_general = '["Entrada al parque apícola Xkopek", "Guía bilingüe especializado", "Degustación de miel y agua fresca"]'::jsonb,
  requirements = '["Ropa cómoda", "Calzado cerrado para zonas pedregosas", "Únicamente repelente orgánico"]'::jsonb,
  restrictions = '["Menores de 5 años"]'::jsonb
WHERE slug = 'abejas-mayas-xkopek';