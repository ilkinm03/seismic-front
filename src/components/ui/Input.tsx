import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid, className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-9 w-full rounded-md border bg-[var(--color-card)] px-3 text-sm text-[var(--color-fg)] placeholder:text-[var(--color-subtle)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--color-bg)]",
        "transition-colors",
        invalid
          ? "border-[var(--color-status-failed)]"
          : "border-[var(--color-border-strong)] hover:border-[var(--color-subtle)]",
        className,
      )}
      {...rest}
    />
  );
});
