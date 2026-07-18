'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
<<<<<<< HEAD
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
=======
import { useToast } from '@/components/ui/Toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
>>>>>>> d4b4a93 (update code)
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Loader2, Lock } from 'lucide-react';

// --- Types for Razorpay ---

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayErrorResponse {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: Record<string, unknown>;
  };
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => void;
  prefill: {
    name: string;
    contact: string;
    email: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (response: RazorpayErrorResponse) => void) => void;
}

// Update Global Window Declaration
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export default function CheckoutPage() {
  const { cart, getTotalAmount, customerType, clearCart } = useStore();
  const { user, profile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
<<<<<<< HEAD
  });

=======
    address: '',
  });

  const { showToast } = useToast();
>>>>>>> d4b4a93 (update code)
  const total = getTotalAmount();

  // FIX: Handle empty cart redirection inside useEffect
  useEffect(() => {
    if (cart.length === 0) {
      router.push('/cart');
    }
  }, [cart, router]);

  // Sync profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.full_name || '',
        phone: profile.phone || '',
<<<<<<< HEAD
=======
        address: '',
>>>>>>> d4b4a93 (update code)
      });
    }
  }, [profile]);

  // Load Razorpay script
  useEffect(() => {
    // Check if script already exists
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      setRazorpayLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      setRazorpayLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      setRazorpayLoaded(false);
    };
    document.body.appendChild(script);

    return () => {
      // Safely remove script if it exists
      const scriptElement = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (scriptElement && scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement);
      }
    };
  }, []);

  // Calculate delivery time
  const getDeliveryTime = () => {
    const now = new Date();
    const hour = now.getHours();
    
    // If order is placed before 12 PM (morning), delivery in evening (6 PM)
    // If order is placed after 12 PM, delivery next day evening
    if (hour < 12) {
      return 'evening today';
    } else {
      return 'late evening today';
    }
  };

  // Handle Razorpay payment
  const handleRazorpayPayment = async () => {
    if (!razorpayLoaded || !window.Razorpay) {
<<<<<<< HEAD
      alert('Payment gateway is loading. Please wait a moment and try again.');
      return;
    }

    if (!formData.name.trim() || !formData.phone.trim()) {
      setError('Please fill in your name and phone number first');
=======
      showToast('Payment gateway is loading. Please wait and try again.', 'warning');
      return;
    }

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setError('Please fill in your name, phone, and delivery address first');
>>>>>>> d4b4a93 (update code)
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create Razorpay order
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total,
          currency: 'INR',
          receipt: `receipt_${Date.now()}_${user?.id}`,
        }),
      });

      const orderData = await response.json();

      if (!response.ok) {
        throw new Error(orderData.error || 'Failed to create payment order');
      }

      // Razorpay options
      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Raghuvir Enterprises',
        description: 'Order Payment',
        order_id: orderData.id,
        // Type fixed here: response is explicitly typed
        handler: async function (response: RazorpaySuccessResponse) {
          // Verify payment
          const verifyResponse = await fetch('/api/razorpay/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.verified) {
            // Create order in database
            await createOrder(verifyData.payment_id);
          } else {
<<<<<<< HEAD
            alert('Payment verification failed. Please contact support.');
=======
            showToast('Payment verification failed. Please contact support.', 'error');
>>>>>>> d4b4a93 (update code)
            setLoading(false);
          }
        },
        prefill: {
          name: formData.name,
          contact: formData.phone,
          email: user?.email || '',
        },
        theme: {
          color: '#6366f1',
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      
      // Type fixed here: response is explicitly typed
      razorpay.on('payment.failed', function (response: RazorpayErrorResponse) {
        console.error('Payment failed:', response.error);
<<<<<<< HEAD
        alert(`Payment failed: ${response.error.description || 'Unknown error'}`);
=======
        showToast(`Payment failed: ${response.error.description || 'Unknown error'}`, 'error');
>>>>>>> d4b4a93 (update code)
        setLoading(false);
      });

      razorpay.open();
    } catch (error) {
      console.error('Razorpay error:', error);
      setError(error instanceof Error ? error.message : 'Payment initialization failed');
      setLoading(false);
    }
  };

  // Create order after successful payment
  const createOrder = async (paymentId: string) => {
    try {
      if (!user) {
<<<<<<< HEAD
        alert('Session expired. Please login again.');
=======
        showToast('Session expired. Please login again.', 'error');
>>>>>>> d4b4a93 (update code)
        router.push('/login');
        setLoading(false);
        return;
      }

      const deliveryTime = getDeliveryTime();

<<<<<<< HEAD
      const { error } = await supabase
=======
      const { data, error } = await supabase
>>>>>>> d4b4a93 (update code)
        .from('orders')
        .insert([
          {
            user_id: user.id,
            customer_name: formData.name,
            customer_phone: formData.phone,
            customer_type: customerType,
<<<<<<< HEAD
=======
            delivery_address: formData.address,
>>>>>>> d4b4a93 (update code)
            items: cart,
            total_amount: total,
            upi_transaction_id: paymentId,
            status: 'pending',
          },
        ])
        .select();

      if (error) throw error;

<<<<<<< HEAD
      clearCart();

      const successMessage = `Order Confirmed!\n\nYour order has been placed successfully.\n\nPayment Method: Razorpay Payment\n Payment ID: ${paymentId}\n Delivery: ${deliveryTime}\n\nThank you for your order!`;

      alert(successMessage);
      router.push('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Order creation failed. Please contact support with your payment ID.');
=======
      // Trigger WhatsApp notification asynchronously
      if (data && data[0]) {
        void fetch('/api/order-notify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderId: data[0].id }),
        }).catch((err) => console.error('Error triggering WhatsApp notification:', err));
      }

      clearCart();

      showToast(`Order confirmed! Delivery: ${deliveryTime}. Payment ID: ${paymentId}`, 'success');
      router.push('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      showToast('Order creation failed. Please contact support with your payment ID.', 'error');
>>>>>>> d4b4a93 (update code)
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('Please login to place an order');
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

<<<<<<< HEAD
    if (!formData.name.trim() || !formData.phone.trim()) {
      setError('Please fill in your name and phone number');
=======
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setError('Please fill in your name, phone, and delivery address');
>>>>>>> d4b4a93 (update code)
      return;
    }

    // Handle COD
    if (paymentMethod === 'cod') {
      setLoading(true);
      try {
        const deliveryTime = getDeliveryTime();

<<<<<<< HEAD
        const { error } = await supabase
=======
        const { data, error } = await supabase
>>>>>>> d4b4a93 (update code)
          .from('orders')
          .insert([
            {
              user_id: user.id,
              customer_name: formData.name,
              customer_phone: formData.phone,
              customer_type: customerType,
<<<<<<< HEAD
=======
              delivery_address: formData.address,
>>>>>>> d4b4a93 (update code)
              items: cart,
              total_amount: total,
              upi_transaction_id: 'COD',
              status: 'pending',
            },
          ])
          .select();

        if (error) throw error;

<<<<<<< HEAD
        clearCart();

        const successMessage = ` Order Confirmed!\n\nYour order has been placed successfully.\n\n Payment Method: Cash on Delivery\n Delivery: ${deliveryTime}\n\nThank you for your order!`;

        alert(successMessage);
=======
        // Trigger WhatsApp notification asynchronously
        if (data && data[0]) {
          void fetch('/api/order-notify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderId: data[0].id }),
          }).catch((err) => console.error('Error triggering WhatsApp notification:', err));
        }

        clearCart();

        showToast(`Order confirmed! COD payment. Delivery: ${deliveryTime}`, 'success');
>>>>>>> d4b4a93 (update code)
        router.push('/orders');
      } catch (error) {
        console.error('Error placing order:', error);
        setError('Error placing order. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      // Handle Razorpay payment
      await handleRazorpayPayment();
    }
  };

  // Prevent rendering if cart is empty (redirection is handled in useEffect)
  if (cart.length === 0) {
    return null;
  }

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center py-16">
        <div className="container-page">
          <div className="w-full max-w-md mx-auto motion-safe:animate-fade-in">
            <Card className="text-center">
              <CardHeader>
                <Lock className="w-16 h-16 mx-auto mb-4 text-[rgb(var(--muted))]" />
                <CardTitle>Login Required</CardTitle>
                <CardDescription>You need to log in to place an order.</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/login">
                  <Button intent="primary" fullWidth>
                    Go to Login
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-16">
      <div className="container-page">
<<<<<<< HEAD
        <div className="mb-8 motion-safe:animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">Checkout</h1>
=======
        <div className="mb-8 motion-safe:animate-fade-in space-y-3">
          <nav className="flex items-center gap-2 text-sm text-[rgb(var(--muted))]">
            <Link href="/">Home</Link>
            <span>›</span>
            <Link href="/cart">Cart</Link>
            <span>›</span>
            <span className="text-[rgb(var(--text))] font-medium">Checkout</span>
          </nav>
          <h1 className="text-4xl font-bold">Checkout</h1>
>>>>>>> d4b4a93 (update code)
          <p className="text-[rgb(var(--muted))]">Complete your order securely</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.product_id}
                    className="flex justify-between items-center pb-4 border-b border-[rgb(var(--border))] last:border-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-sm text-[rgb(var(--muted))]">
                        {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <span className="font-bold text-lg">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center text-xl font-bold pt-4 border-t border-[rgb(var(--border))]">
                  <span>Total</span>
                  <span className="text-2xl text-[rgb(var(--primary))]">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle> Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Payment Method Selection */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer p-3 border-2 rounded-lg hover:bg-[rgb(var(--elevated))] transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'razorpay' | 'cod')}
                      className="w-5 h-5"
                    />
                    <div className="flex-1">
                      <span className="font-semibold">Online Payment (Razorpay)</span>
                      <p className="text-xs text-[rgb(var(--muted))]">Pay via UPI, Cards, Net Banking, Wallets</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer p-3 border-2 rounded-lg hover:bg-[rgb(var(--elevated))] transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'razorpay' | 'cod')}
                      className="w-5 h-5"
                    />
                    <div className="flex-1">
                      <span className="font-semibold">Cash on Delivery (COD)</span>
                      <p className="text-xs text-[rgb(var(--muted))]">Pay when you receive your order</p>
                    </div>
                  </label>
                </div>

                {/* Razorpay Payment Info */}
                {paymentMethod === 'razorpay' && (
                  <div className="pt-4 border-t border-[rgb(var(--border))]">
                    <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-4">
                      <p className="text-sm font-semibold text-blue-800 mb-2">
                         Secure Online Payment
                      </p>
                      <p className="text-xs text-blue-700 mb-3">
                        Pay ₹{total.toLocaleString('en-IN')} securely using Razorpay
                      </p>
                      <div className="space-y-2 text-xs text-blue-700">
                        <p> Supports UPI, Credit/Debit Cards, Net Banking</p>
                        <p> All major wallets (Paytm, PhonePe, etc.)</p>
                        <p> 100% Secure & PCI DSS Compliant</p>
                      </div>
                      <p className="text-xs text-blue-600 mt-3 font-semibold">
                        Click Place Order to proceed with payment
                      </p>
                    </div>
                  </div>
                )}

                {/* COD Info */}
                {paymentMethod === 'cod' && (
                  <div className="pt-4 border-t border-[rgb(var(--border))]">
                    <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
                      <p className="text-sm font-semibold text-green-800 mb-2">
                         Cash on Delivery
                      </p>
                      <p className="text-xs text-green-700">
                        Pay ₹{total.toLocaleString('en-IN')} in cash when you receive your order.
                        No payment needed now!
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Your Details</CardTitle>
                <CardDescription>Please fill in your information to complete the order</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <Alert variant="destructive" role="alert">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Your phone number"
                    />
                  </div>

<<<<<<< HEAD
=======
                  <div className="space-y-2">
                    <Label htmlFor="address">Delivery Address *</Label>
                    <Textarea
                      id="address"
                      required
                      rows={3}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Your complete delivery address (where we should deliver the product)"
                    />
                  </div>

>>>>>>> d4b4a93 (update code)

                  <div className="p-4 bg-[rgb(var(--elevated))] rounded-xl border border-[rgb(var(--border))]">
                    <div className="text-sm text-[rgb(var(--muted))]">
                      Customer Type:{' '}
                      <Badge variant="secondary" className="ml-2">
                        {customerType.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    intent="primary"
                    size="lg"
                    fullWidth
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Placing Order...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}