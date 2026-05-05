import type { AttributionSignal } from "@/types/api";
import { Badge } from "@/components/ui/Badge";
import { numberFmt } from "@/lib/format";

function parseDescription(desc: string) {
  const distance = desc.match(/(\d+(?:\.\d+)?)\s*km/)?.[1];
  const depthDelta = desc.match(/Δ([\d.]+)\s*km/)?.[1];
  const rate = desc.match(/rate\s*[×x]([\d.]+)/i)?.[1];
  const pressure = desc.match(/pressure front[:\s]+([\d.]+)\s*km/i)?.[1];
  const erfc = desc.match(/erfc[:\s]+([\d.]+)/i)?.[1];
  return {
    distance: distance ? parseFloat(distance) : null,
    depthDelta: depthDelta ? parseFloat(depthDelta) : null,
    rate: rate ? parseFloat(rate) : null,
    pressure: pressure ? parseFloat(pressure) : null,
    erfc: erfc ? parseFloat(erfc) : null,
  };
}

function depthTone(km: number): "success" | "warning" | "danger" {
  if (km < 3) return "success";
  if (km <= 6) return "warning";
  return "danger";
}

export function SignalCard({ signal, rank }: { signal: AttributionSignal; rank: number }) {
  const parsed = parseDescription(signal.description);

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card-elevated)] p-3">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-border)] font-mono text-[10px] font-bold text-[var(--color-muted)]">
            {rank}
          </span>
          <span className="text-xs font-semibold text-[var(--color-fg)]">{signal.name}</span>
        </div>
        <span className="font-mono text-sm font-bold text-[var(--color-fg)]">
          {numberFmt(signal.value, { decimals: 2 })}{" "}
          <span className="text-[10px] font-normal text-[var(--color-muted)]">{signal.unit}</span>
        </span>
      </div>

      <p className="mb-2 text-[11px] leading-relaxed text-[var(--color-muted)]">{signal.description}</p>

      <div className="flex flex-wrap gap-1">
        {parsed.distance != null && (
          <Badge tone="neutral">{parsed.distance.toFixed(1)} km</Badge>
        )}
        {parsed.depthDelta != null && (
          <Badge tone={depthTone(parsed.depthDelta)}>Δ{parsed.depthDelta.toFixed(1)} km</Badge>
        )}
        {parsed.rate != null && (
          <Badge tone="danger">×{parsed.rate.toFixed(2)} rate</Badge>
        )}
        {parsed.pressure != null && (
          <Badge tone="info">P-front {parsed.pressure.toFixed(1)} km</Badge>
        )}
        {parsed.erfc != null && (
          <Badge tone="info">erfc {parsed.erfc.toFixed(3)}</Badge>
        )}
      </div>
    </div>
  );
}
