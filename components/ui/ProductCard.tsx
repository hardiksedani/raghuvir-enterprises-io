
'use client';

import { Eye, Heart } from 'lucide-react';
import { Button } from './Button';
import { Rating } from './Rating';
import { Price } from './Price';
import { Badge } from './Badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  compareAt?: number;
  rating?: number;
  image?: string;
  badge?: string;
  onAddToCart?: () => void;
  onQuickView?: () => void;
  className?: string;
}

export function ProductCard({
  id,
  name,
  price,
  compareAt,
  rating = 0,
  image,
  badge,
  onAddToCart,
  onQuickView,
  className,
}: ProductCardProps) {
  return (
    <div className={cn('group card-surface p-4 hover:shadow-[0_12px_32px_rgba(20,30,60,0.35)] transition-all motion-safe:transition-all', className)}>
      <div className="relative aspect-square overflow-hidden rounded-xl mb-4">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform group-hover:scale-[1.03] motion-safe:transition-transform"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-[rgb(var(--elevated))] flex items-center justify-center text-4xl">
            📦
          </div>
        )}
        {badge && (
          <Badge className="absolute left-3 top-3 bg-[rgb(var(--primary))]/20 text-[rgb(var(--text))]">
            {badge}
          </Badge>
        )}
        <Button
          intent="ghost"
          size="sm"
          onClick={onQuickView}
          className="absolute right-3 top-3 bg-[rgb(var(--surface))]/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Quick view"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          intent="ghost"
          size="sm"
          className="absolute right-3 bottom-3 bg-[rgb(var(--surface))]/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Add to favorites"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2">
        <Link href={`/products/${id}`}>
          <h3 className="line-clamp-2 text-base font-medium hover:text-[rgb(var(--primary))] transition-colors">
            {name}
          </h3>
        </Link>
        {rating > 0 && (
          <div className="flex items-center gap-2">
            <Rating value={rating} size="sm" showValue />
          </div>
        )}
        <div className="flex items-center gap-2">
          <Price value={price} compareAt={compareAt} size="md" />
        </div>
        <Button
          intent="primary"
          className="w-full mt-2"
          onClick={onAddToCart}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}

