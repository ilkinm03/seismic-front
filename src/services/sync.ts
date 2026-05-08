import { qs, request } from "@/lib/http";
import type {
  FracSyncStatus,
  FracTriggerResponse,
  SyncFetchSummary,
  SyncHistoryResponse,
  SyncSource,
  SyncStatus,
} from "@/types/api";

export interface SyncHistoryParams {
  source?: SyncSource | string;
  status?: SyncStatus | string;
  limit?: number;
}

export const syncService = {
  history: (params: SyncHistoryParams = {}) =>
    request<SyncHistoryResponse>(
      `/sync/history${qs(params as Record<string, unknown>)}`,
    ),

  fracStatus: () => request<FracSyncStatus>(`/sync/status`),

  triggerFracFocus: () =>
    request<FracTriggerResponse>(`/sync/trigger`, { method: "POST" }),

  triggerTexNet: (minMagnitude?: number) =>
    request<SyncFetchSummary>(
      `/seismic/texnet/fetch${qs({ min_magnitude: minMagnitude })}`,
      { method: "POST" },
    ),

  triggerUSGS: (minMagnitude?: number) =>
    request<SyncFetchSummary>(
      `/seismic/usgs/fetch${qs({ min_magnitude: minMagnitude })}`,
      { method: "POST" },
    ),

  triggerIRIS: () =>
    request<SyncFetchSummary>(`/seismic/iris/stations/fetch`, {
      method: "POST",
    }),

  triggerUIC: () =>
    request<SyncFetchSummary>(`/swd/uic/fetch`, { method: "POST" }),

  triggerH10: () =>
    request<SyncFetchSummary>(`/swd/h10/fetch`, { method: "POST" }),
};

/** /health is outside /api/v1 prefix. */
export const healthService = {
  check: () => request<{ status: string }>(`/health`, { prefix: "" }),
};
