'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

export function Rating({ value, max = 5, size = 'md', showValue = false, className }: RatingProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div className={cn('flex items-center gap-1', className)} role="img" aria-label={`Rating: ${value} out of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          className={cn(
            sizeClasses[size],
            i < Math.round(value)
              ? 'fill-[rgb(var(--warning))] text-[rgb(var(--warning))]'
              : 'fill-none text-[rgb(var(--muted))]'
          )}
        />
      ))}
      {showValue && (
        <span className="ml-1 text-sm text-[rgb(var(--muted))]">{value.toFixed(1)}</span>
      )}
    </div>
  );
}
