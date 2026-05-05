import { qs, request } from "@/lib/http";
import type { EventFilters, Paginated, SeismicEvent } from "@/types/api";

export const seismicService = {
  listEvents: (filters: EventFilters = {}) =>
    request<Paginated<SeismicEvent>>(`/seismic/events${qs(filters as Record<string, unknown>)}`),
};
