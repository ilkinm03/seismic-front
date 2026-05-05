import { useSyncHistory } from "@/queries/useSyncHistory";
import { TriggerPanel } from "@/components/domain/TriggerPanel";
import { SyncHistoryTable } from "@/components/domain/SyncHistoryTable";
import { FracSyncStatusCard } from "@/components/domain/FracSyncStatusCard";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";

export function DashboardPage() {
  const history = useSyncHistory({});
  const runs = history.data?.items ?? [];

  return (
    <div className="mx-auto max-w-[1400px] h-full overflow-y-auto space-y-8 p-8">
      {/* Premium Header */}
      <div className="flex items-end justify-between border-b border-[var(--color-border)] pb-6">
        <div>
          <h1 className="font-display text-4xl font-black tracking-tight text-[var(--color-fg)]">
            System Operations
          </h1>
          <p className="mt-2 text-sm font-medium text-[var(--color-muted)]">
            Real-time synchronization engine and data ingestion pipelines.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)]">Engine Status</span>
            <span className="flex items-center gap-2 text-xs font-bold text-status-success">
              <span className="h-2 w-2 rounded-full bg-status-success animate-pulse" />
              Operational
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Top Left: FracFocus Sync */}
        <div className="flex flex-col">
          <FracSyncStatusCard />
        </div>

        {/* Top Right: Trigger Panel */}
        <div className="flex flex-col">
          <TriggerPanel recentRuns={runs} />
        </div>
      </div>

      {/* Bottom: Sync History Table */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-fg)]/5 text-[var(--color-fg)]">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-[var(--color-fg)]">Synchronization History</h2>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)]">Audit log of all data pipeline activity</p>
            </div>
          </div>
          <div className="rounded-full bg-[var(--color-card-elevated)] border border-[var(--color-border)] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[var(--color-muted)] shadow-sm">
            Last {runs.length} runs
          </div>
        </div>
        
        <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden shadow-sm">
          {history.isError ? (
            <div className="p-12">
              <ErrorState title="Could not fetch synchronization history" description={String(history.error)} />
            </div>
          ) : history.isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <SyncHistoryTable runs={runs} />
          )}
        </div>
      </div>
    </div>
  );
}
