'use client';

import { Product } from '@/lib/supabase';
import { useStore } from '@/lib/store';
import { useState } from 'react';
<<<<<<< HEAD

import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { ShoppingCart, Check } from 'lucide-react';
=======
import Link from 'next/link';
import { ShoppingCart, Check, Heart, Eye, Star } from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { cn } from '@/lib/utils';
>>>>>>> d4b4a93 (update code)

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
<<<<<<< HEAD
  const { customerType, addToCart } = useStore();
=======
  const { customerType, addToCart, toggleWishlist, isWishlisted } = useStore();
>>>>>>> d4b4a93 (update code)
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const price = customerType === 'dealer' ? product.dealer_price : product.retailer_price;
  const minQuantity = customerType === 'dealer' ? product.min_dealer_quantity : 1;
<<<<<<< HEAD

  const handleAddToCart = () => {
    if (quantity < minQuantity) {
      alert(`Minimum quantity for ${customerType}s is ${minQuantity}`);
      return;
    }

=======
  const isOutOfStock = product.stock === 0;
  const wishlisted = isWishlisted(product.id);

  const savings = product.retailer_price - product.dealer_price;
  const savingsPct = Math.round((savings / product.retailer_price) * 100);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (quantity < minQuantity) {
      return;
    }
>>>>>>> d4b4a93 (update code)
    addToCart({
      product_id: product.id,
      product_name: product.name,
      quantity,
      price,
      image_url: product.image_url || '',
    });
<<<<<<< HEAD

=======
>>>>>>> d4b4a93 (update code)
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

<<<<<<< HEAD
  const isOutOfStock = product.stock === 0;

    return (
    <div className="group card-surface p-4 hover:shadow-[0_12px_32px_rgba(20,30,60,0.35)] transition-all motion-safe:transition-all motion-safe:hover:-translate-y-0.5">
      {/* Product Image */}
      <div className="relative aspect-square bg-[rgb(var(--elevated))] overflow-hidden rounded-xl mb-4">                                                                        
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform motion-safe:group-hover:scale-[1.03] motion-safe:transition-transform"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl bg-linear-to-br from-[rgb(var(--primary))]/10 to-[rgb(var(--accent))]/10">  
            📦
          </div>
        )}

        {/* Stock Badge */}
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl">                                                                       
            <Badge variant="destructive" className="text-sm px-3 py-1">
              Out of Stock
            </Badge>
          </div>
        ) : (
          <Badge
            variant="success"
            className="absolute top-3 left-3 text-xs"
          >
            In Stock
          </Badge>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold line-clamp-2 min-h-14">
          {product.name}
        </h3>
        {/* Description */}
        <p className="text-sm text-[rgb(var(--muted))] line-clamp-2 min-h-10">
          {product.description || 'No description available'}
        </p>

        {/* Pricing */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[rgb(var(--primary))]">
              ₹{price.toLocaleString()}
            </span>
            {customerType === 'dealer' && (
              <Badge variant="secondary" className="text-xs">
                Dealer Price
              </Badge>
            )}
          </div>
          {customerType === 'dealer' && (
            <p className="text-xs text-[rgb(var(--muted))]">
              Min Qty: {minQuantity} • Stock: {product.stock}
            </p>
          )}
        </div>

        {/* Quantity Selector */}
        {!isOutOfStock && minQuantity > 1 && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-[rgb(var(--muted))]">Quantity:</label>
            <div className="flex items-center border border-[rgb(var(--border))] rounded-xl overflow-hidden">
              <Button
                intent="ghost"
                size="sm"
                onClick={() => setQuantity(Math.max(minQuantity, quantity - 1))}
                disabled={quantity <= minQuantity}
                className="h-8 px-3 rounded-none"
              >
                -
              </Button>
              <span className="px-3 text-sm font-medium min-w-12 text-center">
                {quantity}
              </span>
              <Button
                intent="ghost"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
                disabled={quantity >= product.stock}
                className="h-8 px-3 rounded-none"
              >
                +
              </Button>
            </div>
          </div>
        )}

        {/* Add to Cart Button */}
        <Button
          intent="primary"
          fullWidth
          onClick={handleAddToCart}
          disabled={isOutOfStock || added}
          className="w-full"
        >
          {added ? (
            <>
              <Check className="w-4 h-4" />
              Added!
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
    </div>
=======
  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product.id);
  };

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_20px_60px_rgba(91,155,255,0.15)] hover:-translate-y-1 hover:border-[rgb(var(--primary))]/30">

        {/* Image area */}
        <div className="relative aspect-[4/3] bg-[rgb(var(--elevated))] overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[rgb(var(--primary))]/10 to-[rgb(var(--accent))]/10">
              <div className="w-16 h-16 rounded-2xl bg-[rgb(var(--primary))]/20 flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 text-[rgb(var(--primary))]/60" />
              </div>
              <span className="text-xs text-[rgb(var(--muted))]">No image</span>
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-semibold">
              <Eye className="w-4 h-4" />
              View Details
            </div>
          </div>

          {/* Stock badge */}
          {isOutOfStock ? (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Badge variant="destructive" className="text-sm px-4 py-1.5">Out of Stock</Badge>
            </div>
          ) : (
            <Badge variant="success" className="absolute top-3 left-3 shadow-lg">In Stock</Badge>
          )}

          {/* Dealer savings badge */}
          {customerType === 'dealer' && savings > 0 && (
            <div className="absolute top-3 right-12 bg-[rgb(var(--secondary))] text-[rgb(var(--bg))] text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
              -{savingsPct}%
            </div>
          )}

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className={cn(
              'absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center',
              'shadow-lg transition-all duration-200',
              wishlisted
                ? 'bg-[rgb(var(--danger))] text-white scale-110'
                : 'bg-[rgb(var(--surface))]/90 backdrop-blur-sm text-[rgb(var(--muted))] hover:text-[rgb(var(--danger))] hover:scale-110'
            )}
          >
            <Heart className={cn('w-4 h-4', wishlisted && 'fill-current')} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Rating (decorative) */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} className={cn('w-3 h-3', i <= 4 ? 'fill-[rgb(var(--secondary))] text-[rgb(var(--secondary))]' : 'text-[rgb(var(--border))]')} />
            ))}
            <span className="text-xs text-[rgb(var(--muted))] ml-1">4.0</span>
          </div>

          {/* Name */}
          <h3 className="font-semibold text-[rgb(var(--text))] line-clamp-2 leading-snug text-sm sm:text-base">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-[rgb(var(--muted))] line-clamp-2 leading-relaxed">
            {product.description || 'Premium quality product'}
          </p>

          {/* Price */}
          <div className="space-y-0.5">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-[rgb(var(--primary))]">
                ₹{price.toLocaleString('en-IN')}
              </span>
              {customerType === 'dealer' && savings > 0 && (
                <span className="text-xs text-[rgb(var(--muted))] line-through">
                  ₹{product.retailer_price.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {customerType === 'dealer' && (
              <p className="text-xs text-[rgb(var(--muted))]">
                Min qty: {minQuantity} · Stock: {product.stock}
              </p>
            )}
          </div>

          {/* Quantity (dealer only) */}
          {!isOutOfStock && minQuantity > 1 && (
            <div className="flex items-center gap-2" onClick={(e) => e.preventDefault()}>
              <span className="text-xs text-[rgb(var(--muted))]">Qty:</span>
              <div className="flex items-center border border-[rgb(var(--border))] rounded-lg overflow-hidden">
                <button
                  className="px-2.5 py-1 text-sm hover:bg-[rgb(var(--elevated))] transition-colors disabled:opacity-40"
                  onClick={(e) => { e.preventDefault(); setQuantity(Math.max(minQuantity, quantity - 1)); }}
                  disabled={quantity <= minQuantity}
                >
                  −
                </button>
                <span className="px-3 text-sm font-medium border-x border-[rgb(var(--border))]">{quantity}</span>
                <button
                  className="px-2.5 py-1 text-sm hover:bg-[rgb(var(--elevated))] transition-colors disabled:opacity-40"
                  onClick={(e) => { e.preventDefault(); setQuantity(Math.min(product.stock, quantity + 1)); }}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || added}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200',
              isOutOfStock
                ? 'bg-[rgb(var(--elevated))] text-[rgb(var(--muted))] cursor-not-allowed'
                : added
                  ? 'bg-[rgb(var(--success))] text-white'
                  : 'bg-[rgb(var(--primary))] text-[rgb(var(--bg))] hover:opacity-90 active:scale-95 shadow-[0_4px_12px_rgb(var(--primary)/0.3)]'
            )}
          >
            {added ? (
              <><Check className="w-4 h-4" /> Added to Cart!</>
            ) : isOutOfStock ? (
              'Out of Stock'
            ) : (
              <><ShoppingCart className="w-4 h-4" /> Add to Cart</>
            )}
          </button>
        </div>
      </div>
    </Link>
>>>>>>> d4b4a93 (update code)
  );
}
