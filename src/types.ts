// Database types
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  active: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  code?: string;
  price?: number;
  image_url?: string;
  images?: string; // JSON string
  featured: number;
  active: number;
  stock_quantity: number;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface ProductWithCategory extends Product {
  category_name: string;
  category_slug: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  customer_address?: string;
  customer_city?: string;
  customer_state?: string;
  customer_zip?: string;
  items: string; // JSON string
  total: number;
  status: OrderStatus;
  notes?: string;
  whatsapp_sent: number;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  product_code?: string;
  quantity: number;
  price: number;
  subtotal: number;
  created_at: string;
}

export interface Setting {
  id: number;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

// Application types
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface CheckoutData {
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  customer_address?: string;
  customer_city?: string;
  customer_state?: string;
  customer_zip?: string;
  notes?: string;
}

// Cloudflare bindings
export interface Env {
  DB: D1Database;
  IMAGES: R2Bucket;
  WHATSAPP_NUMBER: string;
  ADMIN_USERNAME: string;
  ADMIN_PASSWORD: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
