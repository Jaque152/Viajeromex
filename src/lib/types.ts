//DEFINICIÓN DE CATALOGOS
export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface ServiceLevel {
  id: number;
  name: string; // "Básico", "Premium", "Aventurero"
}

//ACTIVIDADES Y PAQUETES

export interface Experience {
  id: number;
  title: string;
  slug: string;
  description: string;
  location: string;
  duration?: string;
  // JSONB Arrays convertidos a string[]
  images: string[]; // Carrusel de imagenes
  itinerary?: string[]; // Para la línea de tiempo
  requirements?: string[]; // Qué llevar
  restrictions?: string[]; // No apto para...
  included_general?: string[]; // Lo que siempre incluye
  
  category_id: number;
  categories?: Category; //para joins
}

// Interfaz auxiliar para mapear el JSONB de features de forma segura
export interface PackageFeatures {
  tipo?: string;
  incluye?: string[];
  no_incluye?: string[];
  ventaja?: string;
}


export interface ActivityPackage {
  id: number;
  activity_id: number;
  level_id: number;
  price: number; // Este es el unit_price
  features: PackageFeatures; // es un objeto JSON
  min_pax: number; 
  max_pax?: number; 
  is_active: boolean; 
  service_levels?: ServiceLevel; // Para Joins
}

// Tabla de disponibilidad
export interface ActivityAvailability {
  id: number;
  package_id: number;
  scheduled_date: string; // 'YYYY-MM-DD'
  scheduled_time?: string; // 'HH:mm:ss'
  remaining_slots: number;
}

// CLIENTES Y COTIZACIONES
export interface Customer {
  id: string; // UUID
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  created_at: string;
}

export interface CustomQuote {
  id: number;
  customer_name: string;
  customer_email: string;
  phone: string;
  destination: string;
  start_date?: string;
  end_date?: string;
  pax_qty: number; 
  budget: string;
  special_requests: string;
  status: 'pending' | 'attended';
  created_at: string;
}

export interface ContactMessage {
  id: number;
  full_name: string;
  phone: string;
  email: string;
  message: string;
  created_at: string;
}


// RESERVAS Y PAGOS

export interface Booking {
  id: string; // UUID
  customer_id: string;
  session_id?: string; //Para rastreo de carritos invitados
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  
  // Campos para la simulación de pago
  transaction_id?: string;
  payment_provider?: string;
  payment_date?: string;
  
  created_at: string;
  
  // Campos de facturación
  rfc?: string;
  razon_social?: string;
  direccion_facturacion?: string;
  ciudad_facturacion?: string;
  estado_facturacion?: string;
  codigo_postal_facturacion?: string;

  customers?: Customer; // Para Joins al mostrar el detalle
}

export interface BookingItem {
  id: number;
  booking_id: string;
  package_id: number;
  scheduled_date: string;
  scheduled_time?: string; // Si el tour tiene horarios
  pax_qty: number; 
  unit_price: number;
  
  // Relación para el Dashboard
  activity_packages?: {
    features: PackageFeatures;
    activities: { title: string; location: string };
  };
}

// --- INTERFAZ DEL CARRITO ---
export interface CartItem {
  id?: number; // Opcional si es solo estado local, obligatorio si viene de la tabla cart_items
  sessionId?: string; // Para identificar al invitado
  packageId: number; // Usamos el ID del paquete real de la BD
  experience: Experience;
  levelName: string; // "Básico", "Premium", etc.
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm 
  people: number;
  pricePerPerson: number;
  totalPrice: number; // (pricePerPerson * people)
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface FifaExp {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  items: string[];
  image_url: string;
}