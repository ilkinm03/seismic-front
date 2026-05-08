import { Button } from "@/components/ui/Button";
import { totalPages as totalPagesFn } from "@/types/pagination";

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
}: PaginationProps) {
  const tp = totalPagesFn(total, pageSize);
  const canPrev = page > 1;
  const canNext = page < tp;
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col">
        <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)]">
          Page
        </div>
        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[var(--color-fg)]">
          <span>{page}</span>
          <span className="opacity-30">/</span>
          <span className="opacity-50">{tp}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="mr-2 hidden text-right sm:block">
          <div className="text-[9px] font-medium text-[var(--color-muted)]">
            Showing
          </div>
          <div className="font-mono text-[10px] font-bold text-[var(--color-fg)]">
            {start}-{end} <span className="opacity-40">of</span>{" "}
            {total.toLocaleString()}
          </div>
        </div>

        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0"
            disabled={!canPrev}
            onClick={() => onPageChange(page - 1)}
          >
            ←
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0"
            disabled={!canNext}
            onClick={() => onPageChange(page + 1)}
          >
            →
          </Button>
        </div>
      </div>
    </div>
  );
}
