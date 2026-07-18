
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

