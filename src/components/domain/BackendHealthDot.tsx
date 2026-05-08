import { useHealth } from "@/queries/useHealth";
import { Dot } from "@/components/ui/Dot";
import { Tooltip } from "@/components/ui/Tooltip";

export function BackendHealthDot() {
  const { data, isError, isFetching } = useHealth();
  const healthy = !isError && !!data && data.status === "ok";
  const color = healthy
    ? "var(--color-status-success)"
    : isFetching
      ? "var(--color-status-pending)"
      : "var(--color-status-failed)";
  const message = healthy
    ? "Backend OK (localhost:8000)"
    : "Backend unreachable — start `python main.py` in fracfocus_data_fetch";

  return (
    <Tooltip content={message}>
      <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
        <Dot color={color} pulse={!healthy} size={7} />
        <span className="hidden font-mono sm:inline">
          {healthy ? "API up" : "API down"}
        </span>
      </span>
    </Tooltip>
  );
}
