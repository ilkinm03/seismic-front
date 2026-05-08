import type { AnalysisParams, EventFilters } from "@/types/api";
import type { FracFilters } from "@/services/fracfocus";
import type { MonitoringFilters, WellFilters } from "@/services/swd";
import type { StationFilters } from "@/services/iris";
import type { SyncHistoryParams } from "@/services/sync";

/**
 * Centralised query-key factory. Always import from here so invalidation patterns stay consistent.
 *
 *   queryClient.invalidateQueries({ queryKey: ['sync','history'] })   // any history query
 *   queryClient.invalidateQueries({ queryKey: qk.analysis.context('tx2024abc', {}) }) // exact
 */
export const qk = {
  health: () => ["health"] as const,
  sync: {
    all: () => ["sync"] as const,
    history: (filters: SyncHistoryParams = {}) =>
      ["sync", "history", filters] as const,
    fracStatus: () => ["sync", "fracStatus"] as const,
  },
  events: {
    all: () => ["events"] as const,
    list: (filters: EventFilters) => ["events", "list", filters] as const,
  },
  wells: {
    all: () => ["wells"] as const,
    list: (filters: WellFilters) => ["wells", "list", filters] as const,
    monitoring: (filters: MonitoringFilters) =>
      ["wells", "monitoring", filters] as const,
  },
  frac: {
    all: () => ["frac"] as const,
    list: (filters: FracFilters) => ["frac", "list", filters] as const,
    columns: () => ["frac", "columns"] as const,
    distinct: (column: string) => ["frac", "distinct", column] as const,
    stats: () => ["frac", "stats"] as const,
  },
  stations: {
    all: () => ["stations"] as const,
    list: (filters: StationFilters) => ["stations", "list", filters] as const,
  },
  analysis: {
    all: () => ["analysis"] as const,
    context: (eventId: string, params: Partial<AnalysisParams>) =>
      ["analysis", "context", eventId, params] as const,
  },
} as const;
