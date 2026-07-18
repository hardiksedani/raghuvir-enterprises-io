'use client';


import { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase, Product } from '@/lib/supabase';
import { useStore } from '@/lib/store';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import {
  Truck, Shield, Star, Search, SlidersHorizontal,
  ChevronRight, Zap, Package, Heart, X, ShoppingCart,
  ShieldCheck, CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type SortKey = 'newest' | 'price-low' | 'price-high' | 'name-az';
type FilterKey = 'all' | 'instock' | 'outstock';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low → High' },
  { value: 'price-high', label: 'Price: High → Low' },
  { value: 'name-az', label: 'Name: A → Z' },
];

const FILTER_CHIPS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All Products' },
  { key: 'instock', label: 'In Stock' },
  { key: 'outstock', label: 'Out of Stock' },
];

function HomeContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const showWishlist = searchParams.get('tab') === 'wishlist';

  const { customerType, wishlist } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialQ);
  const [sort, setSort] = useState<SortKey>('newest');
  const [filter, setFilter] = useState<FilterKey>('all');
  const [showSortPanel, setShowSortPanel] = useState(false);

  useEffect(() => {
    const channel = supabase
      .channel('products_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, fetchProducts)
      .subscribe();
    fetchProducts();
    return () => { supabase.removeChannel(channel); };

  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch {

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };


  const getPrice = (p: Product) =>
    customerType === 'dealer' ? p.dealer_price : p.retailer_price;

  const processed = useMemo(() => {
    let list = [...products];

    // Filter by wishlist tab
    if (showWishlist) return list.filter(p => wishlist.includes(p.id));

    // Filter by stock
    if (filter === 'instock') list = list.filter(p => p.stock > 0);
    if (filter === 'outstock') list = list.filter(p => p.stock === 0);

    // Search
    const q = search.toLowerCase().trim();
    if (q) list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q)
    );

    // Sort
    switch (sort) {
      case 'price-low': list.sort((a, b) => getPrice(a) - getPrice(b)); break;
      case 'price-high': list.sort((a, b) => getPrice(b) - getPrice(a)); break;
      case 'name-az': list.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break;
    }

    // Out-of-stock to end
    list.sort((a, b) => (a.stock === 0 ? 1 : 0) - (b.stock === 0 ? 1 : 0));

    return list;
  }, [products, search, sort, filter, customerType, wishlist, showWishlist]);

  const inStockCount = products.filter(p => p.stock > 0).length;

  return (
    <div className="min-h-screen">

      {/* ─── HERO ─────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 sm:py-28 lg:py-24">
        {/* Background layers */}
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgb(var(--primary)/0.12),transparent)]" />
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'radial-gradient(circle, rgb(var(--text)) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[rgb(var(--primary))]/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[rgb(var(--accent))]/5 blur-3xl pointer-events-none" />

        <div className="relative container-page">
          <div className="grid place-items-center gap-12 lg:gap-8">

            {/* Centered hero content */}
            <div className="text-center space-y-8 max-w-2xl mx-auto">
              {/* Announcement pill — gold style */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 text-sm font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
                Same-day dispatch on orders before 12 PM
              </div>

              {/* Heading */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05]">
                Your Trusted
                <br />
                <span className="gradient-text">Wholesale Partner</span>
              </h1>

              <p className="text-lg sm:text-xl text-[rgb(var(--muted))] leading-relaxed">
                Premium products at unbeatable prices — crafted for retailers and dealers who demand the best.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="#products"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-[rgb(var(--primary))] text-[rgb(var(--bg))] font-bold text-base shadow-[0_8px_24px_rgb(var(--primary)/0.35)] hover:opacity-90 hover:-translate-y-0.5 transition-all"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Shop Now
                </a>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl border border-[rgb(var(--border))] text-[rgb(var(--text))] font-semibold text-base hover:bg-[rgb(var(--elevated))] hover:-translate-y-0.5 transition-all"
                >
                  Create Account
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ─── TRUST STRIP ─────────────────────────── */}
      <div className="border-t border-b border-[rgb(var(--border))] bg-[rgb(var(--surface))]/60">
        <div className="container-page py-3.5">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {[
              { icon: Shield, text: 'Razorpay Secured', cls: 'text-green-400' },
              { icon: Truck, text: 'Same-day Dispatch', cls: 'text-[rgb(var(--primary))]' },
              { icon: ShieldCheck, text: 'Quality Assured', cls: 'text-amber-400' },
              { icon: Package, text: 'Wholesale Pricing', cls: 'text-[rgb(var(--accent))]' },
              { icon: Zap, text: 'COD Available', cls: 'text-purple-400' },
            ].map(({ icon: Icon, text, cls }) => (
              <div key={text} className="flex items-center gap-2 text-xs font-semibold text-[rgb(var(--muted))]">
                <Icon className={cn('w-4 h-4', cls)} />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── PRODUCTS ─────────────────────────────── */}
      <section id="products" className="container-page py-12 space-y-8">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold">
              {showWishlist ? 'My Wishlist' : 'Our Products'}
            </h2>
            {!loading && (
              <p className="text-sm text-[rgb(var(--muted))] mt-1">
                {processed.length} product{processed.length !== 1 ? 's' : ''}
                {!showWishlist && ` · ${inStockCount} in stock`}
              </p>
            )}
          </div>
          {showWishlist && (
            <Link href="/" className="text-sm text-[rgb(var(--primary))] hover:underline flex items-center gap-1">
              ← Back to all products
            </Link>
          )}
        </div>

        {!showWishlist && (
          <div className="space-y-4">
            {/* Search + Sort row */}
            <div className="flex gap-3">
              {/* Search */}
              <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[rgb(var(--elevated))] border border-[rgb(var(--border))] focus-within:ring-2 focus-within:ring-[rgb(var(--primary))]/30 transition-all">
                <Search className="w-4 h-4 text-[rgb(var(--muted))] shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products by name..."
                  className="flex-1 bg-transparent text-sm text-[rgb(var(--text))] placeholder:text-[rgb(var(--muted))] outline-none"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="text-[rgb(var(--muted))] hover:text-[rgb(var(--text))] transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Sort dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSortPanel(!showSortPanel)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-sm font-medium',
                    showSortPanel
                      ? 'bg-[rgb(var(--primary))] text-[rgb(var(--bg))] border-transparent'
                      : 'bg-[rgb(var(--elevated))] border-[rgb(var(--border))] text-[rgb(var(--text))] hover:border-[rgb(var(--primary))]/40'
                  )}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="hidden sm:block">Sort</span>
                </button>
                {showSortPanel && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-xl shadow-2xl z-20 overflow-hidden">
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => { setSort(opt.value); setShowSortPanel(false); }}
                        className={cn(
                          'w-full text-left px-4 py-3 text-sm transition-colors',
                          sort === opt.value
                            ? 'bg-[rgb(var(--primary))]/15 text-[rgb(var(--primary))] font-semibold'
                            : 'text-[rgb(var(--text))] hover:bg-[rgb(var(--elevated))]'
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Filter chips */}
            <div className="flex gap-2 flex-wrap">
              {FILTER_CHIPS.map(chip => (
                <button
                  key={chip.key}
                  onClick={() => setFilter(chip.key)}
                  className={cn(
                    'px-4 py-1.5 rounded-full text-sm font-medium border transition-all',
                    filter === chip.key
                      ? 'bg-[rgb(var(--primary))] text-[rgb(var(--bg))] border-transparent shadow-[0_2px_8px_rgb(var(--primary)/0.3)]'
                      : 'bg-[rgb(var(--elevated))] text-[rgb(var(--muted))] border-[rgb(var(--border))] hover:border-[rgb(var(--primary))]/40 hover:text-[rgb(var(--text))]'
                  )}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Products grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl overflow-hidden">
                <div className="aspect-4/3 shimmer" />
                <div className="p-4 space-y-3">
                  <div className="h-3 shimmer rounded-full w-3/4" />
                  <div className="h-3 shimmer rounded-full w-1/2" />
                  <div className="h-8 shimmer rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : showWishlist && processed.length === 0 ? (
          <div className="text-center py-24">
            <Heart className="w-16 h-16 mx-auto mb-4 text-[rgb(var(--muted))]/40" />
            <h3 className="text-xl font-semibold mb-2">No wishlisted products yet</h3>
            <p className="text-[rgb(var(--muted))] mb-6">Tap the heart icon on any product to save it here</p>
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[rgb(var(--primary))] text-[rgb(var(--bg))] font-semibold hover:opacity-90 transition-opacity">
              Browse Products
            </Link>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 rounded-3xl bg-[rgb(var(--elevated))] flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-[rgb(var(--muted))]/50" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No Products Yet</h3>
            <p className="text-[rgb(var(--muted))] mb-6">Check back soon for exciting products!</p>
            <Link href="/admin" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[rgb(var(--primary))] text-[rgb(var(--bg))] font-semibold hover:opacity-90">
              Go to Admin Panel
            </Link>
          </div>
        ) : processed.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-12 h-12 mx-auto mb-4 text-[rgb(var(--muted))]/40" />
            <h3 className="text-xl font-semibold mb-2">No results found</h3>
            <p className="text-[rgb(var(--muted))] mb-4">Try a different search term or clear the filter</p>
            <button
              onClick={() => { setSearch(''); setFilter('all'); }}
              className="px-5 py-2.5 rounded-xl bg-[rgb(var(--primary))] text-[rgb(var(--bg))] font-semibold hover:opacity-90"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {processed.map((product, i) => (
              <div
                key={product.id}
                className="motion-safe:animate-fade-in"
                style={{ animationDelay: `${Math.min(i * 0.04, 0.4)}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ─── WHY CHOOSE US ────────────────────────── */}
      <section className="py-24 mt-8 bg-[rgb(var(--surface))] border-t border-[rgb(var(--border))]">
        <div className="container-page space-y-14">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgb(var(--primary))]/10 border border-[rgb(var(--primary))]/20 text-[rgb(var(--primary))] text-xs font-bold uppercase tracking-wider">
              Our Promise
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold">Why Choose Raghuvir Enterprises?</h2>
            <p className="text-[rgb(var(--muted))] max-w-lg mx-auto">
              Serving retailers and dealers across Maharashtra with quality and trust
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Truck,
                title: 'Fast Delivery',
                desc: 'Same-day dispatch on orders before 12 PM. Quick, reliable shipping to your doorstep.',
                color: 'text-[rgb(var(--primary))]',
                bg: 'bg-[rgb(var(--primary))]/10',
              },
              {
                icon: Shield,
                title: 'Secure Payments',
                desc: 'Razorpay-powered checkout — UPI, cards, net banking, all fully encrypted.',
                color: 'text-[rgb(var(--success))]',
                bg: 'bg-[rgb(var(--success))]/10',
              },
              {
                icon: Star,
                title: 'Quality Guaranteed',
                desc: 'Every product is quality-checked. We stand behind what we sell — always.',
                color: 'text-[rgb(var(--secondary))]',
                bg: 'bg-[rgb(var(--secondary))]/10',
              },
            ].map(({ icon: Icon, title, desc, color, bg }, idx) => (
              <div key={title} className="relative card-surface p-8 overflow-hidden hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1.5 group">
                {/* Large decorative background number */}
                <span
                  className="absolute right-4 top-1 text-[90px] font-black leading-none pointer-events-none select-none"
                  style={{ color: 'rgb(var(--border))', opacity: 0.5 }}
                >
                  {String(idx + 1).padStart(2, '0')}
                </span>
                {/* Gold hover line at bottom */}
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[rgb(var(--primary))] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110', bg)}>
                  <Icon className={cn('w-7 h-7', color)} />
                </div>
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="text-sm text-[rgb(var(--muted))] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}


