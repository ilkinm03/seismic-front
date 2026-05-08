import { QueryCache, QueryClient, MutationCache } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError, NetworkError } from "@/lib/http";

function describe(error: unknown): string {
  if (error instanceof ApiError) return error.detail;
  if (error instanceof NetworkError)
    return "Backend unreachable — is python main.py running?";
  if (error instanceof Error) return error.message;
  return "Unknown error";
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: (count, error) => {
          if (
            error instanceof ApiError &&
            (error.status === 404 || error.status === 400)
          )
            return false;
          return count < 2;
        },
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
    queryCache: new QueryCache({
      onError(error, query) {
        if (query.meta && (query.meta as { silent?: boolean }).silent) return;
        toast.error(describe(error));
      },
    }),
    mutationCache: new MutationCache({
      onError(error, _vars, _ctx, mutation) {
        if (mutation.meta && (mutation.meta as { silent?: boolean }).silent)
          return;
        toast.error(describe(error));
      },
    }),
  });
}
