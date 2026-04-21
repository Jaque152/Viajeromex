export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface ContactMessage {
  id: number;
  full_name: string;
  phone: string;
  email: string;
  message: string;
  created_at: string;
}

export interface Experience {
  id: number;
  title: string;
  slug: string;
  description: string;
  location: string;
  duration?: string;
  images: string[]; 
  what_you_will_do?: string[];      
  itinerary?: string[]; 
  requirements?: string[]; 
  important_info?: Record<string, string[]>; 
  included_general?: string[]; 
  category_id: number;
  categories?: Category; 
}

export interface PackageFeatures {
  incluye?: string[];
  no_incluye?: string[];
}

export interface ActivityPackage {
  id: number;
  activity_id: number;
  package_name: string; 
  price: number; 
  features: PackageFeatures; 
  min_pax: number; 
  max_pax?: number; 
  is_active: boolean; 
}

export interface Customer {
  id: string; 
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

export interface Booking {
  id: string; 
  customer_id: string;
  session_id?: string; 
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  transaction_id?: string;
  payment_provider?: string;
  payment_date?: string;
  created_at: string;
  pais?: string;
  direccion?: string;
  localidad?: string;
  estado?: string;
  codigo_postal?: string;
  order_notes?: string;
  customers?: Customer; 
}

export interface BookingItem {
  id: number;
  booking_id: string;
  package_id: number;
  scheduled_date: string;
  scheduled_time?: string; 
  pax_qty: number; 
  unit_price: number;
  activity_packages?: {
    features: PackageFeatures;
    package_name: string;
    activities: { title: string; location: string };
  };
}

export interface CartItem {
  id?: number; 
  sessionId?: string; 
  packageId: number; 
  experience: Experience;
  levelName: string; 
  date: string; 
  time?: string; 
  people: number;
  pricePerPerson: number;
  totalPrice: number; 
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

export interface SupabaseExperienceResponse {
  id: number;
  title: string;
  slug: string;
  description: string;
  location: string;
  images: string[]; 
  category_id: number;
  categories?: { id: number; name: string; slug: string } | null;
  activity_packages?: { price: number; package_name: string }[];
}