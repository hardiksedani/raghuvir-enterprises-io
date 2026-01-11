import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const button = cva(
  "inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition-all motion-safe:transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary))] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      intent: {
        primary: "bg-[rgb(var(--primary))] text-[rgb(var(--bg))] hover:opacity-90 active:opacity-80",
        secondary: "bg-[rgb(var(--surface))] text-[rgb(var(--text))] border border-[rgb(var(--border))] hover:bg-[rgb(var(--elevated))]",
        ghost: "bg-transparent text-[rgb(var(--text))] hover:bg-[rgb(var(--surface))]",
        outline: "bg-transparent border border-[rgb(var(--border))] text-[rgb(var(--text))] hover:bg-[rgb(var(--surface))]",
        destructive: "bg-[rgb(var(--danger))] text-white hover:opacity-90 active:opacity-80",
      },
      size: {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-5 py-3 text-lg",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, intent, size, fullWidth, ...props }, ref) => {
    return (
      <button
        className={cn(button({ intent, size }), fullWidth && "w-full", className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, button };
