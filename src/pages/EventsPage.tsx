import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "@/queries/useEvents";
import { EventsTable } from "@/components/domain/EventsTable";
import { EventsMap } from "@/components/domain/EventsMap";
import { EventFiltersBar } from "@/components/domain/EventFiltersBar";
import { Pagination } from "@/components/ui/Pagination";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { eventLocationLabel } from "@/lib/format";
import type { EventFilters } from "@/types/api";

import { useTheme } from "@/lib/theme";

const PAGE_SIZE = 50;

export function EventsPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<EventFilters>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [localSearch, setLocalSearch] = useState("");

  const query = useEvents({ page, page_size: PAGE_SIZE, ...filters });
  const events = query.data?.items ?? [];
  const total = query.data?.total ?? 0;

  function handleFilterChange(next: EventFilters) {
    setFilters(next);
    setPage(1);
    setSelectedId(null);
  }

  function handleSelect(id: string) {
    setSelectedId(id);
    navigate(`/events/${id}`);
  }

  const filteredEvents = events.filter((ev) =>
    ev.event_id.toLowerCase().includes(localSearch.toLowerCase()) ||
    eventLocationLabel(ev).toLowerCase().includes(localSearch.toLowerCase())
  );

  return (
    <div className="flex h-full w-full bg-[var(--color-bg)]">
      {/* Left Area: Map + Floating Filters */}
      <div className="relative flex-[3] h-full overflow-hidden border-r border-[var(--color-border)]/50">
        <EventsMap
          events={events}
          selectedId={selectedId}
          onSelect={handleSelect}
        />

        {/* Floating Headers */}
        <div className="pointer-events-none absolute left-8 top-8 z-20">
          <h1 className={`font-display text-3xl font-black tracking-tight drop-shadow-sm ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Seismic Events
          </h1>
          <p className={`text-[10px] font-black uppercase tracking-[.25em] mt-1.5 ${
            theme === 'dark' ? 'text-neutral-400' : 'text-slate-500'
          }`}>
            Delaware Basin Catalog
          </p>
        </div>

        <div className="absolute left-8 bottom-8 z-20 w-[300px]">
          <div className={`rounded-2xl shadow-2xl border overflow-hidden backdrop-blur-xl transition-colors duration-500 ${
            theme === 'dark' 
              ? 'bg-neutral-900/80 border-white/10' 
              : 'bg-slate-50/85 border-slate-200'
          }`}>
            <EventFiltersBar
              filters={filters}
              onChange={handleFilterChange}
              onReset={() => {
                setFilters({});
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Right Area: List Sidebar */}
      <div className="flex-[1] min-w-[420px] flex flex-col bg-[var(--color-card-elevated)] h-full overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-[var(--color-border)]/50 bg-[var(--color-card)] px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[var(--color-fg)]">Latest Activity</h3>
              <p className="text-[10px] font-medium text-[var(--color-muted)] mt-0.5 uppercase tracking-wider">
                {total.toLocaleString()} catalog events
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-status-running animate-pulse" />
              <span className="text-[10px] font-bold text-[var(--color-muted)] uppercase tracking-tighter">Live Monitor</span>
            </div>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Filter by ID or Location..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card-elevated)] px-4 py-2 text-xs text-[var(--color-fg)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-[var(--color-card-elevated)]/50">
          {query.isError ? (
            <div className="p-8">
              <ErrorState title="Failed to load events" description={String(query.error)} />
            </div>
          ) : query.isLoading ? (
            <div className="space-y-4 p-6">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <EventsTable
              events={filteredEvents}
              selectedId={selectedId}
              onSelect={handleSelect}
            />
          )}
        </div>

        {total > PAGE_SIZE && (
          <div className="p-5 border-t border-[var(--color-border)]/50 bg-[var(--color-card)]">
            <Pagination
              page={page}
              pageSize={PAGE_SIZE}
              total={total}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}



