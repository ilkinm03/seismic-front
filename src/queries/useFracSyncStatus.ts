import { useQuery } from "@tanstack/react-query";
import { qk } from "@/queries/keys";
import { syncService } from "@/services/sync";

export function useFracSyncStatus() {
  return useQuery({
    queryKey: qk.sync.fracStatus(),
    queryFn: () => syncService.fracStatus(),
    refetchInterval: 30_000,
  });
}
