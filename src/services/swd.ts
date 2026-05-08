import { qs, request } from "@/lib/http";
import type { H10Record, Paginated, SwdWell } from "@/types/api";

export interface WellFilters {
  page?: number;
  page_size?: number;
}

export interface MonitoringFilters {
  uic_no: string;
  page?: number;
  page_size?: number;
}

export const swdService = {
  listWells: (filters: WellFilters = {}) =>
    request<Paginated<SwdWell>>(
      `/swd/wells${qs(filters as Record<string, unknown>)}`,
    ),

  getMonitoring: (filters: MonitoringFilters) =>
    request<Paginated<H10Record>>(
      `/swd/monitoring${qs(filters as unknown as Record<string, unknown>)}`,
    ),
};
