'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ShoppingCart, LogOut } from 'lucide-react';

import { useStore } from '@/lib/store';         // your store (customerType, cart, etc.)
import { useAuth } from '@/lib/auth';           // your auth hook (user, profile, signOut)
import { supabase } from '@/lib/supabase';      // browser client
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export default function Navbar() {
  const { cart, customerType, setCustomerType } = useStore();
  const { user, profile, signOut } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [fetchedRole, setFetchedRole] = useState<string | null>(null);
  const role = profile?.user_role ?? fetchedRole;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // keep customer type in sync when profile arrives
  useEffect(() => {
    if (profile?.user_role && profile.user_role !== 'admin') {
      setCustomerType(profile.user_role as 'retailer' | 'dealer');
    }
  }, [profile?.user_role, setCustomerType]);

  // fallback: fetch role by id (matches RLS auth.uid() = id)
  useEffect(() => {
    if (!user || role) return;
    (async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('user_role')
        .eq('id', user.id)
        .single();
      if (!error) setFetchedRole(data?.user_role ?? null);
    })();
  }, [user, role]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b border-[rgb(var(--border))] transition-all duration-300 ${
        scrolled
          ? 'bg-[rgb(var(--surface))]/95 backdrop-blur-md shadow-md'
          : 'bg-[rgb(var(--surface))]'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2 font-bold text-xl text-[rgb(var(--text))] hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary))] rounded-md"
          >
            Raghuvir Enterprises
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <>
                {/* Profile chip */}
                <div className="hidden md:flex items-center gap-3 px-3 py-2 rounded-xl bg-[rgb(var(--elevated))] border border-[rgb(var(--border))]">
                  <div className="w-8 h-8 rounded-full bg-[rgb(var(--primary))] flex items-center justify-center text-[rgb(var(--bg))] font-semibold text-sm">
                    {profile?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-sm font-semibold text-[rgb(var(--text))]">
                      {profile?.full_name || user.email}
                    </p>
                    {role && (
                      <Badge variant="secondary" className="text-xs">
                        {role.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Customer type toggle for non-admins */}
                {role !== 'admin' && (
                  <div className="hidden sm:flex gap-2 p-1 rounded-xl bg-[rgb(var(--elevated))] border border-[rgb(var(--border))]">
                    <Button
                      size="sm"
                      intent={customerType === 'retailer' ? 'primary' : 'ghost'}
                      onClick={() => setCustomerType('retailer')}
                      disabled={role === 'dealer'}
                      className="text-xs"
                    >
                      Retailer
                    </Button>
                    <Button
                      size="sm"
                      intent={customerType === 'dealer' ? 'primary' : 'ghost'}
                      onClick={() => setCustomerType('dealer')}
                      disabled={role === 'retailer'}
                      className="text-xs"
                    >
                      Dealer
                    </Button>
                  </div>
                )}

                {/* Admin link (only when role confirmed) */}
                {role === 'admin' && (
                  <Link href="/admin">
                    <Button intent="outline" size="sm">Admin</Button>
                  </Link>
                )}

                {/* Orders */}
                <Link href="/orders">
                  <Button intent="ghost" size="sm" className="hidden sm:inline-flex">
                    Orders
                  </Button>
                </Link>

                {/* Cart */}
                <Link href="/cart" className="relative">
                  <Button intent="primary" size="sm">
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[rgb(var(--danger))] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* Logout */}
                <Button
                  intent="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-[rgb(var(--danger))] hover:bg-[rgb(var(--danger))]/10"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <>
                {/* Guest customer type toggle */}
                <div className="hidden sm:flex gap-2 p-1 rounded-xl bg-[rgb(var(--elevated))] border border-[rgb(var(--border))]">
                  <Button
                    size="sm"
                    intent={customerType === 'retailer' ? 'primary' : 'ghost'}
                    onClick={() => setCustomerType('retailer')}
                    className="text-xs"
                  >
                    Retailer
                  </Button>
                  <Button
                    size="sm"
                    intent={customerType === 'dealer' ? 'primary' : 'ghost'}
                    onClick={() => setCustomerType('dealer')}
                    className="text-xs"
                  >
                    Dealer
                  </Button>
                </div>

                {/* Auth */}
                <Link href="/login">
                  <Button intent="outline" size="sm">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button intent="primary" size="sm">Sign Up</Button>
                </Link>
              </>
            )}

            {/* Theme */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
