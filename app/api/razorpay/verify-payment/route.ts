<<<<<<< HEAD
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment details' },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
    
    // Create signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(text)
      .digest('hex');

    // Verify signature
    const isSignatureValid = generatedSignature === razorpay_signature;

    if (!isSignatureValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature', verified: false },
        { status: 400 }
      );
    }

    return NextResponse.json({
      verified: true,
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
    });
  } catch (error: unknown) {
    console.error('Payment verification error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Payment verification failed', details: errorMessage, verified: false },
      { status: 500 }
    );
  }
}

=======
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { supabaseServer } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // ── Auth guard ────────────────────────────────────────────────────────────
    const cookieStore = await cookies();
    const supabase = supabaseServer({
      get: (name: string) => cookieStore.get(name)?.value,
    });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized', verified: false }, { status: 401 });
    }

    // ── Parse + validate body ─────────────────────────────────────────────────
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (
      typeof razorpay_order_id !== 'string' || !razorpay_order_id.trim() ||
      typeof razorpay_payment_id !== 'string' || !razorpay_payment_id.trim() ||
      typeof razorpay_signature !== 'string' || !razorpay_signature.trim()
    ) {
      return NextResponse.json({ error: 'Missing or invalid payment details', verified: false }, { status: 400 });
    }

    // ── Key must be present ───────────────────────────────────────────────────
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      console.error('RAZORPAY_KEY_SECRET is not configured');
      return NextResponse.json({ error: 'Payment service unavailable', verified: false }, { status: 503 });
    }

    // ── Timing-safe HMAC verification ─────────────────────────────────────────
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(text)
      .digest('hex');

    // Use timingSafeEqual to prevent timing-based signature oracle attacks
    const sigBuf = Buffer.from(generatedSignature, 'hex');
    const incomingBuf = Buffer.from(razorpay_signature, 'hex');

    // Lengths must match before calling timingSafeEqual
    if (
      sigBuf.length !== incomingBuf.length ||
      !crypto.timingSafeEqual(sigBuf, incomingBuf)
    ) {
      return NextResponse.json({ error: 'Invalid payment signature', verified: false }, { status: 400 });
    }

    return NextResponse.json({
      verified: true,
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
    });
  } catch {
    // Do not leak internal error messages to the client
    return NextResponse.json({ error: 'Payment verification failed', verified: false }, { status: 500 });
  }
}
>>>>>>> d4b4a93 (update code)
