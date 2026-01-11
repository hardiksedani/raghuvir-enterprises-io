import { create } from 'zustand';
import { CustomerType } from './supabase';

interface CartItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  image_url: string;
}

interface StoreState {
  customerType: CustomerType;
  setCustomerType: (type: CustomerType) => void;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
}

export const useStore = create<StoreState>((set, get) => ({
  customerType: 'retailer',
  setCustomerType: (type) => set({ customerType: type, cart: [] }),
  cart: [],
  addToCart: (item) => set((state) => {
    const existing = state.cart.find((i) => i.product_id === item.product_id);
    if (existing) {
      return {
        cart: state.cart.map((i) =>
          i.product_id === item.product_id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        ),
      };
    }
    return { cart: [...state.cart, item] };
  }),
  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter((i) => i.product_id !== productId),
  })),
  updateQuantity: (productId, quantity) => set((state) => ({
    cart: state.cart.map((i) =>
      i.product_id === productId ? { ...i, quantity } : i
    ),
  })),
  clearCart: () => set({ cart: [] }),
  getTotalAmount: () => {
    const state = get();
    return state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },
}));
