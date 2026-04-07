-- Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Limpieza previa 
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
DROP TABLE IF EXISTS public.fifa_experiences CASCADE;
DROP TABLE IF EXISTS public.translations CASCADE;

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
  public.fifa_experiences
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
-- ==========================================}
-- 1. Cabo San Lucas: Cuatrimotos
INSERT INTO public.activity_packages (activity_id, level_id, price, features) VALUES
((SELECT id FROM public.activities WHERE slug='cabo-cuatrimoto-tequila'), 1, 2600.00, '{"incluye": ["Cuatrimoto Doble", "Guía bilingüe", "Equipo seguridad", "Agua", "Degustación Tequila"], "no_incluye": ["Entrada al parque 25 USD", "Seguro colisión"]}'::jsonb),
((SELECT id FROM public.activities WHERE slug='cabo-cuatrimoto-tequila'), 3, 4200.00, '{"incluye": ["Cuatrimoto Individual", "Guía bilingüe", "Equipo seguridad", "Agua", "Degustación Tequila"], "no_incluye": ["Entrada al parque 25 USD", "Seguro colisión"]}'::jsonb);

-- 2. Cancún: Nada con manatíes
INSERT INTO public.activity_packages (activity_id, level_id, price, features) VALUES
((SELECT id FROM public.activities WHERE slug='manaties-isla-mujeres'), 2, 3400.00, '{"incluye": ["Encuentro manatíes", "Ferry ida y vuelta", "Almuerzo buffet", "Barra libre no alcohólica", "Taquillas y duchas"], "no_incluye": ["Tasa portuaria 15 USD", "Fotos"]}'::jsonb);

-- 3. CDMX: Lucha Libre
INSERT INTO public.activity_packages (activity_id, level_id, price, features) VALUES
((SELECT id FROM public.activities WHERE slug='lucha-libre-cdmx'), 2, 3400.00, '{"incluye": ["Taller de máscara", "Máscara personalizada", "Entrada Arena México", "Cerveza ilimitada", "Anfitrión"], "no_incluye": ["Alimentos sólidos", "Propinas"]}'::jsonb);

-- 4. CDMX: Tequila y Mezcal
INSERT INTO public.activity_packages (activity_id, level_id, price, features) VALUES
((SELECT id FROM public.activities WHERE slug='museo-tequila-mezcal-cdmx'), 1, 2600.00, '{"tipo": "Grupo Reducido", "incluye": ["Entrada a MUTEM", "Degustación guiada", "Aperitivos", "Embajador cultural"]}'::jsonb),
((SELECT id FROM public.activities WHERE slug='museo-tequila-mezcal-cdmx'), 3, 3500.00, '{"tipo": "Tour Privado", "incluye": ["Entrada a MUTEM", "Degustación guiada privada", "Aperitivos", "Embajador cultural exclusivo"]}'::jsonb);

-- 5. CDMX: Murales Diego Rivera
INSERT INTO public.activity_packages (activity_id, level_id, price, features) VALUES
((SELECT id FROM public.activities WHERE slug='murales-diego-rivera-cdmx'), 1, 2680.00, '{"incluye": ["Tour guiado especializado", "Entrada a museos"], "no_incluye": ["Comidas", "Propinas"]}'::jsonb);

-- 6. Cuevas de Tolantongo
INSERT INTO public.activity_packages (activity_id, level_id, price, features) VALUES
((SELECT id FROM public.activities WHERE slug='cuevas-tolantongo'), 1, 3600.00, '{"incluye": ["Entrada a las cuevas", "Guía bilingüe", "Transporte interno", "Taquilla"], "no_incluye": ["Almuerzo"]}'::jsonb),
((SELECT id FROM public.activities WHERE slug='cuevas-tolantongo'), 2, 4500.00, '{"incluye": ["Entrada a las cuevas", "Guía bilingüe", "Transporte interno", "Almuerzo para llevar"]}'::jsonb),
((SELECT id FROM public.activities WHERE slug='cuevas-tolantongo'), 3, 8900.00, '{"tipo": "Privado", "incluye": ["Entrada a las cuevas", "Guía privado exclusivo", "Acceso completo a zonas"]}'::jsonb);

