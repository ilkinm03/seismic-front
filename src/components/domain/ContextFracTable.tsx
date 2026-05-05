import type { NearbyFracJob } from "@/types/api";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/Table";
import { dateFmt, kmFmt, galFmt } from "@/lib/format";

export function ContextFracTable({ jobs }: { jobs: NearbyFracJob[] }) {
  const sorted = [...jobs].sort((a, b) => a.distance_km - b.distance_km);

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
          {sorted.map((j, i) => (
            <TR key={j.api_number ?? i}>
              <TD className="font-mono text-[11px]">{j.api_number ?? "—"}</TD>
              <TD className="max-w-[140px] truncate text-[11px]">{j.operator_name ?? "—"}</TD>
              <TD className="text-[10px] font-mono text-[var(--color-muted)] whitespace-nowrap">
                {j.job_start_date ? (
                  <>
                    {j.job_start_date}
                    {j.job_end_date && j.job_end_date !== j.job_start_date && (
                      <span className="opacity-50"> → {j.job_end_date}</span>
                    )}
                  </>
                ) : (
                  "—"
                )}
              </TD>
              <TD className="text-right">{kmFmt(j.distance_km)}</TD>
              <TD className="text-right">
                {j.total_water_volume != null ? galFmt(j.total_water_volume) : "—"}
              </TD>
              <TD className="text-right">
                {j.formation_depth != null ? j.formation_depth.toLocaleString() : "—"}
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
