import type { NearbyStation } from "@/types/api";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/Table";
import { kmFmt } from "@/lib/format";

export function ContextStationsTable({ stations }: { stations: NearbyStation[] }) {
  const sorted = [...stations].sort((a, b) => a.distance_km - b.distance_km);

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
          {sorted.map((s) => (
            <TR key={s.network_station}>
              <TD className="font-mono text-[11px]">{s.network}</TD>
              <TD className="font-mono text-[11px]">{s.station_code}</TD>
              <TD className="max-w-[160px] truncate text-[11px]">{s.site_name ?? "—"}</TD>
              <TD className="text-right">{kmFmt(s.distance_km)}</TD>
              <TD className="text-right font-mono text-[11px]">{s.latitude.toFixed(4)}</TD>
              <TD className="text-right font-mono text-[11px]">{s.longitude.toFixed(4)}</TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
