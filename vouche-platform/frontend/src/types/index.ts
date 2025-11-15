// ================================
// Product Types
// ================================
export interface Product {
  product_id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category_id: number;
  category_name?: string;
  image_url: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  category?: Category;
}

export interface ProductFormData {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category_id: number;
  image_url?: string;
  is_active?: boolean;
}

// ================================
// Category Types
// ================================
export interface Category {
  category_id: number;
  name: string;
  description?: string;
  created_at?: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
}

// ================================
// Order Types
// ================================
export interface Order {
  order_id: number;
  user_id: number;
  total_price: number;
  status: 'pending' | 'paid' | 'cancelled' | 'refunded';
  created_at: string;
  order_date?: string;
  items?: OrderItem[];
  items_count?: number;
}

export interface OrderItem {
  order_item_id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
  image_url?: string;
  gift_codes?: GiftCode[];
}

export interface CreateOrderData {
  cart_items: Array<{
    product_id: number;
    quantity: number;
  }>;
  payment_method?: string;
}

// ================================
// Gift Code Types
// ================================
export interface GiftCode {
  gift_code_id: number;
  code: string;
  product_id: number;
  product_name?: string;
  order_id?: number | null;
  status: 'new' | 'active' | 'used';
  redeemed_at?: string | null;
  created_at: string;
}

export interface GiftCodeFormData {
  code: string;
  product_id: number;
}

// ================================
// User Types
// ================================
export interface User {
  user_id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  created_at?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// ================================
// Cart Types
// ================================
export interface CartItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image_url: string | null;
  stock?: number;
  category_name?: string;
}

// ================================
// API Response Types
// ================================
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationData;
}

// ================================
// Form Types
// ================================
export interface FormErrors {
  [key: string]: string;
}

export interface SelectOption {
  value: string | number;
  label: string;
}

// ================================
// Filter Types
// ================================
export interface ProductFilters {
  category_id?: number;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  search?: string;
  sort_by?: 'name' | 'price' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export interface OrderFilters {
  status?: Order['status'];
  start_date?: string;
  end_date?: string;
  user_id?: number;
}

// ================================
// Dashboard Stats Types
// ================================
export interface DashboardStats {
  total_products: number;
  total_orders: number;
  total_revenue: number;
  total_users: number;
  pending_orders: number;
  low_stock_products: number;
}

// ================================
// API Response Types
// ================================
export interface ProductsResponse {
  success: boolean;
  products: Product[];
  total?: number;
}

export interface CategoriesResponse {
  success: boolean;
  categories: Category[];
  total?: number;
}

export interface OrdersResponse {
  success: boolean;
  orders: Order[];
  total?: number;
}

export interface GiftCodesResponse {
  success: boolean;
  giftCodes: GiftCode[];
  total?: number;
}

export interface SingleProductResponse {
  success: boolean;
  product: Product;
}

export interface SingleCategoryResponse {
  success: boolean;
  category: Category;
}

export interface SingleOrderResponse {
  success: boolean;
  order: Order;
}
