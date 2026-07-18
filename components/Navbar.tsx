'use client';

import Link from 'next/link';

import { useEffect, useState, useRef } from 'react';
import { ShoppingCart, LogOut, Search, Menu, X, Heart, User, Package } from 'lucide-react';
import { LogoBadge } from '@/components/Logo';

import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const { cart, customerType, setCustomerType, wishlist } = useStore();

  const { user, profile, signOut } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [fetchedRole, setFetchedRole] = useState<string | null>(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const role = profile?.user_role ?? fetchedRole;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;


  useEffect(() => {
    if (profile?.user_role && profile.user_role !== 'admin') {
      setCustomerType(profile.user_role as 'retailer' | 'dealer');
    }
  }, [profile?.user_role, setCustomerType]);



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


  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/?q=${encodeURIComponent(searchQuery.trim())}`;
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav
        className={cn(
          'sticky top-0 z-50 w-full border-b border-[rgb(var(--border))] transition-all duration-300',
          scrolled
            ? 'bg-[rgb(var(--surface))]/95 backdrop-blur-md shadow-lg'
            : 'bg-[rgb(var(--surface))]'
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center hover:opacity-80 transition-opacity shrink-0"
              style={{ gap: 9 }}
            >
              <LogoBadge size={32} />
              <div className="hidden sm:block">
                <div style={{ fontSize: 13, fontWeight: 900, lineHeight: 1.15, letterSpacing: '0.06em', color: 'rgb(var(--text))' }}>
                  RAGHUVIR
                </div>
                <div className="hidden lg:block" style={{ fontSize: 7.5, fontWeight: 600, letterSpacing: '0.22em', color: 'rgb(var(--primary))', marginTop: 1 }}>
                  ENTERPRISES
                </div>
              </div>
            </Link>

            {/* Desktop Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex flex-1 max-w-md items-center gap-2 px-3 py-2 rounded-xl bg-[rgb(var(--elevated))] border border-[rgb(var(--border))] focus-within:ring-2 focus-within:ring-[rgb(var(--primary))]/40 transition-all"
            >
              <Search className="w-4 h-4 text-[rgb(var(--muted))] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 bg-transparent text-sm text-[rgb(var(--text))] placeholder:text-[rgb(var(--muted))] outline-none"
              />
            </form>

            {/* Right side */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Mobile search toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-[rgb(var(--elevated))] transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-[rgb(var(--muted))]" />
              </button>

              {user ? (
                <>
                  {/* Customer type toggle — desktop only */}
                  {role !== 'admin' && (
                    <div className="hidden sm:flex gap-1 p-1 rounded-xl bg-[rgb(var(--elevated))] border border-[rgb(var(--border))]">
                      <button
                        onClick={() => setCustomerType('retailer')}
                        disabled={role === 'dealer'}
                        className={cn(
                          'px-3 py-1 text-xs font-semibold rounded-lg transition-all',
                          customerType === 'retailer'
                            ? 'bg-[rgb(var(--primary))] text-[rgb(var(--bg))]'
                            : 'text-[rgb(var(--muted))] hover:text-[rgb(var(--text))]'
                        )}
                      >
                        Retailer
                      </button>
                      <button
                        onClick={() => setCustomerType('dealer')}
                        disabled={role === 'retailer'}
                        className={cn(
                          'px-3 py-1 text-xs font-semibold rounded-lg transition-all',
                          customerType === 'dealer'
                            ? 'bg-[rgb(var(--primary))] text-[rgb(var(--bg))]'
                            : 'text-[rgb(var(--muted))] hover:text-[rgb(var(--text))]'
                        )}
                      >
                        Dealer
                      </button>
                    </div>
                  )}

                  {role === 'admin' && (
                    <Link href="/admin" className="hidden sm:block">
                      <Button intent="outline" size="sm">Admin</Button>
                    </Link>
                  )}

                  {/* Wishlist */}
                  <Link href="/?tab=wishlist" className="relative p-2 rounded-xl hover:bg-[rgb(var(--elevated))] transition-colors hidden sm:flex">
                    <Heart className="w-5 h-5 text-[rgb(var(--muted))]" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-[rgb(var(--danger))] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>

                  {/* Cart */}
                  <Link href="/cart" className="relative p-2 rounded-xl hover:bg-[rgb(var(--elevated))] transition-colors">
                    <ShoppingCart className="w-5 h-5 text-[rgb(var(--text))]" />
                    {cartCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-[rgb(var(--primary))] text-[rgb(var(--bg))] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>

                  {/* Profile chip — desktop */}
                  <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[rgb(var(--elevated))] border border-[rgb(var(--border))]">
                    <div className="w-6 h-6 rounded-full bg-[rgb(var(--primary))] flex items-center justify-center text-[rgb(var(--bg))] font-bold text-xs">
                      {profile?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-[rgb(var(--text))] max-w-[100px] truncate">
                      {profile?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
                    </span>
                    {role && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{role.toUpperCase()}</Badge>}
                  </div>

                  {/* Desktop hamburger / mobile menu trigger */}
                  <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="lg:hidden p-2 rounded-xl hover:bg-[rgb(var(--elevated))] transition-colors"
                    aria-label="Menu"
                  >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>

                  {/* Orders — desktop */}
                  <Link href="/orders" className="hidden lg:block">
                    <button className="px-3 py-1.5 rounded-xl text-sm text-[rgb(var(--muted))] hover:text-[rgb(var(--text))] hover:bg-[rgb(var(--elevated))] transition-colors">
                      Orders
                    </button>
                  </Link>

                  {/* Desktop logout */}
                  <button
                    onClick={signOut}
                    className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-[rgb(var(--danger))] hover:bg-[rgb(var(--danger))]/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {/* Guest customer type toggle */}
                  <div className="hidden sm:flex gap-1 p-1 rounded-xl bg-[rgb(var(--elevated))] border border-[rgb(var(--border))]">
                    <button
                      onClick={() => setCustomerType('retailer')}
                      className={cn(
                        'px-3 py-1 text-xs font-semibold rounded-lg transition-all',
                        customerType === 'retailer'
                          ? 'bg-[rgb(var(--primary))] text-[rgb(var(--bg))]'
                          : 'text-[rgb(var(--muted))] hover:text-[rgb(var(--text))]'
                      )}
                    >
                      Retailer
                    </button>
                    <button
                      onClick={() => setCustomerType('dealer')}
                      className={cn(
                        'px-3 py-1 text-xs font-semibold rounded-lg transition-all',
                        customerType === 'dealer'
                          ? 'bg-[rgb(var(--primary))] text-[rgb(var(--bg))]'
                          : 'text-[rgb(var(--muted))] hover:text-[rgb(var(--text))]'
                      )}
                    >
                      Dealer
                    </button>
                  </div>
                  <Link href="/login">
                    <Button intent="outline" size="sm">Login</Button>
                  </Link>
                  <Link href="/signup" className="hidden sm:block">
                    <Button intent="primary" size="sm">Sign Up</Button>
                  </Link>
                  <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="sm:hidden p-2 rounded-xl hover:bg-[rgb(var(--elevated))] transition-colors"
                  >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </>
              )}

              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div className="md:hidden border-t border-[rgb(var(--border))] px-4 py-3 bg-[rgb(var(--surface))]">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[rgb(var(--elevated))] border border-[rgb(var(--border))]">
              <Search className="w-4 h-4 text-[rgb(var(--muted))]" />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 bg-transparent text-sm text-[rgb(var(--text))] placeholder:text-[rgb(var(--muted))] outline-none"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')}>
                  <X className="w-4 h-4 text-[rgb(var(--muted))]" />
                </button>
              )}
            </form>
          </div>
        )}
      </nav>

      {/* Mobile Slide Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-72 bg-[rgb(var(--surface))] border-l border-[rgb(var(--border))] shadow-2xl flex flex-col animate-slide-in-right">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[rgb(var(--border))]">
              <span className="font-bold text-lg">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-xl hover:bg-[rgb(var(--elevated))]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User info */}
            {user && (
              <div className="p-4 border-b border-[rgb(var(--border))] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[rgb(var(--primary))] flex items-center justify-center text-[rgb(var(--bg))] font-bold">
                  {profile?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-sm">{profile?.full_name || user.email}</p>
                  {role && <Badge variant="secondary" className="text-[10px] mt-0.5">{role.toUpperCase()}</Badge>}
                </div>
              </div>
            )}

            {/* Nav links */}
            <div className="flex-1 p-4 space-y-1">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[rgb(var(--elevated))] transition-colors text-sm font-medium"
              >
                Shop
              </Link>
              {user && (
                <>
                  <Link
                    href="/orders"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[rgb(var(--elevated))] transition-colors text-sm font-medium"
                  >
                    <Package className="w-4 h-4 text-[rgb(var(--muted))]" />
                    My Orders
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[rgb(var(--elevated))] transition-colors text-sm font-medium"
                  >
                    <User className="w-4 h-4 text-[rgb(var(--muted))]" />
                    Profile
                  </Link>
                  <Link
                    href="/cart"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[rgb(var(--elevated))] transition-colors text-sm font-medium"
                  >
                    <ShoppingCart className="w-4 h-4 text-[rgb(var(--muted))]" />
                    Cart {cartCount > 0 && <Badge variant="default" className="ml-auto">{cartCount}</Badge>}
                  </Link>
                  {role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[rgb(var(--elevated))] transition-colors text-sm font-medium"
                    >
                      Admin Panel
                    </Link>
                  )}
                  {/* Customer type toggle in mobile menu */}
                  {role !== 'admin' && (
                    <div className="px-3 py-3">
                      <p className="text-xs text-[rgb(var(--muted))] mb-2 font-medium uppercase tracking-wide">Customer Type</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setCustomerType('retailer'); }}
                          disabled={role === 'dealer'}
                          className={cn(
                            'flex-1 py-2 text-xs font-semibold rounded-lg transition-all',
                            customerType === 'retailer'
                              ? 'bg-[rgb(var(--primary))] text-[rgb(var(--bg))]'
                              : 'bg-[rgb(var(--elevated))] text-[rgb(var(--muted))]'
                          )}
                        >
                          Retailer
                        </button>
                        <button
                          onClick={() => { setCustomerType('dealer'); }}
                          disabled={role === 'retailer'}
                          className={cn(
                            'flex-1 py-2 text-xs font-semibold rounded-lg transition-all',
                            customerType === 'dealer'
                              ? 'bg-[rgb(var(--primary))] text-[rgb(var(--bg))]'
                              : 'bg-[rgb(var(--elevated))] text-[rgb(var(--muted))]'
                          )}
                        >
                          Dealer
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
              {!user && (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[rgb(var(--elevated))] transition-colors text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl bg-[rgb(var(--primary))] text-[rgb(var(--bg))] text-sm font-semibold"
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>

            {user && (
              <div className="p-4 border-t border-[rgb(var(--border))]">
                <button
                  onClick={() => { signOut(); setMobileOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[rgb(var(--danger))] hover:bg-[rgb(var(--danger))]/10 transition-colors text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>

  );
}
