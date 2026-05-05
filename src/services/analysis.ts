import { qs, request } from "@/lib/http";
import type { AnalysisParams, EventAnalysisResponse, EventContext } from "@/types/api";

export const analysisService = {
  getContext: (eventId: string, params: Partial<AnalysisParams> = {}) =>
    request<EventContext>(
      `/analysis/events/${encodeURIComponent(eventId)}/context${qs(params as Record<string, unknown>)}`,
    ),

  runAnalysis: (eventId: string, params: Partial<AnalysisParams> = {}) =>
    request<EventAnalysisResponse>(
      `/analysis/events/${encodeURIComponent(eventId)}/analyze${qs(params as Record<string, unknown>)}`,
      { method: "POST" },
    ),
};
