'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
<<<<<<< HEAD
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Loader2, Lock } from 'lucide-react';
=======
import { Loader2, Eye, EyeOff, ShieldCheck, Truck, Star, Mail, Lock, Package } from 'lucide-react';
import { Logo } from '@/components/Logo';

const FEATURES = [
  { icon: Package, text: 'Access 100+ premium wholesale products' },
  { icon: Truck, text: 'Same-day dispatch on orders before 12 PM' },
  { icon: ShieldCheck, text: 'Secure Razorpay & COD payments' },
  { icon: Star, text: 'Exclusive retailer & dealer pricing' },
];
>>>>>>> d4b4a93 (update code)

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
<<<<<<< HEAD
=======
  const [showPassword, setShowPassword] = useState(false);
>>>>>>> d4b4a93 (update code)
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
<<<<<<< HEAD
    if (user) {
      router.push('/');
    }
=======
    if (user) router.push('/');
>>>>>>> d4b4a93 (update code)
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
<<<<<<< HEAD

    const { error } = await signIn(email, password);

    if (error) {
      // Provide helpful error messages
      let errorMessage = error.message;
      
      if (error.message.includes('Email not confirmed') || error.message.includes('email_not_confirmed')) {
        errorMessage = 'Please check your email and click the confirmation link before logging in.\n\nIf you didn\'t receive the email, check your spam folder or request a new confirmation email.';
      } else if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      }
      
      setError(errorMessage);
=======
    const { error } = await signIn(email, password);
    if (error) {
      let msg = error.message;
      if (msg.includes('Email not confirmed') || msg.includes('email_not_confirmed')) {
        msg = 'Please check your email and click the confirmation link before logging in.';
      } else if (msg.includes('Invalid login credentials')) {
        msg = 'Invalid email or password. Please try again.';
      }
      setError(msg);
>>>>>>> d4b4a93 (update code)
      setLoading(false);
    } else {
      router.push('/');
    }
  };

  return (
<<<<<<< HEAD
    <main className="min-h-screen flex items-center justify-center py-12">
      <div className="container-page">
        <div className="w-full max-w-md mx-auto motion-safe:animate-fade-in">
          <Card className="border-2 border-[rgb(var(--primary))]/20">
            <CardHeader className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-r from-[rgb(var(--primary))] to-[rgb(var(--accent))] mx-auto">
                <Lock className="w-8 h-8 text-[rgb(var(--bg))]" />
              </div>
              <CardTitle className="text-3xl">Welcome Back</CardTitle>
              <CardDescription>Sign in to your account to continue</CardDescription>
            </CardHeader>

            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6" role="alert">
                  <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />
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
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-[rgb(var(--muted))]">
                  Don&apos;t have an account?{' '}
                  <Link href="/signup" className="link-silent font-semibold">
                    Sign up for free
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
=======
    <main className="min-h-screen flex">
      {/* ── Left brand panel ───────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[45%] xl:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{
          background:
            'linear-gradient(135deg, rgb(var(--primary)) 0%, rgb(99,102,241) 60%, rgb(var(--accent)) 100%)',
        }}
      >
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/8 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-white/8 pointer-events-none" />
        <div className="absolute top-1/2 right-16 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />

        {/* Logo */}
        <div className="relative">
          <Logo size="md" white />
        </div>

        {/* Hero */}
        <div className="relative space-y-10">
          <div>
            <h1 className="text-5xl font-black text-white leading-tight tracking-tight">
              Your Trusted<br />Wholesale<br />Partner
            </h1>
            <p className="text-white/65 mt-4 text-base leading-relaxed max-w-sm">
              Premium products at unbeatable prices — crafted for retailers and dealers who demand the best.
            </p>
          </div>

          <div className="space-y-3.5">
            {FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/85 text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-white/35 text-xs">
          © {new Date().getFullYear()} Raghuvir Enterprises ·Akola, Maharashtra, India
        </div>
      </div>

      {/* ── Right form panel ───────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-[rgb(var(--bg))]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-10">
            <Logo size="sm" />
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black text-[rgb(var(--text))]">Welcome back</h2>
            <p className="text-[rgb(var(--muted))] mt-1.5 text-sm">Sign in to access your account and orders</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[rgb(var(--text))]" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--muted))] pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] text-[rgb(var(--text))] text-sm placeholder:text-[rgb(var(--muted))] outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/30 focus:border-[rgb(var(--primary))] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[rgb(var(--text))]" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--muted))] pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] text-[rgb(var(--text))] text-sm placeholder:text-[rgb(var(--muted))] outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/30 focus:border-[rgb(var(--primary))] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))] hover:text-[rgb(var(--text))] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[rgb(var(--primary))] text-white font-bold text-sm shadow-[0_8px_24px_rgb(var(--primary)/0.35)] hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In to Your Account'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[rgb(var(--border))] text-center">
            <p className="text-sm text-[rgb(var(--muted))]">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-[rgb(var(--primary))] font-semibold hover:underline underline-offset-2">
                Create account free
              </Link>
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-5 text-xs text-[rgb(var(--muted))]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
              Secure Login
            </div>
            <span className="text-[rgb(var(--border))]">·</span>
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              256-bit Encrypted
            </div>
          </div>
>>>>>>> d4b4a93 (update code)
        </div>
      </div>
    </main>
  );
}