-- 7. Desde Cabo: Tiburones Ballena en La Paz
INSERT INTO public.activity_packages (activity_id, level_id, price, features) VALUES
((SELECT id FROM public.activities WHERE slug='tiburon-ballena-desde-cabo'), 3, 5100.00, '{"incluye": ["Traslado terrestre", "Desayuno ligero", "Guía certificado", "Equipo snorkel completo", "Traje neopreno", "Almuerzo de tacos"]}'::jsonb);

-- 8. El Rosario: Mariposa Monarca
INSERT INTO public.activity_packages (activity_id, level_id, price, features) VALUES
((SELECT id FROM public.activities WHERE slug='mariposa-monarca-rosario'), 1, 3200.00, '{"incluye": ["Entrada al santuario", "Tickets de peaje", "Paseo a caballo interno"], "no_incluye": ["Transporte principal", "Comidas"]}'::jsonb);

-- 9. Excursión Amealco, Tequisquiapan, Bernal
INSERT INTO public.activity_packages (activity_id, level_id, price, features) VALUES
((SELECT id FROM public.activities WHERE slug='amealco-tequisquiapan-bernal'), 2, 3780.00, '{"incluye": ["Guía turístico", "Taller de muñecos Lele", "Acompañamiento"]}'::jsonb);

-- 10. La Paz/La Ventana: Safari Oceánico
INSERT INTO public.activity_packages (activity_id, level_id, price, features) VALUES
((SELECT id FROM public.activities WHERE slug='safari-oceanico-la-paz'), 3, 5100.00, '{"incluye": ["Navegación en panga", "Biólogo marino", "Equipo snorkel", "Comida y bebidas"], "no_incluye": ["Bebidas alcohólicas", "Buceo"]}'::jsonb);

-- 11. La Paz: Tiburón Ballena (Biólogo)
INSERT INTO public.activity_packages (activity_id, level_id, price, features) VALUES
((SELECT id FROM public.activities WHERE slug='nado-tiburon-ballena-biologo'), 2, 4300.00, '{"incluye": ["Equipo snorkel", "Traje neopreno", "Guía biólogo marino", "Expedición guiada"]}'::jsonb);

-- 12. La Paz: Safari Delfines y Orcas
INSERT INTO public.activity_packages (activity_id, level_id, price, features) VALUES
((SELECT id FROM public.activities WHERE slug='safari-delfines-orcas-paz'), 3, 5300.00, '{"incluye": ["Safari guiado 8 horas", "Guía especializado"], "no_incluye": ["Alimentos", "Bebidas"]}'::jsonb);

-- 13. Los Cabos: Avistamiento Ballenas
INSERT INTO public.activity_packages (activity_id, level_id, price, features) VALUES
((SELECT id FROM public.activities WHERE slug='avistamiento-ballenas-cabos'), 1, 2200.00, '{"incluye": ["Embarcación con sombra", "Guía bilingüe", "Agua", "Chaleco"], "no_incluye": ["Transporte hotel", "Alimentos"]}'::jsonb);

-- 14. Los Cabos: Crucero Pirata
INSERT INTO public.activity_packages (activity_id, level_id, price, features) VALUES
((SELECT id FROM public.activities WHERE slug='crucero-pirata-cabos'), 2, 1900.00, '{"incluye": ["Espectáculo en vivo", "Cena barbacoa", "Bebidas ilimitadas"], "no_incluye": ["Cuota de muelle 5 USD"]}'::jsonb);

