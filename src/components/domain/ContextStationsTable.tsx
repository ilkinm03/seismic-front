import { useEffect, useRef } from "react";
import type { NearbyStation } from "@/types/api";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/Table";
import { kmFmt } from "@/lib/format";
import { scrollIntoNearestContainer } from "@/lib/scroll";

interface ContextStationsTableProps {
  stations: NearbyStation[];
  focusedStation?: string | null;
  promoteFocused?: boolean;
  onSelectStation?: (station: NearbyStation) => void;
}

export function ContextStationsTable({
  stations,
  focusedStation,
  promoteFocused = false,
  onSelectStation,
}: ContextStationsTableProps) {
  const rowRefs = useRef<Record<string, HTMLTableRowElement | null>>({});
  const sorted = [...stations].sort((a, b) => {
    if (promoteFocused && focusedStation) {
      if (a.network_station === focusedStation) return -1;
      if (b.network_station === focusedStation) return 1;
    }
    return a.distance_km - b.distance_km;
  });

  useEffect(() => {
    if (!focusedStation) return;
    const timer = window.setTimeout(() => {
      const row = rowRefs.current[focusedStation];
      if (!row) return;
      scrollIntoNearestContainer(row);
    }, 120);

    return () => window.clearTimeout(timer);
  }, [focusedStation, promoteFocused]);

  if (sorted.length === 0) {
    return (
      <p className="py-6 text-center text-xs text-[var(--color-muted)]">
        No nearby seismic stations found within this radius.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <THead>
          <TR>
            <TH>Network</TH>
            <TH>Code</TH>
            <TH>Name</TH>
            <TH className="text-right">Dist (km)</TH>
            <TH className="text-right">Lat</TH>
            <TH className="text-right">Lon</TH>
          </TR>
        </THead>
        <TBody>
          {sorted.map((s) => {
            const isFocused = focusedStation === s.network_station;
            const isPromotedFocused = promoteFocused && isFocused;
            const canFocus = Boolean(!isPromotedFocused && onSelectStation);

            return (
              <TR
                key={s.network_station}
                ref={(node) => {
                  rowRefs.current[s.network_station] = node;
                }}
                aria-selected={isFocused}
                tabIndex={canFocus ? 0 : undefined}
                onClick={canFocus ? () => onSelectStation?.(s) : undefined}
                onKeyDown={
                  canFocus
                    ? (event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          onSelectStation?.(s);
                        }
                      }
                    : undefined
                }
                className={[
                  canFocus
                    ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-accent)]"
                    : "",
                  isFocused
                    ? "bg-[color-mix(in_oklch,var(--color-station)_12%,transparent)]"
                    : "",
                ].join(" ")}
              >
                <TD className="font-mono text-[11px]">{s.network}</TD>
                <TD className="font-mono text-[11px]">{s.station_code}</TD>
                <TD className="max-w-[160px] truncate text-[11px]">
                  {s.site_name ?? "-"}
                </TD>
                <TD className="text-right">{kmFmt(s.distance_km)}</TD>
                <TD className="text-right font-mono text-[11px]">
                  {s.latitude.toFixed(4)}
                </TD>
                <TD className="text-right font-mono text-[11px]">
                  {s.longitude.toFixed(4)}
                </TD>
              </TR>
            );
          })}
        </TBody>
      </Table>
    </div>
  );
}
