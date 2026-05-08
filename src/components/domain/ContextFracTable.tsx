import { useEffect, useRef } from "react";
import type { NearbyFracJob } from "@/types/api";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/Table";
import { kmFmt, galFmt } from "@/lib/format";
import { fracJobKey } from "@/lib/contextKeys";
import { scrollIntoNearestContainer } from "@/lib/scroll";

interface ContextFracTableProps {
  jobs: NearbyFracJob[];
  focusedFracJob?: string | null;
  promoteFocused?: boolean;
  onSelectJob?: (job: NearbyFracJob) => void;
}

export function ContextFracTable({
  jobs,
  focusedFracJob,
  promoteFocused = false,
  onSelectJob,
}: ContextFracTableProps) {
  const rowRefs = useRef<Record<string, HTMLTableRowElement | null>>({});
  const sorted = [...jobs].sort((a, b) => {
    if (promoteFocused && focusedFracJob) {
      if (fracJobKey(a) === focusedFracJob) return -1;
      if (fracJobKey(b) === focusedFracJob) return 1;
    }
    return a.distance_km - b.distance_km;
  });

  useEffect(() => {
    if (!focusedFracJob) return;
    const timer = window.setTimeout(() => {
      const row = rowRefs.current[focusedFracJob];
      if (!row) return;
      scrollIntoNearestContainer(row);
    }, 120);

    return () => window.clearTimeout(timer);
  }, [focusedFracJob, promoteFocused]);

  if (sorted.length === 0) {
    return (
      <p className="py-6 text-center text-xs text-[var(--color-muted)]">
        No nearby frac jobs found in this radius and time window.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <THead>
          <TR>
            <TH>API #</TH>
            <TH>Operator</TH>
            <TH>Date</TH>
            <TH className="text-right">Dist (km)</TH>
            <TH className="text-right">Water Vol (gal)</TH>
            <TH className="text-right">Form. Depth (ft)</TH>
          </TR>
        </THead>
        <TBody>
          {sorted.map((j) => {
            const key = fracJobKey(j);
            const isFocused = focusedFracJob === key;
            const isPromotedFocused = promoteFocused && isFocused;
            const canFocus = Boolean(!isPromotedFocused && onSelectJob);

            return (
              <TR
                key={key}
                ref={(node) => {
                  rowRefs.current[key] = node;
                }}
                aria-selected={isFocused}
                tabIndex={canFocus ? 0 : undefined}
                onClick={canFocus ? () => onSelectJob?.(j) : undefined}
                onKeyDown={
                  canFocus
                    ? (event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          onSelectJob?.(j);
                        }
                      }
                    : undefined
                }
                className={[
                  canFocus
                    ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-accent)]"
                    : "",
                  isFocused
                    ? "bg-[color-mix(in_oklch,var(--color-frac)_12%,transparent)]"
                    : "",
                ].join(" ")}
              >
                <TD className="font-mono text-[11px]">{j.api_number}</TD>
                <TD className="max-w-[140px] truncate text-[11px]">
                  {j.operator_name ?? "-"}
                </TD>
                <TD className="text-[10px] font-mono text-[var(--color-muted)] whitespace-nowrap">
                  {j.job_start_date ? (
                    <>
                      {j.job_start_date}
                      {j.job_end_date &&
                        j.job_end_date !== j.job_start_date && (
                          <span className="opacity-50">
                            {" "}
                            - {j.job_end_date}
                          </span>
                        )}
                    </>
                  ) : (
                    "-"
                  )}
                </TD>
                <TD className="text-right">{kmFmt(j.distance_km)}</TD>
                <TD className="text-right">
                  {j.total_water_volume != null
                    ? galFmt(j.total_water_volume)
                    : "-"}
                </TD>
                <TD className="text-right">
                  {j.formation_depth != null
                    ? j.formation_depth.toLocaleString()
                    : "-"}
                </TD>
              </TR>
            );
          })}
        </TBody>
      </Table>
    </div>
  );
}
