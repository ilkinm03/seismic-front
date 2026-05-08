import { useEffect, useRef } from "react";
import type { NearbySwdWell } from "@/types/api";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/Table";
import { kmFmt, bblFmt } from "@/lib/format";
import { scrollIntoNearestContainer } from "@/lib/scroll";
import { Tooltip } from "@/components/ui/Tooltip";

interface ContextSwdTableProps {
  wells: NearbySwdWell[];
  focusedUic?: string | null;
  promoteFocused?: boolean;
  onSelectWell?: (well: NearbySwdWell) => void;
}

export function ContextSwdTable({
  wells,
  focusedUic,
  promoteFocused = false,
  onSelectWell,
}: ContextSwdTableProps) {
  const rowRefs = useRef<Record<string, HTMLTableRowElement | null>>({});
  const sorted = [...wells].sort((a, b) => {
    if (promoteFocused && focusedUic) {
      if (a.uic_number === focusedUic) return -1;
      if (b.uic_number === focusedUic) return 1;
    }
    return a.distance_km - b.distance_km;
  });

  useEffect(() => {
    if (!focusedUic) return;
    const timer = window.setTimeout(() => {
      const row = rowRefs.current[focusedUic];
      if (!row) return;
      scrollIntoNearestContainer(row);
    }, 120);

    return () => window.clearTimeout(timer);
  }, [focusedUic, promoteFocused]);

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
          {sorted.map((w) => {
            const isFocused = focusedUic === w.uic_number;
            const isPromotedFocused = promoteFocused && isFocused;
            const canFocus = Boolean(
              !isPromotedFocused &&
              onSelectWell &&
              w.latitude != null &&
              w.longitude != null,
            );

            return (
              <TR
                key={w.uic_number}
                ref={(node) => {
                  rowRefs.current[w.uic_number] = node;
                }}
                aria-selected={isFocused}
                tabIndex={canFocus ? 0 : undefined}
                onClick={canFocus ? () => onSelectWell?.(w) : undefined}
                onKeyDown={
                  canFocus
                    ? (event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          onSelectWell?.(w);
                        }
                      }
                    : undefined
                }
                className={[
                  canFocus
                    ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-accent)]"
                    : "",
                  isFocused
                    ? "bg-[color-mix(in_oklch,var(--color-swd)_12%,transparent)]"
                    : "",
                ].join(" ")}
              >
                <TD className="font-mono text-[11px]">{w.uic_number}</TD>
                <TD className="text-right">{kmFmt(w.distance_km)}</TD>
                <TD className="text-right">{bblFmt(w.cumulative_bbl)}</TD>
                <TD className="text-right">
                  {w.avg_pressure_psi != null
                    ? w.avg_pressure_psi.toFixed(0)
                    : "—"}
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
            );
          })}
        </TBody>
      </Table>
    </div>
  );
}
