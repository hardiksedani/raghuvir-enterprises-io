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
import { Badge } from '@/components/ui/Badge';
import { Loader2, CheckCircle2, UserPlus } from 'lucide-react';
=======
import {
  Loader2, Eye, EyeOff, ShieldCheck, Truck, Star,
  Mail, Lock, User, Phone, CheckCircle2, Store, Tag, Package,
} from 'lucide-react';
import { Logo } from '@/components/Logo';

const FEATURES = [
  { icon: Package, text: 'Access 100+ premium wholesale products' },
  { icon: Truck, text: 'Same-day dispatch on orders before 12 PM' },
  { icon: ShieldCheck, text: 'Secure Razorpay & COD payments' },
  { icon: Star, text: 'Exclusive retailer & dealer pricing' },
];
>>>>>>> d4b4a93 (update code)

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [userRole, setUserRole] = useState<'retailer' | 'dealer'>('retailer');
<<<<<<< HEAD
=======
  const [showPassword, setShowPassword] = useState(false);
>>>>>>> d4b4a93 (update code)
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
<<<<<<< HEAD
    if (user && !success) {
      router.push('/');
    }
=======
    if (user && !success) router.push('/');
>>>>>>> d4b4a93 (update code)
  }, [user, success, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
<<<<<<< HEAD

=======
>>>>>>> d4b4a93 (update code)
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
<<<<<<< HEAD

    const { error } = await signUp(email, password, userRole, fullName, phone);

=======
    const { error } = await signUp(email, password, userRole, fullName, phone);
>>>>>>> d4b4a93 (update code)
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
<<<<<<< HEAD
      <main className="min-h-screen flex items-center justify-center py-12">
        <div className="container-page">
          <div className="w-full max-w-md mx-auto motion-safe:animate-fade-in">
            <Card className="border-2 border-[rgb(var(--success))]/20">
              <CardHeader className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[rgb(var(--success))]/20 mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-[rgb(var(--success))]" />
                </div>
                <CardTitle className="text-3xl">Success!</CardTitle>
                <CardDescription>
                  Your account has been created successfully. Please check your email to verify your account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/login">
                  <Button intent="primary" fullWidth size="lg">
                    Go to Login
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
=======
      <main className="min-h-screen flex items-center justify-center p-6 bg-[rgb(var(--bg))]">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-green-100 border-4 border-green-200 flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-[rgb(var(--text))]">Account Created!</h2>
            <p className="text-[rgb(var(--muted))] mt-2 text-sm leading-relaxed">
              We&apos;ve sent a confirmation email to <strong>{email}</strong>.<br />
              Please verify your email before logging in.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center justify-center w-full py-3.5 rounded-xl bg-[rgb(var(--primary))] text-white font-bold text-sm shadow-[0_8px_24px_rgb(var(--primary)/0.35)] hover:opacity-90 transition-all"
          >
            Go to Login
          </Link>
>>>>>>> d4b4a93 (update code)
        </div>
      </main>
    );
  }

  return (
<<<<<<< HEAD
    <main className="min-h-screen flex items-center justify-center py-12">
      <div className="container-page">
        <div className="w-full max-w-md mx-auto motion-safe:animate-fade-in">
          <Card className="border-2 border-[rgb(var(--primary))]/20">
            <CardHeader className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-r from-[rgb(var(--primary))] to-[rgb(var(--accent))] mx-auto">
                <UserPlus className="w-8 h-8 text-[rgb(var(--bg))]" />
              </div>
              <CardTitle className="text-3xl">Create an Account</CardTitle>
              <CardDescription>Join to access retailer/dealer pricing</CardDescription>
            </CardHeader>

            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6" role="alert">
                  <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    required
                    autoComplete="name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1234567890"
                    required
                    autoComplete="tel"
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
                    autoComplete="new-password"
                  />
                  <p className="text-xs text-[rgb(var(--muted))]">Minimum 6 characters</p>
                </div>

                <div className="space-y-3">
                  <Label>Account Type</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      intent={userRole === 'retailer' ? 'primary' : 'outline'}
                      className="flex-1"
                      onClick={() => setUserRole('retailer')}
                    >
                      Retailer
                    </Button>
                    <Button
                      type="button"
                      intent={userRole === 'dealer' ? 'primary' : 'outline'}
                      className="flex-1"
                      onClick={() => setUserRole('dealer')}
                    >
                      Dealer
                    </Button>
                  </div>
                  <div className="p-3 bg-[rgb(var(--elevated))] rounded-xl border border-[rgb(var(--border))]">
                    <p className="text-sm">
                      {userRole === 'retailer' ? (
                        <>
                          <Badge variant="secondary" className="mr-2">Retailer</Badge>
                          Standard pricing, lower minimum quantities
                        </>
                      ) : (
                        <>
                          <Badge variant="secondary" className="mr-2">Dealer</Badge>
                          Bulk pricing, higher minimum quantities
                        </>
                      )}
                    </p>
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
                      Creating account...
                    </>
                  ) : (
                    'Sign Up'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-[rgb(var(--muted))]">
                  Already have an account?{' '}
                  <Link href="/login" className="link-silent font-semibold">
                    Log in
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

        {/* Logo */}
        <div className="relative">
          <Logo size="md" white />
        </div>

        {/* Hero */}
        <div className="relative space-y-8">
          <div>
            <h1 className="text-5xl font-black text-white leading-tight tracking-tight">
              Join Our<br />Wholesale<br />Network
            </h1>
            <p className="text-white/65 mt-4 text-base leading-relaxed max-w-sm">
              Get access to exclusive retailer and dealer pricing. Sign up in under 2 minutes.
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
          © {new Date().getFullYear()} Raghuvir Enterprises · Akola, Maharashtra, India
        </div>
      </div>

      {/* ── Right form panel ───────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-[rgb(var(--bg))] overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <Logo size="sm" />
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black text-[rgb(var(--text))]">Create account</h2>
            <p className="text-[rgb(var(--muted))] mt-1.5 text-sm">Fill in your details to get started</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account type */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[rgb(var(--text))]">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { role: 'retailer', icon: Store, label: 'Retailer', sub: 'Standard pricing' },
                  { role: 'dealer', icon: Tag, label: 'Dealer', sub: 'Bulk pricing' },
                ] as const).map(({ role, icon: Icon, label, sub }) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setUserRole(role)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      userRole === role
                        ? 'border-[rgb(var(--primary))] bg-[rgb(var(--primary))]/8 text-[rgb(var(--primary))]'
                        : 'border-[rgb(var(--border))] bg-[rgb(var(--surface))] text-[rgb(var(--muted))] hover:border-[rgb(var(--primary))]/40 hover:text-[rgb(var(--text))]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div className="text-center">
                      <div className="font-bold text-sm">{label}</div>
                      <div className="text-xs opacity-70 mt-0.5">{sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Full name */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[rgb(var(--text))]" htmlFor="fullName">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--muted))] pointer-events-none" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  required
                  autoComplete="name"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] text-[rgb(var(--text))] text-sm placeholder:text-[rgb(var(--muted))] outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/30 focus:border-[rgb(var(--primary))] transition-all"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[rgb(var(--text))]" htmlFor="phone">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--muted))] pointer-events-none" />
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  required
                  autoComplete="tel"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] text-[rgb(var(--text))] text-sm placeholder:text-[rgb(var(--muted))] outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/30 focus:border-[rgb(var(--primary))] transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[rgb(var(--text))]" htmlFor="email">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--muted))] pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] text-[rgb(var(--text))] text-sm placeholder:text-[rgb(var(--muted))] outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/30 focus:border-[rgb(var(--primary))] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[rgb(var(--text))]" htmlFor="password">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--muted))] pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                  autoComplete="new-password"
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
              className="w-full py-3.5 rounded-xl bg-[rgb(var(--primary))] text-white font-bold text-sm shadow-[0_8px_24px_rgb(var(--primary)/0.35)] hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[rgb(var(--border))] text-center">
            <p className="text-sm text-[rgb(var(--muted))]">
              Already have an account?{' '}
              <Link href="/login" className="text-[rgb(var(--primary))] font-semibold hover:underline underline-offset-2">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-5 text-xs text-[rgb(var(--muted))]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
              Secure & Private
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
