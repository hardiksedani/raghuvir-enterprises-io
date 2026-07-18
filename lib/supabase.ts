import { createBrowserClient, createServerClient, type CookieOptions } from '@supabase/ssr';

// ─────────────────────────────────────────────────────────────
// Environment variables (REQUIRED)
// ─────────────────────────────────────────────────────────────
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
  );
}

// ─────────────────────────────────────────────────────────────
// Browser Supabase Client (Singleton)
// Used in client components, hooks, auth, etc.
// ─────────────────────────────────────────────────────────────
export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
);

// Optional helper if you explicitly want a fresh browser client
export const supabaseBrowser = () =>
  createBrowserClient(supabaseUrl, supabaseAnonKey);

// ─────────────────────────────────────────────────────────────
// Server Supabase Client
// Used in Server Components / Route Handlers / Middleware
// ─────────────────────────────────────────────────────────────
export const supabaseServer = (cookies: {
  get: (name: string) => string | undefined;
  set?: (name: string, value: string, options: CookieOptions) => void;
  remove?: (name: string, options: CookieOptions) => void;
}) => {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies
  });
};

// ─────────────────────────────────────────────────────────────
// Shared App Types
// ─────────────────────────────────────────────────────────────
export type CustomerType = 'retailer' | 'dealer';

export type Product = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  retailer_price: number;
  dealer_price: number;
  min_dealer_quantity: number;
  stock: number;
  created_at: string;
};

export type OrderItem = {
  product_name: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: string;
  user_id: string;
  created_at: string;
  customer_name: string | null;
  customer_phone: string | null;
  customer_type: CustomerType | null;
<<<<<<< HEAD
=======
  delivery_address: string | null;
>>>>>>> d4b4a93 (update code)
  total_amount: number;
  upi_transaction_id: string | null;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  product_id?: string;
};

export type UserProfile = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  user_role: 'admin' | 'retailer' | 'dealer' | null;
  created_at: string;
};

export type WebsiteItem = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  category: string | null;
  item_type: string;
  content: Record<string, unknown> | null;
  is_published: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
};
