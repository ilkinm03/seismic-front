import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";

export interface ErrorStateProps {
  title?: ReactNode;
  description?: ReactNode;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "Please try again or check the backend.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-[var(--radius-card)] border border-[var(--color-status-failed)]/40 bg-[color-mix(in_oklch,var(--color-status-failed)_8%,var(--color-card))] px-6 py-8 text-center",
        className,
      )}
    >
      <div className="flex size-9 items-center justify-center rounded-full bg-[color-mix(in_oklch,var(--color-status-failed)_15%,var(--color-card))] text-[var(--color-status-failed)]">
        <svg
          viewBox="0 0 20 20"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <circle cx="10" cy="10" r="8" />
          <path d="M10 6v5M10 14h.01" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-[var(--color-fg)]">
          {title}
        </h3>
        <p className="mt-1 max-w-md text-xs leading-relaxed text-[var(--color-muted)]">
          {description}
        </p>
      </div>
      {onRetry ? (
        <Button size="sm" variant="outline" onClick={onRetry}>
          Retry
        </Button>
      ) : null}
    </div>
  );
}
