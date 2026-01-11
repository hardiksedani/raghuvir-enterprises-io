'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Loader2, CheckCircle2, UserPlus } from 'lucide-react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [userRole, setUserRole] = useState<'retailer' | 'dealer'>('retailer');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !success) {
      router.push('/');
    }
  }, [user, success, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const { error } = await signUp(email, password, userRole, fullName, phone);

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
        </div>
      </main>
    );
  }

  return (
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
        </div>
      </div>
    </main>
  );
}