-- 15. Los Cabos: Lancha Transparente
INSERT INTO public.activity_packages (activity_id, level_id, price, features) VALUES
((SELECT id FROM public.activities WHERE slug='arco-lancha-transparente'), 2, 3500.00, '{"incluye": ["Paseo lancha cristal", "Visita Arco", "Degustación tequila"], "no_incluye": ["Impuesto muelle 100 MXN", "Comida"]}'::jsonb);

-- 16. Martinica: Delfines y Arrecifes
INSERT INTO public.activity_packages (activity_id, level_id, price, features) VALUES
((SELECT id FROM public.activities WHERE slug='delfines-arrecife-martinica'), 1, 1800.00, '{"incluye": ["Guía bilingüe", "Aperitivos locales", "Refrescos"]}'::jsonb);

-- 17. Morelia: Tour Privado Centro
INSERT INTO public.activity_packages (activity_id, level_id, price, features) VALUES
((SELECT id FROM public.activities WHERE slug='tour-morelia-centro'), 3, 8460.00, '{"tipo": "Privado hasta 4 pax", "incluye": ["Guía local experto", "Ruta flexible", "Historias personalizadas"]}'::jsonb);

-- 18. Nevado Toluca
INSERT INTO public.activity_packages (activity_id, level_id, price, features) VALUES
((SELECT id FROM public.activities WHERE slug='nevado-toluca-cima'), 3, 4500.00, '{"incluye": ["Guía profesional", "Tasas montaña", "Material técnico", "Seguro"]}'::jsonb);

-- 19. Pátzcuaro Janitzio
INSERT INTO public.activity_packages (activity_id, level_id, price, features) VALUES
((SELECT id FROM public.activities WHERE slug='patzcuaro-janitzio-redes'), 2, 3850.00, '{"incluye": ["Guía/conductor", "Paseo en barco", "Entradas"]}'::jsonb);

-- 20. Puerto Vallarta: Tortugas
INSERT INTO public.activity_packages (activity_id, level_id, price, features) VALUES
((SELECT id FROM public.activities WHERE slug='liberacion-tortugas-vallarta'), 1, 1800.00, '{"incluye": ["Guía especializado", "Liberación", "Demostración nidos", "Agua", "Fotos"]}'::jsonb);

-- 21. Querétaro: Peña y Freixenet
INSERT INTO public.activity_packages (activity_id, level_id, price, features) VALUES
((SELECT id FROM public.activities WHERE slug='bernal-freixenet-queretaro'), 2, 1600.00, '{"incluye": ["Visita Bernal", "Entrada Cavas", "Cata de vino", "Guía en vivo"]}'::jsonb);

-- 22. Querétaro: Tranvía
INSERT INTO public.activity_packages (activity_id, level_id, price, features) VALUES
((SELECT id FROM public.activities WHERE slug='tranvia-clasico-queretaro'), 1, 500.00, '{"tipo": "1 Ruta", "incluye": ["Tour guiado", "Tranvía"]}'::jsonb),
((SELECT id FROM public.activities WHERE slug='tranvia-clasico-queretaro'), 2, 900.00, '{"tipo": "2 Rutas (Completo)", "incluye": ["Tour guiado extendido", "Tranvía"]}'::jsonb);

-- 23. Riviera Maya: Aqua Nick
INSERT INTO public.activity_packages (activity_id, level_id, price, features) VALUES
((SELECT id FROM public.activities WHERE slug='aqua-nick-riviera-maya'), 2, 5800.00, '{"incluye": ["Entrada total", "Splash Bites (comida y bebida)", "Toallas"]}'::jsonb);

-- 24. Roatán: Santuario
INSERT INTO public.activity_packages (activity_id, level_id, price, features) VALUES
((SELECT id FROM public.activities WHERE slug='santuario-mono-perezoso'), 3, 3500.00, '{"tipo": "Privado", "incluye": ["Guía", "Entradas santuarios", "Club de playa con WiFi"]}'::jsonb);

