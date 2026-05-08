import { useQuery } from "@tanstack/react-query";
import { qk } from "@/queries/keys";
import { syncService, type SyncHistoryParams } from "@/services/sync";
import type { SyncHistoryResponse } from "@/types/api";

export function useSyncHistory(params: SyncHistoryParams = {}) {
  return useQuery<SyncHistoryResponse>({
    queryKey: qk.sync.history(params),
    queryFn: () => syncService.history(params),
    // Poll every 5s while a RECENT row is "running" or "pending".
    // Prevents non-stop polling for zombie tasks that never finished.
    // Poll every 5s ONLY if the most recent task is still "running" or "pending"
    // AND it was started in the last 15 minutes.
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data || !data.items.length) return false;

      const latest = data.items[0];
      const isRunning =
        latest.status === "running" || latest.status === "pending";
      if (!isRunning) return false;

      const started = latest.started_at
        ? Date.parse(latest.started_at)
        : Date.parse(latest.created_at);
      const now = Date.now();
      const isRecent = now - started < 15 * 60 * 1000; // 15 minute timeout

      return isRecent ? 5000 : false;
    },
  });
}
