'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ui/Toast';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  User, Mail, Phone, ShoppingBag, LogOut,
  ChevronRight, Edit3, Check, X, Package
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [form, setForm] = useState({ full_name: '', phone: '' });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (profile) {
      setForm({ full_name: profile.full_name || '', phone: profile.phone || '' });
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .then(({ count }) => setOrderCount(count ?? 0));
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from('user_profiles')
      .update({ full_name: form.full_name.trim(), phone: form.phone.trim() })
      .eq('id', user.id);
    setSaving(false);
    if (error) {
      showToast('Failed to save changes', 'error');
    } else {
      showToast('Profile updated!', 'success');
      setEditing(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    showToast('Signed out successfully', 'info');
  };

  if (authLoading) {
    return (
      <main className="min-h-screen py-12 container-page max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="card-surface p-6 space-y-4">
          <Skeleton className="h-20 w-20 rounded-full mx-auto" />
          <Skeleton className="h-6 w-40 mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </main>
    );
  }

  if (!user) return null;

  const initials = (profile?.full_name || user.email || 'U')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const roleColor: Record<string, string> = {
    admin: 'bg-[rgb(var(--danger))]/10 text-[rgb(var(--danger))]',
    retailer: 'bg-[rgb(var(--primary))]/10 text-[rgb(var(--primary))]',
    dealer: 'bg-[rgb(var(--secondary))]/10 text-[rgb(var(--secondary))]',
  };

  return (
    <main className="min-h-screen py-12">
      <div className="container-page max-w-2xl mx-auto space-y-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[rgb(var(--muted))]">
          <Link href="/" className="hover:text-[rgb(var(--text))] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[rgb(var(--text))] font-medium">My Profile</span>
        </nav>

        <h1 className="text-3xl font-black">My Account</h1>

        {/* Profile card */}
        <div className="card-surface p-6 space-y-6">
          {/* Avatar + name */}
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--accent))] flex items-center justify-center text-2xl font-black text-white shadow-[0_8px_24px_rgb(var(--primary)/0.3)]">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold truncate">{profile?.full_name || 'Welcome!'}</h2>
              <p className="text-sm text-[rgb(var(--muted))] truncate">{user.email}</p>
              {profile?.user_role && (
                <span className={cn('inline-block mt-1.5 text-xs font-bold px-3 py-1 rounded-full', roleColor[profile.user_role] || 'bg-[rgb(var(--elevated))] text-[rgb(var(--muted))]')}>
                  {profile.user_role.toUpperCase()}
                </span>
              )}
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="p-2.5 rounded-xl border border-[rgb(var(--border))] hover:bg-[rgb(var(--elevated))] transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Fields */}
          {editing ? (
            <div className="space-y-4 border-t border-[rgb(var(--border))] pt-5">
              <div className="space-y-1.5">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={form.full_name}
                  onChange={(e) => setForm(f => ({ ...f, full_name: e.target.value }))}
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <Button intent="primary" onClick={handleSave} disabled={saving} className="flex-1">
                  {saving ? 'Saving...' : <><Check className="w-4 h-4" /> Save Changes</>}
                </Button>
                <Button intent="outline" onClick={() => setEditing(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4 border-t border-[rgb(var(--border))] pt-5">
              {[
                { icon: User, label: 'Full Name', value: profile?.full_name || '—' },
                { icon: Mail, label: 'Email', value: user.email || '—' },
                { icon: Phone, label: 'Phone', value: profile?.phone || '—' },
                { icon: ShoppingBag, label: 'Account Type', value: profile?.user_role?.toUpperCase() || '—' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-[rgb(var(--elevated))]">
                  <div className="w-8 h-8 rounded-lg bg-[rgb(var(--primary))]/15 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[rgb(var(--primary))]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[rgb(var(--muted))] font-medium">{label}</p>
                    <p className="text-sm font-semibold truncate">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card-surface p-5 text-center space-y-2">
            <Package className="w-6 h-6 mx-auto text-[rgb(var(--primary))]" />
            <div className="text-3xl font-black">
              {orderCount === null ? '—' : orderCount}
            </div>
            <p className="text-xs text-[rgb(var(--muted))]">Total Orders</p>
          </div>
          <div className="card-surface p-5 text-center space-y-2">
            <ShoppingBag className="w-6 h-6 mx-auto text-[rgb(var(--secondary))]" />
            <div className="text-3xl font-black capitalize">{profile?.user_role || '—'}</div>
            <p className="text-xs text-[rgb(var(--muted))]">Account Type</p>
          </div>
        </div>

        {/* Quick links */}
        <div className="card-surface overflow-hidden divide-y divide-[rgb(var(--border))]">
          {[
            { label: 'My Orders', desc: 'View your order history', href: '/orders', icon: Package },
            { label: 'Continue Shopping', desc: 'Browse all products', href: '/', icon: ShoppingBag },
          ].map(({ label, desc, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-4 px-6 py-4 hover:bg-[rgb(var(--elevated))] transition-colors group"
            >
              <div className="w-9 h-9 rounded-xl bg-[rgb(var(--primary))]/10 flex items-center justify-center">
                <Icon className="w-4 h-4 text-[rgb(var(--primary))]" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{label}</p>
                <p className="text-xs text-[rgb(var(--muted))]">{desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[rgb(var(--muted))] group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>

        {/* Sign out */}
        <div className="card-surface overflow-hidden">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-4 px-6 py-4 text-[rgb(var(--danger))] hover:bg-[rgb(var(--danger))]/5 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-[rgb(var(--danger))]/10 flex items-center justify-center">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="font-semibold text-sm">Sign Out</span>
          </button>
        </div>

        <p className="text-center text-xs text-[rgb(var(--muted))]">
          Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' }) : '—'}
        </p>
      </div>
    </main>
  );
}
