import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'text' | 'circular';
}

export function Skeleton({ className, variant = 'default', ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-[rgb(var(--elevated))]',
        variant === 'circular' && 'rounded-full',
        variant === 'text' && 'h-4',
        className
      )}
      {...props}
    />
  );
}