-- 25. Sayulita: Caballo
INSERT INTO public.activity_packages (activity_id, level_id, price, features) VALUES
((SELECT id FROM public.activities WHERE slug='paseo-caballo-sayulita'), 1, 2200.00, '{"tipo": "Corto (1 hora)", "incluye": ["Entrada rancho", "Agua", "Equipo", "Piscina"]}'::jsonb),
((SELECT id FROM public.activities WHERE slug='paseo-caballo-sayulita'), 2, 2150.00, '{"tipo": "Atardecer (2 horas)", "incluye": ["Paseo guiado", "Agua", "Equipo", "Piscina"]}'::jsonb),
((SELECT id FROM public.activities WHERE slug='paseo-caballo-sayulita'), 3, 2900.00, '{"tipo": "Largo (2 horas)", "incluye": ["Paseo guiado largo", "Agua", "Equipo", "Piscina"]}'::jsonb);

-- 26. Valladolid: Abejas Mayas
INSERT INTO public.activity_packages (activity_id, level_id, price, features) VALUES
((SELECT id FROM public.activities WHERE slug='abejas-mayas-xkopek'), 1, 800.00, '{"incluye": ["Entrada Xkopek", "Guía bilingüe", "Degustación miel", "Agua fresca"]}'::jsonb);


-- ==========================================
-- 5. INSERTAR DETALLES DE LAS EXPERIENCIAS
-- =========================================
-- 1. CABO SAN LUCAS: CUATRIMOTOS
UPDATE public.activities SET 
  images = '["https://images.unsplash.com/photo-1553966012-dd33086ea262?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]'::jsonb,
  included_general = '["Guía turístico bilingüe", "Equipo de seguridad (casco, gafas y paliacate)", "Agua purificada", "Capacitación e introducción al manejo"]'::jsonb,
  requirements = '["Calzado cerrado y cómodo", "Protector solar", "Ropa cómoda que se pueda ensuciar"]'::jsonb,
  restrictions = '["Mujeres embarazadas"]'::jsonb
WHERE slug = 'cabo-cuatrimoto-tequila';

-- 2. CANCÚN: MANATÍES
UPDATE public.activities SET 
  images = '["https://images.unsplash.com/photo-1578404421628-5d0b4c8662de?q=80&w=1183&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]'::jsonb,
  included_general = '["Encuentro con manatíes con instructor especializado", "Acceso a taquillas, duchas, tumbonas y piscina"]'::jsonb,
  requirements = '["Bañador", "Protector solar biodegradable"]'::jsonb,
  restrictions = '["Menores de 8 años", "Embarazadas y personas con problemas de movilidad", "Prohibido el uso de cámaras o celulares durante el encuentro"]'::jsonb
WHERE slug = 'manaties-isla-mujeres';

-- 3. CDMX: LUCHA LIBRE
UPDATE public.activities SET 
  images = '["https://images.unsplash.com/photo-1524633412778-878453ef0cd7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]'::jsonb,
  included_general = '["Anfitrión bilingüe especializado", "Taller de diseño y elaboración", "Regalo vintage sorpresa"]'::jsonb,
  requirements = '[]'::jsonb,
  restrictions = '["Personas con problemas de movilidad"]'::jsonb
WHERE slug = 'lucha-libre-cdmx';

-- 4. CDMX: TEQUILA Y MEZCAL
UPDATE public.activities SET 
  images = '["https://images.unsplash.com/photo-1674916084024-50cdd3f6b864?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]'::jsonb,
  included_general = '["Entrada al Museo del Tequila y Mezcal (MUTEM)", "Acceso a exposiciones permanentes"]'::jsonb,
  requirements = '["Identificación oficial"]'::jsonb,
  restrictions = '["Menores de 18 años", "Personas en silla de ruedas"]'::jsonb
WHERE slug = 'museo-tequila-mezcal-cdmx';

