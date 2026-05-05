import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { qk } from "@/queries/keys";
import { analysisService } from "@/services/analysis";
import type { AnalysisParams, EventAnalysisResponse } from "@/types/api";

/**
 * Run the attribution engine for an event. On success:
 *   1. Warm the matching context cache so the map / tables don't refetch.
 *   2. Toast the snapshot id.
 *   3. Caller receives the full `{snapshot_id, context, attribution}` for rendering.
 */
export function useAnalyzeEvent(eventId: string | undefined) {
  const qc = useQueryClient();

  return useMutation<EventAnalysisResponse, Error, Partial<AnalysisParams>>({
    mutationFn: (params) => {
      if (!eventId) throw new Error("Event id is required.");
      return analysisService.runAnalysis(eventId, params);
    },
    onSuccess: (res, params) => {
      if (eventId) {
        qc.setQueryData(qk.analysis.context(eventId, params), res.context);
      }
      toast.success(`Analysis saved — snapshot #${res.snapshot_id}`);
    },
  });
}
