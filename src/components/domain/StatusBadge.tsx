import { Badge } from "@/components/ui/Badge";
import { Dot } from "@/components/ui/Dot";
import { cn } from "@/lib/cn";

const COLORS: Record<string, { color: string; label: string }> = {
  success: { color: "var(--color-status-success)", label: "Success" },
  running: { color: "var(--color-status-running)", label: "Running" },
  failed: { color: "var(--color-status-failed)", label: "Failed" },
  skipped: { color: "var(--color-status-skipped)", label: "Skipped" },
  pending: { color: "var(--color-status-pending)", label: "Pending" },
};

export function StatusBadge({ status }: { status: string | null | undefined }) {
  const key = (status ?? "pending").toLowerCase();
  const meta = COLORS[key] ?? {
    color: "var(--color-muted)",
    label: status ?? "—",
  };
  const pulse = key === "running" || key === "pending";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-[3px] text-[10px] font-bold tracking-tight shadow-sm"
      style={{
        color: meta.color,
        background: `color-mix(in oklch, ${meta.color} 10%, transparent)`,
        borderColor: `color-mix(in oklch, ${meta.color} 25%, transparent)`,
      }}
    >
      <Dot color={meta.color} pulse={pulse} size={6} />
      {meta.label.toUpperCase()}
    </span>
  );
}

export function SourceLabel({ source }: { source: string | null | undefined }) {
  const s = (source ?? "").toLowerCase();

  const config: Record<
    string,
    { label: string; icon: string; bg: string; fg: string }
  > = {
    fracfocus: {
      label: "FracFocus",
      icon: "▣",
      bg: "var(--color-frac)",
      fg: "white",
    },
    uic: { label: "SWD Wells", icon: "◆", bg: "var(--color-swd)", fg: "white" },
    h10: {
      label: "SWD Monitor",
      icon: "⬡",
      bg: "var(--color-swd)",
      fg: "white",
    },
    texnet: {
      label: "TexNet",
      icon: "◎",
      bg: "var(--color-accent)",
      fg: "white",
    },
    usgs: {
      label: "USGS",
      icon: "●",
      bg: "var(--color-status-running)",
      fg: "white",
    },
    iris: {
      label: "IRIS Stations",
      icon: "▲",
      bg: "var(--color-station)",
      fg: "white",
    },
  };

  const c = config[s] ?? {
    label: source ?? "—",
    icon: "?",
    bg: "var(--color-muted)",
    fg: "white",
  };

  return (
    <span className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-card-elevated)] border border-[var(--color-border)] pl-1.5 pr-2.5 py-1 shadow-sm">
      <span
        className="flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold"
        style={{ backgroundColor: c.bg, color: c.fg }}
      >
        {c.icon}
      </span>
      <span className="text-[11px] font-bold text-[var(--color-fg)]">
        {c.label}
      </span>
    </span>
  );
}
