import type { SyncRun } from "@/types/api";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { StatusBadge, SourceLabel } from "@/components/domain/StatusBadge";
import { dateTimeFmt, elapsedSince, numberFmt } from "@/lib/format";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

function durationFor(run: SyncRun): string {
  if (!run.started_at) return "—";
  if (!run.finished_at) return elapsedSince(run.started_at);
  const a = Date.parse(run.started_at);
  const b = Date.parse(run.finished_at);
  if (Number.isNaN(a) || Number.isNaN(b)) return "—";
  const ms = Math.max(0, b - a);
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return `${m}m ${s % 60}s`;
}

export function SyncHistoryTable({
  runs,
  loading,
}: {
  runs: SyncRun[];
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="space-y-4 p-8">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!runs.length) {
    return (
      <div className="py-20">
        <EmptyState
          title="No synchronization records yet"
          description="Start a data load from the ingestion panel above."
        />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <THead className="bg-[var(--color-card-elevated)]/50">
          <TR>
            <TH className="px-6 py-4">Source</TH>
            <TH className="px-6 py-4">Status</TH>
            <TH className="px-6 py-4 text-right">Rows Added</TH>
            <TH className="px-6 py-4 text-right">Rows Updated</TH>
            <TH className="px-6 py-4">Started At</TH>
            <TH className="px-6 py-4 text-right">Duration</TH>
          </TR>
        </THead>
        <TBody className="divide-y divide-[var(--color-border)]/20">
          {runs.map((run) => (
            <TR
              key={run.id}
              className="transition-colors hover:bg-[var(--color-fg)]/[0.02]"
            >
              <TD className="px-6 py-4">
                <SourceLabel source={run.source} />
              </TD>
              <TD className="px-6 py-4">
                <StatusBadge status={run.status} />
              </TD>
              <TD className="px-6 py-4 text-right font-mono text-xs font-semibold text-[var(--color-fg)]">
                {numberFmt(run.rows_inserted)}
              </TD>
              <TD className="px-6 py-4 text-right font-mono text-xs font-semibold text-[var(--color-fg)]">
                {numberFmt(run.rows_updated)}
              </TD>
              <TD className="px-6 py-4 font-mono text-[11px] text-[var(--color-muted)]">
                {dateTimeFmt(run.started_at)}
              </TD>
              <TD className="px-6 py-4 text-right font-mono text-[11px] font-medium text-[var(--color-muted)]">
                {durationFor(run)}
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
