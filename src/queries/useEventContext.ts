import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { qk } from "@/queries/keys";
import { analysisService } from "@/services/analysis";
import type { AnalysisParams, EventContext } from "@/types/api";

export interface UseEventContextOptions {
  enabled?: boolean;
}

/**
 * Read-only context (preview) for an event.
 *
 * The query is only fired when `options.enabled` is true (i.e. the user has clicked
 * "Preview Context" or "Run Analysis" at least once). Param changes refire the query.
 */
export function useEventContext(
  eventId: string | undefined,
  params: Partial<AnalysisParams>,
  options: UseEventContextOptions = {},
) {
  return useQuery<EventContext>({
    queryKey: qk.analysis.context(eventId ?? "", params),
    queryFn: () => analysisService.getContext(eventId!, params),
    enabled: !!eventId && options.enabled !== false,
    placeholderData: keepPreviousData,
  });
}
