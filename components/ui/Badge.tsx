
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const badge = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[rgb(var(--primary))] text-[rgb(var(--bg))]",
        secondary: "border-transparent bg-[rgb(var(--surface))] text-[rgb(var(--text))]",
        success: "border-transparent bg-[rgb(var(--success))] text-white",
        warning: "border-transparent bg-[rgb(var(--warning))] text-white",
        destructive: "border-transparent bg-[rgb(var(--danger))] text-white",
        outline: "border-[rgb(var(--border))] text-[rgb(var(--text))]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badge> {}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(badge({ variant }), className)} {...props} />
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badge };

