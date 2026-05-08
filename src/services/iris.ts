import { qs, request } from "@/lib/http";
import type { IrisStation, Paginated } from "@/types/api";

export interface StationFilters {
  page?: number;
  page_size?: number;
  network?: string;
  active_only?: boolean;
}

export const irisService = {
  listStations: (filters: StationFilters = {}) =>
    request<Paginated<IrisStation>>(
      `/seismic/iris/stations${qs(filters as Record<string, unknown>)}`,
    ),
};
