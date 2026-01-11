'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase, Order } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Package, ShoppingBag } from 'lucide-react';

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchOrders = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && user) {
      void fetchOrders();
    } else if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router, fetchOrders]);

  if (authLoading || loading) {
    return (
      <main className="min-h-screen py-16">
        <div className="container-page">
          <div className="text-center space-y-4">
            <Skeleton className="h-12 w-64 mx-auto" />
            <div className="space-y-4 mt-8">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const getStatusVariant = (status: string): 'default' | 'success' | 'warning' | 'destructive' | 'secondary' => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'secondary';
      case 'shipped':
        return 'default';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <main className="min-h-screen py-16">
      <div className="container-page">
        <div className="flex justify-between items-center mb-8 motion-safe:animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Orders</h1>
            <p className="text-[rgb(var(--muted))]">View your order history and track deliveries</p>
          </div>
          <Link href="/">
            <Button intent="outline">Continue Shopping</Button>
          </Link>
        </div>

        {orders.length === 0 ? (
          <Card className="text-center py-20 max-w-md mx-auto">
            <CardHeader>
              <Package className="w-16 h-16 mx-auto mb-4 text-[rgb(var(--muted))]" />
              <CardTitle>No Orders Yet</CardTitle>
              <CardContent className="mt-4">
                <p className="text-[rgb(var(--muted))] mb-6">Start shopping to see your orders here</p>
                <Link href="/">
                  <Button intent="primary">Start Shopping</Button>
                </Link>
              </CardContent>
            </CardHeader>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <Card
                key={order.id}
                className="motion-safe:animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="mb-2">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </CardTitle>
                      <p className="text-sm text-[rgb(var(--muted))]">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}{' '}
                        at {new Date(order.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <Badge variant={getStatusVariant(order.status)}>
                      {order.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6 pb-6 border-b border-[rgb(var(--border))]">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-[rgb(var(--muted))] uppercase tracking-wide">Customer</h4>
                      <div className="space-y-1">
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-sm text-[rgb(var(--muted))]">Phone: {order.customer_phone}</p>
                        {order.customer_type && (
                          <Badge variant="secondary" className="mt-1">
                            {order.customer_type.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-[rgb(var(--muted))] uppercase tracking-wide">Payment</h4>
                      <div className="space-y-1">
                        <p className="text-sm font-mono text-[rgb(var(--muted))] break-all">
                          {order.upi_transaction_id || 'N/A'}
                        </p>
                        <p className="text-2xl font-bold text-[rgb(var(--primary))] mt-2">
                          ₹{order.total_amount.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-[rgb(var(--muted))] uppercase tracking-wide mb-4">Items</h4>
                    <div className="space-y-2">
                      {order.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex justify-between items-center p-4 bg-[rgb(var(--elevated))] rounded-xl border border-[rgb(var(--border))]"
                        >
                          <div className="flex items-center gap-3">
                            <ShoppingBag className="w-5 h-5 text-[rgb(var(--muted))]" />
                            <div>
                              <p className="font-medium">{item.product_name}</p>
                              <p className="text-sm text-[rgb(var(--muted))]">
                                {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                              </p>
                            </div>
                          </div>
                          <span className="font-bold text-lg">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
