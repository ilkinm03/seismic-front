import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Spinner } from "@/components/ui/Spinner";

type Variant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "danger"
  | "subtle";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const VARIANT: Record<Variant, string> = {
  primary:
    "bg-[var(--color-fg)] text-[var(--color-bg)] hover:opacity-90 disabled:opacity-50",
  secondary:
    "bg-[var(--color-card-elevated)] text-[var(--color-fg)] border border-[var(--color-border)] hover:border-[var(--color-border-strong)]",
  ghost:
    "bg-transparent text-[var(--color-fg)] hover:bg-[var(--color-card-elevated)]",
  outline:
    "bg-transparent border border-[var(--color-border-strong)] text-[var(--color-fg)] hover:bg-[var(--color-card-elevated)]",
  danger: "bg-[var(--color-status-failed)] text-white hover:opacity-90",
  subtle:
    "bg-[color-mix(in_oklch,var(--color-accent)_12%,transparent)] text-[var(--color-accent)] border border-[color-mix(in_oklch,var(--color-accent)_25%,transparent)] hover:bg-[color-mix(in_oklch,var(--color-accent)_18%,transparent)]",
};

const SIZE: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-md",
  md: "h-10 px-4 text-sm gap-2 rounded-lg",
  lg: "h-12 px-5 text-sm gap-2 rounded-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "secondary",
      size = "md",
      loading,
      leftIcon,
      rightIcon,
      fullWidth,
      className,
      children,
      disabled,
      type = "button",
      ...rest
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-medium tracking-tight transition-colors",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]",
          VARIANT[variant],
          SIZE[size],
          fullWidth && "w-full",
          className,
        )}
        {...rest}
      >
        {loading ? <Spinner size={size === "sm" ? 12 : 14} /> : leftIcon}
        {children}
        {!loading && rightIcon}
      </button>
    );
  },
);
