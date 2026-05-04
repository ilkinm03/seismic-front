import React, { useMemo, useState } from "react";
import type { SeismicEvent } from "../mock/data";
import { magColor, magLabel } from "../lib/seismic";
import { Pill, Sep } from "./ui";

export default function EventList({
  events,
  selectedId,
  onSelect,
  disabled,
  state,
  errorMessage,
}: {
  events: SeismicEvent[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  disabled: boolean;
  state: "loading" | "ready" | "empty" | "error";
  errorMessage: string | null;
}) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return events;
    return events.filter(
      (e) => e.location.toLowerCase().includes(query) || e.id.toLowerCase().includes(query),
    );
  }, [events, q]);

  const highCount = events.filter((e) => e.mag >= 4).length;
  const moderateCount = events.filter((e) => e.mag >= 3 && e.mag < 4).length;

  return (
    <aside className="w-[280px] shrink-0 border-r border-zinc-200 bg-white">
      <div className="px-3.5 pb-2 pt-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[.1em] text-zinc-400">
            Seismic Events
          </span>
          <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-[1px] font-mono text-[10px] text-zinc-400">
            {filtered.length}
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgb(161 161 170)" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search events..."
            className="w-full bg-transparent text-[12px] text-zinc-950 outline-none placeholder:text-zinc-400"
          />
          {q ? (
            <button
              type="button"
              onClick={() => setQ("")}
              className="text-zinc-400 hover:text-zinc-600"
              aria-label="Clear search"
            >
              ×
            </button>
          ) : null}
        </div>
      </div>

      <Sep />

      <div className="h-[calc(100dvh-48px-26px-66px)] overflow-y-auto">
        {state === "loading" ? (
          <div className="space-y-2 p-3.5">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="h-[68px] rounded-lg border border-zinc-200 bg-zinc-50 p-3">
                <div className="mb-2 h-3 w-2/3 rounded bg-zinc-200" />
                <div className="h-2 w-1/2 rounded bg-zinc-200" />
              </div>
            ))}
          </div>
        ) : null}

        {state === "error" ? (
          <div className="p-3.5">
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-[12px] font-semibold text-red-800">Could not load events</p>
              <p className="mt-1 text-[11px] leading-5 text-red-700">{errorMessage ?? "Event list endpoint failed."}</p>
            </div>
          </div>
        ) : null}

        {state === "empty" || (state === "ready" && filtered.length === 0) ? (
          <div className="p-3.5">
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-[12px] leading-6 text-zinc-500">
              No seismic events available for the current filter.
            </div>
          </div>
        ) : null}

        {state === "ready" ? filtered.map((ev) => {
          const selected = ev.id === selectedId;
          const label = magLabel(ev.mag);
          return (
            <button
              key={ev.id}
              type="button"
              onClick={() => !disabled && onSelect(ev.id)}
              disabled={disabled && !selected}
              className={[
                "group w-full border-b border-zinc-200 px-3.5 py-3 text-left transition",
                selected ? "bg-zinc-50" : "bg-white hover:bg-zinc-50",
                disabled && !selected ? "cursor-not-allowed opacity-40" : "cursor-pointer",
              ].join(" ")}
              style={{ borderLeft: `2px solid ${selected ? label.color : "transparent"}` }}
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <div className="truncate text-[12px] font-semibold tracking-[-0.01em] text-zinc-950">
                  {ev.location}, {ev.state}
                </div>
                <Pill
                  color={label.color}
                  bg={`${label.color}14`}
                  border={`${label.color}38`}
                  className="shrink-0"
                >
                  M{ev.mag}
                </Pill>
              </div>
              <div className="flex items-center justify-between gap-2 text-[10px] text-zinc-400">
                <span className="font-mono">{ev.id}</span>
                <span className="font-mono">
                  {ev.date} / {ev.time} UTC
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[10px] text-zinc-400">
                <span className="font-mono">
                  {ev.lat.toFixed(3)} N / {Math.abs(ev.lng).toFixed(3)} W
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block size-0.5 rounded-full bg-zinc-300" />
                  <span>{ev.depthKm} km</span>
                </span>
              </div>
              <div className="mt-2 h-px w-full bg-zinc-100" />
              <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-400">
                <span>Hover on map for tooltip</span>
                <span className="font-mono" style={{ color: magColor(ev.mag) }}>
                  {ev.region}
                </span>
              </div>
            </button>
          );
        }) : null}
      </div>

      <Sep />

      <div className="flex items-center justify-between px-3.5 py-2">
        <span className="text-[10px] text-zinc-400">30-day window</span>
        <div className="flex items-center gap-1.5">
          <Pill color="#dc2626" bg="rgba(220,38,38,0.08)" border="rgba(220,38,38,0.22)">
            {highCount} high
          </Pill>
          <Pill color="#b45309" bg="rgba(180,83,9,0.08)" border="rgba(180,83,9,0.22)">
            {moderateCount} mod
          </Pill>
        </div>
      </div>
    </aside>
  );
}
