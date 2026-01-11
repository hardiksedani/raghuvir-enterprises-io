'use client';

import { useStore } from '@/lib/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Quantity } from '@/components/ui/Quantity';
import { Badge } from '@/components/ui/Badge';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getTotalAmount, customerType } = useStore();
  const router = useRouter();

  const total = getTotalAmount();

  if (cart.length === 0) {
    return (
      <main className="min-h-screen py-16">
        <div className="container-page">
          <div className="card-surface text-center py-20 px-6 motion-safe:animate-fade-in max-w-2xl mx-auto">
            <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-[rgb(var(--muted))]" />
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-lg text-[rgb(var(--muted))] mb-8 max-w-md mx-auto">
              Looks like you haven&apos;t added anything to your cart yet. Start shopping to fill it up!
            </p>
            <Link href="/">
              <Button intent="primary" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-16">
      <div className="container-page">
        <div className="mb-8 motion-safe:animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">Shopping Cart</h1>
          <div className="text-[rgb(var(--muted))]">
            Customer Type:{' '}
            <Badge variant="secondary" className="ml-2">
              {customerType.toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <div
                key={item.product_id}
                className="card-surface p-6 motion-safe:animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-xl bg-[rgb(var(--elevated))] overflow-hidden shrink-0 border border-[rgb(var(--border))]">
                    {item.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image_url}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        📦
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">{item.product_name}</h3>
                    <p className="text-lg font-semibold text-[rgb(var(--primary))] mb-4">
                      ₹{item.price.toLocaleString('en-IN')} each
                    </p>

                    <div className="flex items-center gap-4 flex-wrap">
                      <Quantity
                        value={item.quantity}
                        onChange={(qty) => updateQuantity(item.product_id, qty)}
                        min={1}
                      />
                                        <Button
                    intent="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.product_id)}
                    className="text-[rgb(var(--danger))] hover:bg-[rgb(var(--danger))]/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card-surface p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-[rgb(var(--muted))]">
                  <span>Subtotal ({cart.length} items)</span>
                  <span className="font-semibold text-[rgb(var(--text))]">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="border-t border-[rgb(var(--border))] pt-4 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-2xl text-[rgb(var(--primary))]">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Link href="/" className="block">
                  <Button intent="outline" fullWidth>
                    Continue Shopping
                  </Button>
                </Link>
                <Button
                  intent="primary"
                  size="lg"
                  fullWidth
                  onClick={() => router.push('/checkout')}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
