'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase, Product } from '@/lib/supabase';
import { useStore } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';
import { Badge } from '@/components/ui/Badge';
import {
  ShoppingCart, Heart, ArrowLeft, Check, Star,
  Package, Truck, Shield, ChevronRight, Minus, Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { customerType, addToCart, toggleWishlist, isWishlisted } = useStore();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const wishlisted = product ? isWishlisted(product.id) : false;
  const price = product
    ? customerType === 'dealer' ? product.dealer_price : product.retailer_price
    : 0;
  const minQty = product
    ? customerType === 'dealer' ? product.min_dealer_quantity : 1
    : 1;
  const isOutOfStock = product ? product.stock === 0 : false;

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if (error || !data) {
        router.replace('/');
        return;
      }
      setProduct(data);
      setQuantity(data.min_dealer_quantity || 1);
      setLoading(false);
    }
    load();
  }, [id, router]);

  const handleAddToCart = () => {
    if (!product) return;
    if (quantity < minQty) {
      showToast(`Minimum quantity is ${minQty}`, 'warning');
      return;
    }
    addToCart({
      product_id: product.id,
      product_name: product.name,
      quantity,
      price,
      image_url: product.image_url || '',
    });
    setAdded(true);
    showToast(`${product.name} added to cart!`, 'success');
    setTimeout(() => setAdded(false), 2500);
  };

  const handleWishlist = () => {
    if (!product) return;
    toggleWishlist(product.id);
    showToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist!', wishlisted ? 'info' : 'success');
  };

  if (loading) {
    return (
      <main className="min-h-screen py-12 container-page">
        <div className="grid md:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square rounded-3xl shimmer" />
          <div className="space-y-4 pt-4">
            <div className="h-6 shimmer rounded-full w-1/3" />
            <div className="h-10 shimmer rounded-full w-3/4" />
            <div className="h-4 shimmer rounded-full w-full" />
            <div className="h-4 shimmer rounded-full w-2/3" />
            <div className="h-14 shimmer rounded-2xl w-1/2 mt-6" />
            <div className="h-12 shimmer rounded-2xl mt-4" />
          </div>
        </div>
      </main>
    );
  }

  if (!product) return null;

  return (
    <main className="min-h-screen py-8">
      <div className="container-page space-y-10">

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-[rgb(var(--muted))]">
          <Link href="/" className="hover:text-[rgb(var(--text))] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[rgb(var(--text))] font-medium line-clamp-1">{product.name}</span>
        </nav>

        {/* Main detail layout */}
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">

          {/* Image */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-[rgb(var(--elevated))] border border-[rgb(var(--border))] group">
              {product.image_url && !imgError ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[rgb(var(--primary))]/10 to-[rgb(var(--accent))]/10">
                  <div className="w-24 h-24 rounded-3xl bg-[rgb(var(--primary))]/20 flex items-center justify-center">
                    <Package className="w-12 h-12 text-[rgb(var(--primary))]/60" />
                  </div>
                  <span className="text-sm text-[rgb(var(--muted))]">No image available</span>
                </div>
              )}

              {/* Stock overlay */}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="destructive" className="text-base px-6 py-2">Out of Stock</Badge>
                </div>
              )}

              {/* Wishlist */}
              <button
                onClick={handleWishlist}
                className={cn(
                  'absolute top-4 right-4 w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg transition-all',
                  wishlisted
                    ? 'bg-[rgb(var(--danger))] text-white'
                    : 'bg-[rgb(var(--surface))]/90 backdrop-blur-sm text-[rgb(var(--muted))] hover:text-[rgb(var(--danger))]'
                )}
              >
                <Heart className={cn('w-5 h-5', wishlisted && 'fill-current')} />
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6 py-2">
            {/* Status + type */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={isOutOfStock ? 'destructive' : 'success'} className="text-xs">
                {isOutOfStock ? 'Out of Stock' : 'In Stock'}
              </Badge>
              <Badge variant="secondary" className="text-xs capitalize">{customerType}</Badge>
            </div>

            {/* Name */}
            <h1 className="text-3xl sm:text-4xl font-black leading-tight text-[rgb(var(--text))]">
              {product.name}
            </h1>

            {/* Star rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} className={cn('w-4 h-4', i <= 4 ? 'fill-[rgb(var(--secondary))] text-[rgb(var(--secondary))]' : 'text-[rgb(var(--border))]')} />
                ))}
              </div>
              <span className="text-sm text-[rgb(var(--muted))]">4.0 · Quality Assured</span>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-[rgb(var(--muted))] leading-relaxed">{product.description}</p>
            )}

            {/* Price block */}
            <div className="p-5 rounded-2xl bg-[rgb(var(--elevated))] border border-[rgb(var(--border))] space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-[rgb(var(--primary))]">
                  ₹{price.toLocaleString('en-IN')}
                </span>
                {customerType === 'dealer' && product.retailer_price > product.dealer_price && (
                  <>
                    <span className="text-lg text-[rgb(var(--muted))] line-through">
                      ₹{product.retailer_price.toLocaleString('en-IN')}
                    </span>
                    <Badge variant="warning" className="text-xs">
                      Save ₹{(product.retailer_price - product.dealer_price).toLocaleString('en-IN')}
                    </Badge>
                  </>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-[rgb(var(--muted))]">
                <span>Stock: <strong className="text-[rgb(var(--text))]">{product.stock}</strong></span>
                {customerType === 'dealer' && (
                  <span>Min Qty: <strong className="text-[rgb(var(--text))]">{minQty}</strong></span>
                )}
              </div>
            </div>

            {/* Quantity selector */}
            {!isOutOfStock && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-[rgb(var(--muted))]">Quantity</span>
                <div className="flex items-center border border-[rgb(var(--border))] rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(q => Math.max(minQty, q - 1))}
                    disabled={quantity <= minQty}
                    className="w-10 h-10 flex items-center justify-center hover:bg-[rgb(var(--elevated))] disabled:opacity-30 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-14 text-center font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="w-10 h-10 flex items-center justify-center hover:bg-[rgb(var(--elevated))] disabled:opacity-30 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-[rgb(var(--muted))]">
                  Total: <strong className="text-[rgb(var(--primary))]">₹{(price * quantity).toLocaleString('en-IN')}</strong>
                </span>
              </div>
            )}

            {/* CTA buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || added}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-base transition-all',
                  isOutOfStock
                    ? 'bg-[rgb(var(--elevated))] text-[rgb(var(--muted))] cursor-not-allowed'
                    : added
                      ? 'bg-[rgb(var(--success))] text-white'
                      : 'bg-[rgb(var(--primary))] text-[rgb(var(--bg))] hover:opacity-90 shadow-[0_6px_20px_rgb(var(--primary)/0.35)] active:scale-95'
                )}
              >
                {added ? <><Check className="w-5 h-5" /> Added!</> : <><ShoppingCart className="w-5 h-5" /> Add to Cart</>}
              </button>
              <Link
                href="/cart"
                className="flex items-center justify-center px-5 rounded-2xl border border-[rgb(var(--border))] hover:bg-[rgb(var(--elevated))] transition-colors font-semibold text-sm"
              >
                View Cart
              </Link>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: Truck, text: 'Fast Delivery' },
                { icon: Shield, text: 'Secure Payment' },
                { icon: Package, text: 'Quality Assured' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[rgb(var(--elevated))] border border-[rgb(var(--border))] text-center">
                  <Icon className="w-5 h-5 text-[rgb(var(--primary))]" />
                  <span className="text-xs text-[rgb(var(--muted))] font-medium leading-tight">{text}</span>
                </div>
              ))}
            </div>

            {/* Back */}
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm text-[rgb(var(--muted))] hover:text-[rgb(var(--text))] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to products
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
