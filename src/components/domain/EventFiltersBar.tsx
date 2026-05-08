import { useState } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { EventFilters } from "@/types/api";

const COUNTIES = ["Reeves", "Loving", "Culberson", "Ward", "Winkler", "Pecos"];

export interface EventFiltersBarProps {
  filters: EventFilters;
  onChange: (next: EventFilters) => void;
  onReset?: () => void;
}

export function EventFiltersBar({
  filters,
  onChange,
  onReset,
}: EventFiltersBarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const set = <K extends keyof EventFilters>(key: K, value: EventFilters[K]) =>
    onChange({ ...filters, [key]: value, page: 1 });

  return (
    <Card className="border-0 shadow-none">
      {/* Header / Toggle Button */}
      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-[var(--color-fg)]/5"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path
                fillRule="evenodd"
                d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.739z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--color-fg)]">
              Filters
            </h3>
            <p className="text-[10px] text-[var(--color-muted)]">
              {isCollapsed ? "Click to expand" : "List and map update together"}
            </p>
          </div>
        </div>
        <div
          className={cn(
            "transition-transform duration-200",
            isCollapsed ? "" : "rotate-180",
          )}
        >
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5 opacity-40"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </button>

      {/* Collapsible Body */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isCollapsed ? "max-h-0 opacity-0" : "max-h-[500px] opacity-100",
        )}
      >
        <CardBody className="space-y-4 border-t border-[var(--color-border)]/20 px-5 pb-6 pt-5">
          <div>
            <Label>Source</Label>
            <Select
              value={filters.source ?? ""}
              onChange={(e) =>
                set(
                  "source",
                  (e.target.value || undefined) as EventFilters["source"],
                )
              }
            >
              <option value="">All (TexNet + USGS)</option>
              <option value="texnet">TexNet</option>
              <option value="usgs">USGS</option>
            </Select>
          </div>

          <div>
            <Label>County (TexNet)</Label>
            <Select
              value={filters.county ?? ""}
              onChange={(e) => set("county", e.target.value || undefined)}
            >
              <option value="">All Counties</option>
              {COUNTIES.map((c) => (
                <option key={c} value={c.toLowerCase()}>
                  {c}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <Label>Min magnitude</Label>
              <span className="font-mono text-xs text-[var(--color-fg)]">
                M{(filters.min_magnitude ?? 0).toFixed(1)}
              </span>
            </div>
            <Slider
              min={0}
              max={7}
              step={0.1}
              value={filters.min_magnitude ?? 0}
              onValueChange={(v) =>
                set("min_magnitude", v === 0 ? undefined : v)
              }
              ariaLabel="Minimum magnitude"
            />
          </div>

          <div>
            <Label>Page size</Label>
            <Select
              value={String(filters.page_size ?? 50)}
              onChange={(e) => set("page_size", Number(e.target.value))}
            >
              {[25, 50, 100, 200].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </Select>
          </div>

          <Input
            placeholder="Search by Event ID…"
            disabled
            title="Server-side event ID search not implemented"
          />

          {onReset ? (
            <Button variant="ghost" size="sm" onClick={onReset} fullWidth>
              Reset Filters
            </Button>
          ) : null}
        </CardBody>
      </div>
    </Card>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[.08em] text-[var(--color-muted)]">
      {children}
    </p>
  );
}
