import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

/** Native <select> styled to match other primitives. Lightweight; Radix Select is overkill here. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { invalid, className, children, ...rest },
  ref,
) {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "h-9 w-full appearance-none rounded-md border bg-[var(--color-card)] px-3 pr-8 text-sm text-[var(--color-fg)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--color-bg)]",
          "transition-colors",
          invalid
            ? "border-[var(--color-status-failed)]"
            : "border-[var(--color-border-strong)] hover:border-[var(--color-subtle)]",
          className,
        )}
        {...rest}
      >
        {children}
      </select>
      <svg
        viewBox="0 0 12 12"
        className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2 text-[var(--color-muted)]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M3 5l3 3 3-3" />
      </svg>
    </div>
  );
});
