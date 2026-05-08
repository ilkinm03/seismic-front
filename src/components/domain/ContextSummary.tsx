import type { EventContext } from "@/types/api";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";

export function ContextSummary({ context }: { context: EventContext }) {
  const items = [
    {
      label: "SWD Wells",
      value: context.nearby_swd_wells.length,
      hint: `${context.swd_radius_km} km · ${Math.round(context.swd_window_days / 365)} yr lookback`,
      color: "var(--color-swd)",
    },
    {
      label: "Frac Jobs",
      value: context.nearby_frac_jobs.length,
      hint: `${context.frac_radius_km} km · ${Math.round(context.frac_window_days / 365)} yr lookback`,
      color: "var(--color-frac)",
    },
    {
      label: "Stations",
      value: context.nearby_stations.length,
      hint: `${context.station_radius_km} km`,
      color: "var(--color-station)",
    },
  ];
  return (
    <Card>
      <CardHeader
        title="Context Summary"
        subtitle="Nearby records (attribution not yet run)"
      />
      <CardBody className="grid grid-cols-3 gap-3">
        {items.map((it) => (
          <div
            key={it.label}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card-elevated)] p-3"
          >
            <div
              className="mb-1 text-[10px] font-semibold uppercase tracking-wide"
              style={{ color: it.color }}
            >
              {it.label}
            </div>
            <div className="font-mono text-2xl font-semibold text-[var(--color-fg)]">
              {it.value}
            </div>
            <div className="mt-1 text-[10px] text-[var(--color-muted)]">
              {it.hint}
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
