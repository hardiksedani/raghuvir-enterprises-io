
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const alertVariants = cva(
  'relative w-full rounded-xl border p-4',
  {
    variants: {
      variant: {
        default: 'bg-[rgb(var(--surface))] text-[rgb(var(--text))] border-[rgb(var(--border))]',
        destructive:
          'bg-[rgb(var(--danger))]/10 border-[rgb(var(--danger))] text-[rgb(var(--danger))]',
        success:
          'bg-[rgb(var(--success))]/10 border-[rgb(var(--success))] text-[rgb(var(--success))]',
        warning:
          'bg-[rgb(var(--warning))]/10 border-[rgb(var(--warning))] text-[rgb(var(--warning))]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Alert = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = 'Alert';

const AlertTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn('mb-1 font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
);
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-sm [&_p]:leading-relaxed', className)}
      {...props}
    />
  )
);
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };

