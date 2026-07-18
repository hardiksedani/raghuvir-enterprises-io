import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseServer, type Order } from '@/lib/supabase';

// Supabase uses UUID v4 format
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId } = body;

    if (typeof orderId !== 'string' || !UUID_REGEX.test(orderId)) {
      return NextResponse.json({ error: 'Invalid or missing orderId' }, { status: 400 });
    }

    const phone = process.env.UNCLE_WHATSAPP_PHONE;
    const apiKey = process.env.CALLMEBOT_API_KEY;

    if (!phone || !apiKey) {
      console.warn('⚠️ WhatsApp notifications are not fully configured. Please set UNCLE_WHATSAPP_PHONE and CALLMEBOT_API_KEY in your environment variables.');
      return NextResponse.json({ 
        success: false, 
        message: 'Notification skipped. Environment variables UNCLE_WHATSAPP_PHONE or CALLMEBOT_API_KEY not configured.' 
      }, { status: 200 });
    }

    // Initialize Supabase Server client using cookies to inherit current user's session
    const cookieStore = await cookies();
    const supabase = supabaseServer({
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
    });

    // Fetch order details
    const { data: orderData, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error || !orderData) {
      console.error('Error fetching order for WhatsApp notify:', error);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = orderData as Order;

    // Format item list
    const itemsList = order.items
      .map(
        (item) =>
          `• ${item.quantity}x ${item.product_name} (₹${item.price.toLocaleString('en-IN')} each)`
      )
      .join('\n');

    // Format the payment method
    const paymentMethodText = 
      order.upi_transaction_id === 'COD' 
        ? 'Cash on Delivery (COD)' 
        : `Online Paid (ID: ${order.upi_transaction_id})`;

    // Format the final WhatsApp message
    const message = `🔔 *New Order Received!*
----------------------
👤 *Name*: ${order.customer_name || 'N/A'}
📱 *Phone*: ${order.customer_phone || 'N/A'}
👥 *Type*: ${order.customer_type ? order.customer_type.toUpperCase() : 'RETAILER'}
💳 *Payment*: ${paymentMethodText}

📦 *Items Ordered*:
${itemsList}

💰 *Total Amount*: ₹${order.total_amount.toLocaleString('en-IN')}

📍 *Delivery Address*:
${order.delivery_address || 'No Address Provided'}
----------------------
🔗 View in Admin Dashboard: ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin`;

    // Trigger CallMeBot API call
    const callMeBotUrl = new URL('https://api.callmebot.com/whatsapp.php');
    callMeBotUrl.searchParams.append('phone', phone);
    callMeBotUrl.searchParams.append('text', message);
    callMeBotUrl.searchParams.append('apikey', apiKey);

    const response = await fetch(callMeBotUrl.toString(), { method: 'GET' });

    if (!response.ok) {
      const responseText = await response.text();
      console.error('CallMeBot notification failed:', responseText);
      return NextResponse.json({
        success: false,
        error: 'Failed to send WhatsApp notification',
      }, { status: 502 });
    }

    return NextResponse.json({ success: true, message: 'WhatsApp notification sent!' }, { status: 200 });
  } catch (error: unknown) {
    console.error('WhatsApp notification error:', error);
    return NextResponse.json({ error: 'Server error sending notification' }, { status: 500 });
  }
}
