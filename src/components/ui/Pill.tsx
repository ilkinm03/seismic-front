import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Pill({
  children,
  color,
  bg,
  border,
  className,
}: {
  children: ReactNode;
  color?: string;
  bg?: string;
  border?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-[2px] font-mono text-[10px] font-medium tracking-tight",
        className,
      )}
      style={{
        color: color ?? "var(--color-muted)",
        background: bg ?? "var(--color-card-elevated)",
        borderColor: border ?? "var(--color-border)",
      }}
    >
      {children}
    </span>
  );
}
