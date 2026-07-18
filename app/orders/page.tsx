'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase, Order } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  Package, ShoppingBag, ChevronRight, Printer,
  Clock, CheckCircle, Truck, Gift, XCircle, ClipboardList
} from 'lucide-react';
import { cn } from '@/lib/utils';

type StatusStep = { key: Order['status']; label: string; icon: React.ElementType };

const STATUS_STEPS: StatusStep[] = [
  { key: 'pending', label: 'Order Placed', icon: Clock },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: Gift },
];

const STATUS_ORDER: Order['status'][] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

function getStatusIndex(status: Order['status']) {
  return STATUS_ORDER.indexOf(status);
}

function StatusTimeline({ status }: { status: Order['status'] }) {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-2 text-[rgb(var(--danger))]">
        <XCircle className="w-5 h-5" />
        <span className="text-sm font-semibold">Order Cancelled</span>
      </div>
    );
  }

  const currentIdx = getStatusIndex(status);

  return (
    <div className="flex items-center gap-0">
      {STATUS_STEPS.map((step, i) => {
        const isDone = i <= currentIdx;
        const isActive = i === currentIdx;
        const Icon = step.icon;
        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center transition-all',
                  isDone
                    ? isActive
                      ? 'bg-[rgb(var(--primary))] text-white shadow-[0_0_12px_rgb(var(--primary)/0.4)]'
                      : 'bg-[rgb(var(--success))] text-white'
                    : 'bg-[rgb(var(--elevated))] text-[rgb(var(--muted))] border border-[rgb(var(--border))]'
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className={cn('text-[10px] font-medium text-center leading-tight w-16 text-center', isDone ? 'text-[rgb(var(--text))]' : 'text-[rgb(var(--muted))]')}>
                {step.label}
              </span>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div className={cn('h-0.5 w-8 sm:w-12 mb-4 mx-1 transition-all', i < currentIdx ? 'bg-[rgb(var(--success))]' : 'bg-[rgb(var(--border))]')} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function printInvoice(order: Order) {
  const items = order.items
    .map(item => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">${item.product_name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">₹${item.price.toLocaleString('en-IN')}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
      </tr>`)
    .join('');

  const html = `
    <html>
    <head>
      <title>Invoice - Order #${order.id.slice(0, 8).toUpperCase()}</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 700px; margin: 40px auto; color: #111; }
        h1 { font-size: 28px; margin: 0; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
        .brand { font-size: 20px; font-weight: 900; color: #5B9BFF; }
        .meta { font-size: 13px; color: #666; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #f4f8ff; padding: 10px 12px; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: .5px; color: #5B9BFF; }
        td { font-size: 14px; }
        .total-row td { font-weight: bold; font-size: 16px; padding-top: 12px; }
        .footer { margin-top: 40px; font-size: 12px; color: #999; text-align: center; }
        @media print { body { margin: 20px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="brand">Raghuvir Enterprises</div>
          <div class="meta" style="margin-top:4px;">Gujarat, India · contact@raghuvirenterprises.in</div>
        </div>
        <div style="text-align:right;">
          <h1 style="color:#5B9BFF;">INVOICE</h1>
          <div class="meta">#${order.id.slice(0, 8).toUpperCase()}</div>
          <div class="meta">${new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;padding:16px;background:#f9fafc;border-radius:8px;">
        <div>
          <div style="font-size:11px;text-transform:uppercase;color:#999;margin-bottom:4px;">Bill To</div>
          <div style="font-weight:700;">${order.customer_name || '—'}</div>
          <div style="font-size:13px;color:#444;">${order.customer_phone || ''}</div>
          <div style="font-size:13px;color:#444;white-space:pre-wrap;">${order.delivery_address || ''}</div>
        </div>
        <div>
          <div style="font-size:11px;text-transform:uppercase;color:#999;margin-bottom:4px;">Payment</div>
          <div style="font-weight:700;">${order.upi_transaction_id === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</div>
          ${order.upi_transaction_id && order.upi_transaction_id !== 'COD' ? `<div style="font-size:12px;color:#666;word-break:break-all;">Ref: ${order.upi_transaction_id}</div>` : ''}
          <div style="margin-top:8px;font-size:13px;">Status: <strong>${order.status.toUpperCase()}</strong></div>
        </div>
      </div>

      <table>
        <thead><tr>
          <th>Product</th><th style="text-align:center;">Qty</th>
          <th style="text-align:right;">Unit Price</th><th style="text-align:right;">Total</th>
        </tr></thead>
        <tbody>
          ${items}
          <tr class="total-row">
            <td colspan="3" style="padding:12px;text-align:right;border-top:2px solid #5B9BFF;">Grand Total</td>
            <td style="padding:12px;text-align:right;border-top:2px solid #5B9BFF;color:#5B9BFF;">₹${order.total_amount.toLocaleString('en-IN')}</td>
          </tr>
        </tbody>
      </table>

      <div class="footer">Thank you for your business! · Raghuvir Enterprises</div>
    </body>
    </html>`;

  const win = window.open('', '_blank');
  if (win) {
    win.document.write(html);
    win.document.close();
    win.print();
  }
}

const STATUS_BADGE: Record<Order['status'], 'default' | 'success' | 'warning' | 'destructive' | 'secondary'> = {
  pending: 'warning',
  confirmed: 'secondary',
  shipped: 'default',
  delivered: 'success',
  cancelled: 'destructive',
};


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
    } catch {
      // silently fail

    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {

    if (!authLoading && user) void fetchOrders();
    else if (!authLoading && !user) router.push('/login');

  }, [authLoading, user, router, fetchOrders]);

  if (authLoading || loading) {
    return (

      <main className="min-h-screen py-12 container-page space-y-6">
        <Skeleton className="h-10 w-48" />
        {[1, 2].map(i => (
          <div key={i} className="card-surface p-6 space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        ))}

      </main>
    );
  }


  if (!user) return null;

  return (
    <main className="min-h-screen py-8">
      <div className="container-page space-y-6">

        {/* Breadcrumb + header */}
        <nav className="flex items-center gap-2 text-sm text-[rgb(var(--muted))]">
          <Link href="/" className="hover:text-[rgb(var(--text))] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[rgb(var(--text))] font-medium">My Orders</span>
        </nav>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black">My Orders</h1>
            <p className="text-[rgb(var(--muted))] text-sm mt-1">
              {orders.length} order{orders.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <Link href="/">
            <Button intent="outline" size="sm">Continue Shopping</Button>

          </Link>
        </div>

        {orders.length === 0 ? (

          <div className="card-surface text-center py-24 max-w-md mx-auto space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-[rgb(var(--elevated))] flex items-center justify-center mx-auto">
              <ClipboardList className="w-10 h-10 text-[rgb(var(--muted))]/40" />
            </div>
            <h3 className="text-xl font-bold">No orders yet</h3>
            <p className="text-[rgb(var(--muted))] text-sm">Start shopping to see your orders here</p>
            <Link href="/">
              <Button intent="primary">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order, index) => (
              <div
                key={order.id}
                className="card-surface overflow-hidden motion-safe:animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Order header */}
                <div className="px-6 py-4 border-b border-[rgb(var(--border))] bg-[rgb(var(--elevated))]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Package className="w-5 h-5 text-[rgb(var(--primary))]" />
                    <span className="font-mono font-bold text-sm">#{order.id.slice(0, 8).toUpperCase()}</span>
                    <Badge variant={STATUS_BADGE[order.status]}>{order.status.toUpperCase()}</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[rgb(var(--muted))]">
                      {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {' '}at {new Date(order.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <button
                      onClick={() => printInvoice(order)}
                      className="flex items-center gap-1.5 text-xs text-[rgb(var(--primary))] hover:underline"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Invoice
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Status timeline */}
                  <div className="overflow-x-auto pb-1">
                    <StatusTimeline status={order.status} />
                  </div>

                  {/* Info grid */}
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-0.5">
                      <p className="text-xs text-[rgb(var(--muted))] uppercase tracking-wide font-medium">Customer</p>
                      <p className="font-semibold text-sm">{order.customer_name || '—'}</p>
                      <p className="text-xs text-[rgb(var(--muted))]">{order.customer_phone || ''}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs text-[rgb(var(--muted))] uppercase tracking-wide font-medium">Delivery Address</p>
                      <p className="text-sm font-medium whitespace-pre-wrap">{order.delivery_address || '—'}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs text-[rgb(var(--muted))] uppercase tracking-wide font-medium">Payment</p>
                      <p className="text-sm font-semibold">
                        {order.upi_transaction_id === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                      </p>
                      <p className="text-2xl font-black text-[rgb(var(--primary))]">
                        ₹{order.total_amount.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <p className="text-xs text-[rgb(var(--muted))] uppercase tracking-wide font-medium mb-3">Items Ordered</p>
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-[rgb(var(--elevated))] rounded-xl border border-[rgb(var(--border))]">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[rgb(var(--primary))]/10 flex items-center justify-center">
                              <ShoppingBag className="w-4 h-4 text-[rgb(var(--primary))]" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{item.product_name}</p>
                              <p className="text-xs text-[rgb(var(--muted))]">

                                {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                              </p>
                            </div>
                          </div>

                          <span className="font-bold text-sm">

                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

            ))}
          </div>
        )}
      </div>
    </main>
  );
}
