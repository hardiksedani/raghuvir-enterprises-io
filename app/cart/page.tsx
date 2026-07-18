'use client';

import { useStore } from '@/lib/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Trash2, ShoppingBag, ChevronRight, ArrowRight } from 'lucide-react';

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

        <div className="container-page max-w-lg mx-auto text-center space-y-6 py-24">
          <div className="w-28 h-28 rounded-3xl bg-[rgb(var(--elevated))] border border-[rgb(var(--border))] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-14 h-14 text-[rgb(var(--muted))]/40" />
          </div>
          <h1 className="text-3xl font-bold">Your cart is empty</h1>
          <p className="text-[rgb(var(--muted))]">
            Looks like you haven&apos;t added anything yet. Start shopping to fill it up!
          </p>
          <Link href="/">
            <Button intent="primary" size="lg" className="shadow-[0_6px_20px_rgb(var(--primary)/0.3)]">
              Browse Products
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

        </div>
      </main>
    );
  }

  return (

    <main className="min-h-screen pb-32 lg:pb-16 py-8">
      <div className="container-page space-y-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[rgb(var(--muted))]">
          <Link href="/" className="hover:text-[rgb(var(--text))] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[rgb(var(--text))] font-medium">Cart</span>
        </nav>

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black">Shopping Cart</h1>
          <Badge variant="secondary">{customerType.toUpperCase()}</Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-3">
            {cart.map((item, index) => (
              <div
                key={item.product_id}
                className="card-surface p-5 motion-safe:animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="w-20 h-20 rounded-2xl bg-[rgb(var(--elevated))] overflow-hidden shrink-0 border border-[rgb(var(--border))]">
                    {item.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-[rgb(var(--muted))]/40" />

                      </div>
                    )}
                  </div>


                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold line-clamp-2 text-sm sm:text-base">{item.product_name}</h3>
                    <p className="text-sm text-[rgb(var(--primary))] font-bold mt-1">
                      ₹{item.price.toLocaleString('en-IN')} each
                    </p>
                    <div className="flex items-center gap-3 mt-3 flex-wrap">

                      <Quantity
                        value={item.quantity}
                        onChange={(qty) => updateQuantity(item.product_id, qty)}
                        min={1}
                      />

                      <button
                        onClick={() => removeFromCart(item.product_id)}
                        className="flex items-center gap-1.5 text-sm text-[rgb(var(--danger))] hover:bg-[rgb(var(--danger))]/10 px-2 py-1 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-[rgb(var(--text))]">

                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            ))}


            {/* Continue shopping */}
            <div className="pt-2">
              <Link href="/" className="inline-flex items-center gap-2 text-sm text-[rgb(var(--primary))] hover:underline">
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Desktop order summary */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="card-surface p-6 sticky top-24 space-y-5">
              <h2 className="text-xl font-bold">Order Summary</h2>

              <div className="space-y-3 text-sm">
                {cart.map(item => (
                  <div key={item.product_id} className="flex justify-between text-[rgb(var(--muted))]">
                    <span className="truncate max-w-[140px]">{item.product_name} × {item.quantity}</span>
                    <span className="font-medium text-[rgb(var(--text))]">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[rgb(var(--border))] pt-4">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-black text-[rgb(var(--primary))]">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <Button
                intent="primary"
                size="lg"
                fullWidth
                onClick={() => router.push('/checkout')}
                className="shadow-[0_4px_16px_rgb(var(--primary)/0.3)]"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky checkout bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[rgb(var(--border))] bg-[rgb(var(--surface))]/95 backdrop-blur-md px-4 py-3 shadow-[0_-8px_32px_rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-[rgb(var(--muted))]">{cart.length} item{cart.length !== 1 ? 's' : ''}</p>
            <p className="text-lg font-black text-[rgb(var(--primary))]">₹{total.toLocaleString('en-IN')}</p>
          </div>
          <Button
            intent="primary"
            size="lg"
            onClick={() => router.push('/checkout')}
            className="shadow-[0_4px_16px_rgb(var(--primary)/0.3)] px-8"
          >
            Checkout
            <ArrowRight className="w-4 h-4" />
          </Button>

        </div>
      </div>
    </main>
  );
}
