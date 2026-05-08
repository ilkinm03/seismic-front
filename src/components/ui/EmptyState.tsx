import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface EmptyStateProps {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-[var(--radius-card)] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-card)]/40 px-6 py-10 text-center",
        className,
      )}
    >
      {icon ? <div className="text-[var(--color-muted)]">{icon}</div> : null}
      <div>
        <h3 className="text-sm font-semibold text-[var(--color-fg)]">
          {title}
        </h3>
        {description ? (
          <p className="mt-1 max-w-md text-xs leading-relaxed text-[var(--color-muted)]">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
