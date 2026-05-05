import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "brand";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  outline?: boolean;
  /** Override token color. */
  color?: string;
  bg?: string;
  border?: string;
  children?: ReactNode;
}

const TONE: Record<Tone, { color: string; bg: string; border: string }> = {
  neutral: {
    color: "var(--color-muted)",
    bg: "color-mix(in oklch, var(--color-muted) 10%, transparent)",
    border: "color-mix(in oklch, var(--color-muted) 25%, transparent)",
  },
  success: {
    color: "var(--color-status-success)",
    bg: "color-mix(in oklch, var(--color-status-success) 14%, transparent)",
    border: "color-mix(in oklch, var(--color-status-success) 30%, transparent)",
  },
  warning: {
    color: "var(--color-status-pending)",
    bg: "color-mix(in oklch, var(--color-status-pending) 14%, transparent)",
    border: "color-mix(in oklch, var(--color-status-pending) 30%, transparent)",
  },
  danger: {
    color: "var(--color-status-failed)",
    bg: "color-mix(in oklch, var(--color-status-failed) 14%, transparent)",
    border: "color-mix(in oklch, var(--color-status-failed) 30%, transparent)",
  },
  info: {
    color: "var(--color-status-running)",
    bg: "color-mix(in oklch, var(--color-status-running) 14%, transparent)",
    border: "color-mix(in oklch, var(--color-status-running) 30%, transparent)",
  },
  brand: {
    color: "var(--color-accent)",
    bg: "color-mix(in oklch, var(--color-accent) 14%, transparent)",
    border: "color-mix(in oklch, var(--color-accent) 30%, transparent)",
  },
};

export function Badge({
  tone = "neutral",
  outline,
  color,
  bg,
  border,
  className,
  style,
  children,
  ...rest
}: BadgeProps) {
  const t = TONE[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-[2px] font-mono text-[10px] font-medium tracking-tight",
        outline && "bg-transparent",
        className,
      )}
      style={{
        color: color ?? t.color,
        background: outline ? "transparent" : (bg ?? t.bg),
        borderColor: border ?? t.border,
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