-- 5. CDMX: MURALES DIEGO RIVERA
UPDATE public.activities SET 
  images = '["https://plus.unsplash.com/premium_photo-1677611303654-c29103848c0d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]'::jsonb,
  included_general = '["Guía experto en historia y arte"]'::jsonb,
  requirements = '["Calzado cómodo para caminar", "Pasaporte o identificación oficial"]'::jsonb,
  restrictions = '[]'::jsonb
WHERE slug = 'murales-diego-rivera-cdmx';

-- 6. CUEVAS DE TOLANTONGO
UPDATE public.activities SET 
  images = '["https://images.unsplash.com/photo-1730985764421-3b7e512534bb?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]'::jsonb,
  included_general = '["Alquiler de taquilla"]'::jsonb,
  requirements = '["Gafas de sol", "Bañador", "Muda de ropa", "Toalla", "Calzado acuático", "Dinero en efectivo", "Pasaporte o copia"]'::jsonb,
  restrictions = '["Personas en silla de ruedas"]'::jsonb
WHERE slug = 'cuevas-tolantongo';

-- 7. DESDE CABO: TIBURÓN BALLENA
UPDATE public.activities SET 
  images = '["https://images.unsplash.com/photo-1544552866-49ce864ff896?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]'::jsonb,
  included_general = '["Transporte redondo", "Desayuno ligero", "Guía certificado", "Equipo de snorkel, chaleco y traje de neopreno", "Tiempo libre en La Paz"]'::jsonb,
  requirements = '["Traje de baño", "Toalla", "Cámara", "Chamarra ligera"]'::jsonb,
  restrictions = '["Menores de 8 años", "Mujeres embarazadas", "Personas con problemas de espalda o cuello", "Personas con movilidad reducida o silla de ruedas"]'::jsonb
WHERE slug = 'tiburon-ballena-desde-cabo';

-- 8. EL ROSARIO: MARIPOSA MONARCA
UPDATE public.activities SET 
  images = '["https://images.unsplash.com/photo-1525468552045-b18dbaa5a45f?q=80&w=1229&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]'::jsonb,
  included_general = '["Entrada al santuario El Rosario", "Tickets de peaje y aparcamiento"]'::jsonb,
  requirements = '["Calzado cómodo y de senderismo", "Ropa abrigada", "Protector solar", "Agua", "Prismáticos y cámara"]'::jsonb,
  restrictions = '["Embarazadas", "Personas con problemas de movilidad o espalda", "Problemas cardíacos o respiratorios", "Personas sensibles al mal de altura (está a más de 3,000 msnm)"]'::jsonb
WHERE slug = 'mariposa-monarca-rosario';

-- 9. EXCURSIÓN AMEALCO, TEQUISQUIAPAN, BERNAL
UPDATE public.activities SET 
  images = '["https://images.unsplash.com/photo-1584316273822-7c8d337f6e44?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]'::jsonb,
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
  images = '["https://images.unsplash.com/photo-1576647025587-2b77cd953cba?q=80&w=1143&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]'::jsonb,
  included_general = '["Equipo completo de snorkel y traje de neopreno", "Guía bilingüe biólogo marino", "Fotografías de identificación científica"]'::jsonb,
  requirements = '["Traje de baño", "Protector solar biodegradable", "Botella de agua reutilizable"]'::jsonb,
  restrictions = '["Bebés menores de 1 año", "Mujeres embarazadas", "Personas con movilidad reducida"]'::jsonb
WHERE slug = 'nado-tiburon-ballena-biologo';

-- 12. LA PAZ: SAFARI DELFINES Y ORCAS
UPDATE public.activities SET 
  images = '["https://images.unsplash.com/photo-1608516978217-3714c0aa340e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]'::jsonb,
  included_general = '["Safari oceánico guiado de exploración", "Guía bilingüe especializado"]'::jsonb,
  requirements = '["Ropa cómoda y de abrigo ligero", "Gafas de sol y sombrero", "Protector solar biodegradable", "Medicación para el mareo"]'::jsonb,
  restrictions = '["Mujeres embarazadas", "Personas con problemas severos de movilidad", "Personas con alta sensibilidad al mareo"]'::jsonb
