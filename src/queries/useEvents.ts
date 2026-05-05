import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { qk } from "@/queries/keys";
import { seismicService } from "@/services/seismic";
import type { EventFilters, Paginated, SeismicEvent } from "@/types/api";

export function useEvents(filters: EventFilters) {
  return useQuery<Paginated<SeismicEvent>>({
    queryKey: qk.events.list(filters),
    queryFn: () => seismicService.listEvents(filters),
    placeholderData: keepPreviousData,
  });
}
