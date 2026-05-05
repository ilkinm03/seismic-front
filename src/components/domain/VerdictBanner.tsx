import type { AttributionResult } from "@/types/api";
import { pctFmt } from "@/lib/format";
import { cn } from "@/lib/cn";

interface VerdictTheme {
  label: string;
  blurb: string;
  color: string;
  bg: string;
  border: string;
  ring: string;
  icon: string;
}

function pickTheme(driver: string, confidence: number): VerdictTheme {
  if (driver === "swd") {
    if (confidence >= 0.75)
      return {
        label: "Likely caused by saltwater disposal",
        blurb: "SWD weight dominant — high confidence.",
        color: "var(--color-status-failed)",
        bg: "color-mix(in oklch, var(--color-status-failed) 12%, var(--color-card))",
        border: "color-mix(in oklch, var(--color-status-failed) 50%, transparent)",
        ring: "color-mix(in oklch, var(--color-status-failed) 35%, transparent)",
        icon: "■",
      };
    return {
      label: "Possibly caused by saltwater disposal",
      blurb: "SWD dominant but frac signals present.",
      color: "var(--color-status-pending)",
      bg: "color-mix(in oklch, var(--color-status-pending) 12%, var(--color-card))",
      border: "color-mix(in oklch, var(--color-status-pending) 45%, transparent)",
      ring: "color-mix(in oklch, var(--color-status-pending) 30%, transparent)",
      icon: "●",
    };
  }
  if (driver === "frac") {
    if (confidence >= 0.75)
      return {
        label: "Likely caused by hydraulic fracturing",
        blurb: "Frac weight dominant — high confidence.",
        color: "var(--color-frac)",
        bg: "color-mix(in oklch, var(--color-frac) 12%, var(--color-card))",
        border: "color-mix(in oklch, var(--color-frac) 50%, transparent)",
        ring: "color-mix(in oklch, var(--color-frac) 35%, transparent)",
        icon: "▣",
      };
    return {
      label: "Possibly caused by hydraulic fracturing",
      blurb: "Frac dominant but SWD signals present.",
      color: "var(--color-status-pending)",
      bg: "color-mix(in oklch, var(--color-status-pending) 12%, var(--color-card))",
      border: "color-mix(in oklch, var(--color-status-pending) 45%, transparent)",
      ring: "color-mix(in oklch, var(--color-status-pending) 30%, transparent)",
      icon: "●",
    };
  }
  return {
    label: "Cause unclear — insufficient evidence",
    blurb: "No nearby injection/frac records or equal signals.",
    color: "var(--color-muted)",
    bg: "var(--color-card-elevated)",
    border: "var(--color-border)",
    ring: "var(--color-border)",
    icon: "?",
  };
}

export function VerdictBanner({ result }: { result: AttributionResult }) {
  const theme = pickTheme(result.likely_driver, result.confidence);
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border p-5",
        "animate-[verdict-rise_0.45s_ease-out]",
      )}
      style={{ background: theme.bg, borderColor: theme.border, boxShadow: `0 0 0 4px ${theme.ring}` }}
    >
      <div className="flex items-start gap-4">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-xl text-2xl font-bold"
          style={{ color: theme.color, background: `color-mix(in oklch, ${theme.color} 14%, transparent)` }}
        >
          {theme.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-[.12em] text-[var(--color-muted)]">
            Verdict · engine {result.engine}
          </div>
          <h2 className="mt-1 text-lg font-semibold leading-snug" style={{ color: theme.color }}>
            {theme.label}
          </h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">{theme.blurb}</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-semibold uppercase tracking-[.12em] text-[var(--color-muted)]">
            Confidence
          </div>
          <div className="font-mono text-3xl font-bold" style={{ color: theme.color }}>
            {pctFmt(result.confidence)}
          </div>
        </div>
      </div>
    </div>
  );
}
