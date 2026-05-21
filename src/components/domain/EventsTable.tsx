import type { SeismicEvent } from "@/types/api";
import { MagnitudePill } from "@/components/domain/MagnitudePill";
import { SourceBadge } from "@/components/domain/SourceBadge";
import { dateTimeFmt, eventLocationLabel, kmFmt } from "@/lib/format";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/cn";

export interface EventsTableProps {
  events: SeismicEvent[];
  loading?: boolean;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  emptyHint?: string;
}

export function EventsTable({
  events,
  loading,
  selectedId,
  onSelect,
  emptyHint = "Load seismic events from TexNet or USGS pipelines first.",
}: EventsTableProps) {
  if (loading) {
    return (
      <div className="space-y-4 p-5">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2 py-1">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!events.length) {
    return (
      <EmptyState title="No seismic events found" description={emptyHint} />
    );
  }

  return (
    <div className="divide-y divide-[var(--color-border)]/30">
      {events.map((ev) => {
        const isSelected = ev.event_id === selectedId;
        const location = eventLocationLabel(ev);

        return (
          <button
            key={ev.event_id}
            onClick={() => onSelect?.(ev.event_id)}
            className={cn(
              "flex w-full items-center gap-4 px-6 py-4 text-left transition-all duration-200 hover:bg-[var(--color-fg)]/5",
              isSelected
                ? "bg-[var(--color-accent)]/10 ring-1 ring-inset ring-[var(--color-accent)]/30"
                : "bg-transparent",
            )}
          >
            {/* Left: Magnitude Pill */}
            <div className="shrink-0">
              <MagnitudePill magnitude={ev.magnitude} magType={ev.mag_type} />
            </div>

            {/* Center: Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate font-mono text-xs font-bold text-[var(--color-fg)]">
                  {ev.event_id}
                </span>
                {isSelected && (
                  <span className="rounded-full bg-[var(--color-accent)] px-1.5 py-0.5 text-[8px] font-black uppercase text-white">
                    Selected
                  </span>
                )}
              </div>
              <div className="mt-0.5 truncate text-[11px] text-[var(--color-muted)]">
                {location}
              </div>
            </div>

            {/* Right: Meta */}
            <div className="flex flex-col items-end gap-1.5 text-right">
              <div className="font-mono text-[10px] font-medium text-[var(--color-muted)]">
                {dateTimeFmt(ev.event_date, { timeZone: false })}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-[var(--color-subtle)]">
                  {kmFmt(ev.depth)}
                </span>
                <SourceBadge source={ev.source} />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
