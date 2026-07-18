
import { Badge } from './Badge';
import { cn } from '@/lib/utils';

interface PriceProps {
  value: number;
  compareAt?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Price({ value, compareAt, className, size = 'md' }: PriceProps) {
  const savings = compareAt && compareAt > value ? compareAt - value : 0;
  const savingsPercent = compareAt ? Math.round((savings / compareAt) * 100) : 0;

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className={cn('font-bold', sizeClasses[size])}>
        ₹{value.toLocaleString('en-IN')}
      </span>
      {compareAt && compareAt > value && (
        <>
          <span className="text-lg text-[rgb(var(--muted))] line-through">
            ₹{compareAt.toLocaleString('en-IN')}
          </span>
          {savingsPercent > 0 && (
            <Badge variant="success" className="text-xs">
              {savingsPercent}% OFF
            </Badge>
          )}
        </>
      )}
    </div>
  );
}

