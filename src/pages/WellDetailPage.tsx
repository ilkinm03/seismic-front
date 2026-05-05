import { EmptyState } from "@/components/ui/EmptyState";

export function WellDetailPage() {
  return (
    <div className="flex h-full items-center justify-center">
      <EmptyState
        title="Coming in Phase 2"
        description="Service + types + map layer hooks already wired; only the page UI remains."
      />
    </div>
  );
}