WHERE slug = 'safari-delfines-orcas-paz';

-- 13. LOS CABOS: AVISTAMIENTO DE BALLENAS
UPDATE public.activities SET 
  images = '["https://images.unsplash.com/photo-1568430462989-44163eb1752f?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]'::jsonb,
  included_general = '["Embarcación con área sombreada y sanitario marino", "Guía bilingüe", "Agua embotellada y chaleco salvavidas"]'::jsonb,
  requirements = '["Protector solar biodegradable", "Chamarra o sudadera ligera", "Medicación contra el mareo"]'::jsonb,
  restrictions = '["Niños menores de 4 años", "Mujeres embarazadas", "Personas con afecciones de espalda"]'::jsonb
WHERE slug = 'avistamiento-ballenas-cabos';

-- 14. LOS CABOS: CRUCERO PIRATA
UPDATE public.activities SET 
  images = '["https://plus.unsplash.com/premium_photo-1756175546805-e3498cbb07b8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]'::jsonb,
  included_general = '["Espectáculo interactivo en vivo a bordo", "Cena barbacoa estilo pirata", "Barra libre ilimitada"]'::jsonb,
  requirements = '["Tarjeta de crédito o efectivo para gastos adicionales y propinas"]'::jsonb,
  restrictions = '[]'::jsonb
WHERE slug = 'crucero-pirata-cabos';

-- 15. LOS CABOS: LANCHA TRANSPARENTE
UPDATE public.activities SET 
  images = '["https://images.unsplash.com/photo-1679310290383-a5ed4c3145a3?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]'::jsonb,
  included_general = '["Paseo por la bahía en lancha de cristal", "Visita guiada al Arco"]'::jsonb,
  requirements = '["Toalla", "Ropa de playa", "Traje de baño"]'::jsonb,
  restrictions = '["Personas recién operadas", "Personas con fuerte mareo por movimiento", "Mayores de 95 años", "Prohibido zapatos de tacón"]'::jsonb
WHERE slug = 'arco-lancha-transparente';

-- 16. MARTINICA: DELFINES Y ARRECIFES
UPDATE public.activities SET 
  images = '["https://images.unsplash.com/photo-1637308106043-f4d78ad9e0e0?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]'::jsonb,
  included_general = '["Guía bilingüe", "Aperitivos y refrescos locales"]'::jsonb,
  requirements = '["Protector solar", "Gafas de sol y sombrero", "Calzado cómodo para el barco", "Traje de baño"]'::jsonb,
  restrictions = '["Personas con movilidad reducida (según accesibilidad del barco)"]'::jsonb
WHERE slug = 'delfines-arrecife-martinica';

-- 17. MORELIA: TOUR CENTRO HISTÓRICO
UPDATE public.activities SET 
  images = '["https://images.unsplash.com/photo-1700960566497-cbc1d5e396a0?q=80&w=1051&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]'::jsonb,
  included_general = '["Tour a pie con guía local experto"]'::jsonb,
  requirements = '["Calzado cómodo (hay superficies irregulares)"]'::jsonb,
  restrictions = '[]'::jsonb
WHERE slug = 'tour-morelia-centro';

-- 18. NEVADO DE TOLUCA
UPDATE public.activities SET 
  images = '["https://plus.unsplash.com/premium_photo-1701151540950-1f4bab0ef5d9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]'::jsonb,
  included_general = '["Guía profesional", "Tasas de montaña", "Material técnico", "Seguro"]'::jsonb,
  requirements = '["Calzado de senderismo", "Ropa de lluvia y abrigo", "Guantes y gafas de sol", "Muda de ropa y toalla"]'::jsonb,
  restrictions = '["Embarazadas", "Personas con problemas de espalda o movilidad", "Problemas respiratorios, epilepsia o hemofilia"]'::jsonb
