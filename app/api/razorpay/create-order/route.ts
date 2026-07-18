<<<<<<< HEAD
import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'INR', receipt } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Convert to paise (multiply by 100)
      currency: currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1, // Auto capture payment
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    });
  } catch (error: unknown) {
    console.error('Razorpay order creation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to create order', details: errorMessage },
      { status: 500 }
    );
  }
}

=======
import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { cookies } from 'next/headers';
import { supabaseServer } from '@/lib/supabase';

const MIN_AMOUNT = 1;        // ₹1
const MAX_AMOUNT = 1_000_000; // ₹10 lakh

function createRazorpayInstance(): Razorpay {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials not configured');
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

export async function POST(req: NextRequest) {
  try {
    // ── Auth guard ────────────────────────────────────────────────────────────
    const cookieStore = await cookies();
    const supabase = supabaseServer({
      get: (name: string) => cookieStore.get(name)?.value,
    });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── Parse + validate body ─────────────────────────────────────────────────
    const body = await req.json();
    const { amount } = body;

    if (
      typeof amount !== 'number' ||
      !Number.isFinite(amount) ||
      amount < MIN_AMOUNT ||
      amount > MAX_AMOUNT
    ) {
      return NextResponse.json(
        { error: `Amount must be a number between ₹${MIN_AMOUNT} and ₹${MAX_AMOUNT}` },
        { status: 400 }
      );
    }

    // ── Create Razorpay order ─────────────────────────────────────────────────
    const razorpay = createRazorpayInstance();
    const receipt = `rcpt_${Date.now()}`;

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: 'INR',
      receipt,
      payment_capture: true,
    });

    return NextResponse.json(
      { id: order.id, amount: order.amount, currency: order.currency },
      { status: 200 }
    );
  } catch {
    // Do not leak internal error messages to the client
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
  }
}
>>>>>>> d4b4a93 (update code)
