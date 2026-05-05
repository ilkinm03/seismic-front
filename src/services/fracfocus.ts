import { qs, request } from "@/lib/http";
import type {
  FracColumnsResponse,
  FracDistinctResponse,
  FracGroupResponse,
  FracJob,
  FracStatsResponse,
  Paginated,
} from "@/types/api";

export interface FracFilters {
  page?: number;
  page_size?: number;
  state?: string;
  operator?: string;
}

export const fracfocusService = {
  listJobs: (filters: FracFilters = {}) =>
    request<Paginated<FracJob>>(`/data/${qs(filters as Record<string, unknown>)}`),

  getColumns: () => request<FracColumnsResponse>(`/data/columns`),

  getDistinct: (column: string) =>
    request<FracDistinctResponse>(`/data/distinct/${encodeURIComponent(column)}`),

  getGroup: (column: string) =>
    request<FracGroupResponse>(`/data/group/${encodeURIComponent(column)}`),

  getStats: () => request<FracStatsResponse>(`/data/stats`),
};