WHERE slug = 'nevado-toluca-cima';

-- 19. PÁTZCUARO - JANITZIO
UPDATE public.activities SET 
  images = '["https://images.unsplash.com/photo-1583594122640-87580dec8952?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]'::jsonb,
  included_general = '["Guía/conductor bilingüe", "Paseo en barco por la isla", "Entradas y admisiones"]'::jsonb,
  requirements = '["Calzado cómodo", "Gorra", "Cámara", "Dinero en efectivo"]'::jsonb,
  restrictions = '["Menores de 10 años", "Personas en silla de ruedas", "Personas con peso superior a 100 kg", "Personas con hipertensión"]'::jsonb
WHERE slug = 'patzcuaro-janitzio-redes';

-- 20. PUERTO VALLARTA: LIBERACIÓN TORTUGAS
UPDATE public.activities SET 
  images = '["https://images.unsplash.com/photo-1645720135736-9ae19651b729?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]'::jsonb,
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
  images = '["https://images.unsplash.com/photo-1604187698587-cfdc58cee2ea?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]'::jsonb,
  included_general = '["Tour guiado en tranvía clásico", "Guía en español"]'::jsonb,
  requirements = '["Llegar 10 minutos antes de la salida"]'::jsonb,
  restrictions = '[]'::jsonb
WHERE slug = 'tranvia-clasico-queretaro';

-- 23. RIVIERA MAYA: AQUA NICK
UPDATE public.activities SET 
  images = '["https://images.unsplash.com/photo-1565358720137-55235e0878a2?q=80&w=1115&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]'::jsonb,
  included_general = '["Acceso ilimitado a atracciones, ríos y piscinas", "Toallas y tumbonas"]'::jsonb,
  requirements = '["Pasaporte o ID oficial", "Traje de baño y cambio de ropa", "Sandalias o calzado acuático", "Protector solar biodegradable"]'::jsonb,
  restrictions = '["Embarazadas", "Problemas de espalda o cardíacos", "Silla de ruedas (para atracciones)"]'::jsonb
WHERE slug = 'aqua-nick-riviera-maya';

-- 24. ROATÁN: SANTUARIO MONO Y PEREZOSO
UPDATE public.activities SET
  images = '["https://plus.unsplash.com/premium_photo-1661877112841-0efa68b18527?q=80&w=1088&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]'::jsonb,
  included_general = '["Guía bilingüe", "Entrada a los santuarios", "Acceso a Club de playa con sillas, duchas y WiFi"]'::jsonb,
  requirements = '["Protector solar", "Repelente de insectos"]'::jsonb,
  restrictions = '["Personas con problemas de movilidad"]'::jsonb
WHERE slug = 'santuario-mono-perezoso';

-- 25. SAYULITA: PASEO A CABALLO
UPDATE public.activities SET 
  images = '["https://plus.unsplash.com/premium_photo-1692895424068-9bfcb99f8d48?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]'::jsonb,
  included_general = '["Agua embotellada", "Todo el equipo necesario para montar", "Acceso a piscina del rancho"]'::jsonb,
  requirements = '["Calzado cerrado o de senderismo (prohibidas chanclas)", "Ropa transpirable", "Repelente y protector solar"]'::jsonb,
  restrictions = '["Bebés menores de 1 año y mayores de 70 años", "Embarazadas", "Personas en silla de ruedas o problemas de espalda", "Peso máximo 150 kg"]'::jsonb
WHERE slug = 'paseo-caballo-sayulita';

-- 26. VALLADOLID: ABEJAS MAYAS XKOPEK
UPDATE public.activities SET 
  images = '["https://plus.unsplash.com/premium_photo-1661859445943-0d14d6faf230?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]'::jsonb,
  included_general = '["Entrada al parque apícola Xkopek", "Guía bilingüe especializado", "Degustación de miel y agua fresca"]'::jsonb,
  requirements = '["Ropa cómoda", "Calzado cerrado para zonas pedregosas", "Únicamente repelente orgánico"]'::jsonb,
  restrictions = '["Menores de 5 años"]'::jsonb
