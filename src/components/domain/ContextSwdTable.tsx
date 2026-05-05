import type { NearbySwdWell } from "@/types/api";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/Table";
import { kmFmt, bblFmt } from "@/lib/format";
import { Tooltip } from "@/components/ui/Tooltip";

export function ContextSwdTable({ wells }: { wells: NearbySwdWell[] }) {
  const sorted = [...wells].sort((a, b) => a.distance_km - b.distance_km);

  if (sorted.length === 0) {
    return (
      <p className="py-6 text-center text-xs text-[var(--color-muted)]">
        No nearby SWD wells found in this radius and time window.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <THead>
          <TR>
            <TH>UIC #</TH>
            <TH className="text-right">Dist (km)</TH>
            <TH className="text-right">Cum. BBL</TH>
            <TH className="text-right">Avg Press (psi)</TH>
            <TH className="text-right">
              <Tooltip content="Ratio of last 12 months injection volume to the previous period. ≥2× = significant increase.">
                Rate Ratio
              </Tooltip>
            </TH>
            <TH className="text-right">Last Active</TH>
          </TR>
        </THead>
        <TBody>
          {sorted.map((w) => (
            <TR key={w.uic_number}>
              <TD className="font-mono text-[11px]">{w.uic_number}</TD>
              <TD className="text-right">{kmFmt(w.distance_km)}</TD>
              <TD className="text-right">{bblFmt(w.cumulative_bbl)}</TD>
              <TD className="text-right">
                {w.avg_pressure_psi != null ? w.avg_pressure_psi.toFixed(0) : "—"}
              </TD>
              <TD className="text-right">
                {w.rate_change_ratio != null ? (
                  <span
                    className="font-mono"
                    style={{
                      color:
                        w.rate_change_ratio >= 2
                          ? "var(--color-status-failed)"
                          : w.rate_change_ratio >= 1.2
                            ? "var(--color-status-pending)"
                            : "var(--color-fg)",
                    }}
                  >
                    {w.rate_change_ratio.toFixed(2)}×
                  </span>
                ) : (
                  "—"
                )}
              </TD>
              <TD className="text-right font-mono text-[10px] text-[var(--color-muted)]">
                {w.last_report_date ? w.last_report_date.split("T")[0] : "—"}
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
