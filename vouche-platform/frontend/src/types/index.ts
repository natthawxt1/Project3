// User Types
export interface User {
  user_id: number;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  created_at?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

// Category Types
export interface Category {
  category_id: number;
  name: string;
}

// Product Types
export interface Product {
  product_id: number;
  category_id: number;
  category_name: string;
  name: string;
  price: number;
  stock: number;
  description?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Gift Code Types
export interface GiftCode {
  gift_code_id: number;
  product_id: number;
  order_id?: number;
  code: string;
  expiration_time?: string;
  status: 'new' | 'active' | 'redeemed' | 'expired' | 'cancelled';
  created_at: string;
  redeemed_at?: string;
}

// Order Types
export interface OrderItem {
  order_item_id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  image_url?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  gift_codes: string[];
}

export interface Order {
  order_id: number;
  user_id: number;
  customer_name?: string;
  customer_email?: string;
  order_date: string;
  total_price: number;
  status: 'pending' | 'paid' | 'cancelled' | 'refunded';
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  items_count?: number;
}

// Cart Types
export interface CartItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  image_url?: string;
  category_name: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
}

export interface ProductsResponse {
  success: boolean;
  count: number;
  products: Product[];
}

export interface CategoriesResponse {
  success: boolean;
  count: number;
  categories: Category[];
}

export interface OrdersResponse {
  success: boolean;
  count: number;
  orders: Order[];
}

export interface OrderDetailsResponse {
  success: boolean;
  order: Order;
}