WHERE slug = 'abejas-mayas-xkopek';


-- ==========================================
-- 6. INSERTAR DETALLES MUNDIAL
-- =========================================
CREATE TABLE public.fifa_experiences (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  subtitle VARCHAR,
  description TEXT,
  items JSONB DEFAULT '[]'::jsonb,
  image_url TEXT,
  order_index INTEGER DEFAULT 0
);
-- Insertar la información detallada
INSERT INTO public.fifa_experiences (title, subtitle, description, items, image_url, order_index) VALUES
('Estadios y Museos', 'Recorridos Históricos', 'Visitas guiadas a los templos del fútbol y acceso a zonas restringidas.', '["Visitas guiadas a estadios FIFA y campos históricos", "Acceso a vestidores y zonas VIP (fotos y experiencias interactivas)", "Recorridos por museos de fútbol y exhibiciones temáticas"]', 'https://cdn.aarp.net/content/dam/aarp/entertainment/television/2017/07/1140-world-cup-trophy-ball-trivia-esp.jpg', 1),
('Fan Experiences', 'Interacción Total', 'Zonas de realidad virtual y encuentros con leyendas del deporte.', '["Clínicas de fútbol y retos de habilidades", "Realidad virtual de partidos históricos", "Meet & greet con leyendas"]', 'https://images.unsplash.com/photo-1614632537190-23e4146777db?auto=format&fit=crop&w=800&q=80', 2),
('Viewing Parties', 'Eventos en Vivo', 'Proyección de partidos en pantallas gigantes con ambiente temático.', '["Pantallas gigantes", "Trivia y juegos recreativos", "Catering temático y snacks"]', 'https://www.shutterstock.com/image-photo/watching-match-tv-home-2friends-260nw-2472315955.jpg', 3),
('Cultura y Ciudad', 'Recorridos Urbanos', 'Explora el lado futbolero de las sedes mundialistas.', '["Street football tours", "Bares deportivos icónicos", "Arte urbano y murales de fútbol"]', 'https://ovaciones.com/wp-content/uploads/2025/09/por-1200-x-630-px-2025-09-04T225525.393.png', 4),
('Experiencias educativas', 'Historia del fútbol y estrategias de juego', 'Descubre más acerca del fútbol', '["Talleres", "Trivia con premios"]', 'https://universidadeuropea.com/resources/media/images/tactica-fubtol-800x450.width-640.jpg', 5);

--- BD TRADUCCIONES ------------
CREATE TABLE public.translations (
  id SERIAL PRIMARY KEY,
  key_text TEXT NOT NULL,       -- El texto original en español
  lang VARCHAR(5) NOT NULL,    -- 'en'
  translated_text TEXT NOT NULL, -- El resultado de DeepL
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(key_text, lang)       -- Para no traducir lo mismo dos veces
);


-- Actualización de la tabla Bookings
ALTER TABLE public.bookings
  -- 1. Elimina los campos de facturación obsoletos
  DROP COLUMN IF EXISTS rfc,
  DROP COLUMN IF EXISTS razon_social,
  DROP COLUMN IF EXISTS direccion_facturacion,
  DROP COLUMN IF EXISTS ciudad_facturacion,
  DROP COLUMN IF EXISTS estado_facturacion,
  DROP COLUMN IF EXISTS codigo_postal_facturacion,
  
  -- 2. Añadir los campos obligatorios de dirección
  ADD COLUMN pais VARCHAR,
  ADD COLUMN direccion TEXT,
  ADD COLUMN localidad VARCHAR,
  ADD COLUMN estado VARCHAR,
  ADD COLUMN codigo_postal VARCHAR,
  
  -- 3. Añadir el campo opcional para las notas del pedido
  ADD COLUMN order_notes TEXT;