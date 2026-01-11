'use client';

import { Product } from '@/lib/supabase';
import { useStore } from '@/lib/store';
import { useState } from 'react';

import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { ShoppingCart, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { customerType, addToCart } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const price = customerType === 'dealer' ? product.dealer_price : product.retailer_price;
  const minQuantity = customerType === 'dealer' ? product.min_dealer_quantity : 1;

  const handleAddToCart = () => {
    if (quantity < minQuantity) {
      alert(`Minimum quantity for ${customerType}s is ${minQuantity}`);
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
    setTimeout(() => setAdded(false), 2000);
  };

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
  );
}
