import { useQuery } from "@tanstack/react-query";
import { qk } from "@/queries/keys";
import { healthService } from "@/services/sync";

export function useHealth() {
  return useQuery({
    queryKey: qk.health(),
    queryFn: () => healthService.check(),
    refetchInterval: 15_000,
    retry: false,
    meta: { silent: true },
  });
}
