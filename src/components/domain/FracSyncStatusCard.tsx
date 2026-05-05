import { useState } from "react";
import { useFracSyncStatus } from "@/queries/useFracSyncStatus";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { StatusBadge } from "@/components/domain/StatusBadge";
import { numberFmt, relativeTime, dateTimeFmt } from "@/lib/format";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export function FracSyncStatusCard() {
  const { data, isLoading } = useFracSyncStatus();
  const [open, setOpen] = useState(false);

  return (
    <Card className="h-full border-[var(--color-border)]/40 shadow-sm transition-shadow hover:shadow-md">
      <CardHeader 
        title="FracFocus Sync" 
        subtitle="Monthly registry synchronization status" 
      />
      <CardBody className="space-y-6">
        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full rounded-2xl" />
              <Skeleton className="h-20 w-full rounded-2xl" />
            </div>
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        ) : (
          <>
            {/* Unified Status Section */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col justify-between rounded-2xl border border-[var(--color-border)]/60 bg-[var(--color-card-elevated)] p-4 transition-colors hover:border-[var(--color-accent)]/20">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)]">
                    Latest Status
                  </span>
                  <div className="h-2 w-2 rounded-full bg-[var(--color-status-success)] shadow-[0_0_8px_var(--color-status-success)]" />
                </div>
                <div className="mt-3">
                  <StatusBadge status={data?.last_sync_status ?? "pending"} />
                </div>
              </div>
              
              <div className="rounded-2xl border border-[var(--color-border)]/60 bg-[var(--color-card-elevated)] p-4 transition-colors hover:border-[var(--color-accent)]/20">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)]">
                  Last Update
                </span>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-xl font-black tracking-tight text-[var(--color-fg)]">
                    {data?.last_sync_at ? relativeTime(data.last_sync_at).split(' ')[0] : "—"}
                  </span>
                  <span className="text-xs font-bold text-[var(--color-muted)] lowercase">
                    {data?.last_sync_at ? relativeTime(data.last_sync_at).split(' ').slice(1).join(' ') : ""}
                  </span>
                </div>
                {data?.last_sync_at && (
                  <div className="mt-1 font-mono text-[9px] font-medium text-[var(--color-subtle)]">
                    {dateTimeFmt(data.last_sync_at)}
                  </div>
                )}
              </div>
            </div>

            {/* Manifest & Meta Section */}
            <div className="rounded-2xl border border-[var(--color-border)]/60 bg-[var(--color-card)] overflow-hidden">
              <div className="flex items-center justify-between border-b border-[var(--color-border)]/40 bg-[var(--color-card-elevated)]/50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
                      <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm2.25 8.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 3a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-[var(--color-fg)]">
                    Manifest <span className="ml-1 text-[var(--color-muted)]">({data?.csv_files?.length ?? 0})</span>
                  </span>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-7 rounded-lg px-2 text-[10px] font-bold uppercase hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-accent)]"
                  onClick={() => setOpen(!open)}
                >
                  {open ? "Collapse" : "View Files"}
                </Button>
              </div>
              
              <div className={cn(
                "overflow-hidden transition-all duration-500 ease-in-out",
                open ? "max-h-[300px]" : "max-h-0"
              )}>
                <div className="max-h-[240px] overflow-y-auto p-2">
                  {data?.csv_files?.map((f) => (
                    <div key={f.filename} className="group flex items-center justify-between rounded-lg px-3 py-2 text-[11px] transition-colors hover:bg-[var(--color-accent)]/5">
                      <span className="font-mono truncate text-[var(--color-muted)] group-hover:text-[var(--color-fg)]" title={f.filename}>
                        {f.filename}
                      </span>
                      <span className="ml-4 font-mono font-black text-[var(--color-accent)]">
                        {numberFmt(f.row_count)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sticky ETag Footer inside the same block */}
              {data?.etag && (
                <div className="border-t border-[var(--color-border)]/40 bg-[var(--color-card-elevated)]/30 px-4 py-2.5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="shrink-0 text-[9px] font-bold uppercase tracking-widest text-[var(--color-subtle)]">Registry ETag</span>
                    <span className="font-mono text-[9px] text-[var(--color-muted)] truncate select-all">{data.etag}</span>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
}
