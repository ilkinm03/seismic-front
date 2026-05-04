import React from "react";
import type { SeismicEvent } from "../mock/data";

export default function StatusBar({
  state,
  event,
  eventsState,
}: {
  state: "idle" | "loading" | "done" | "error";
  event: SeismicEvent | null;
  eventsState: "loading" | "ready" | "empty" | "error";
}) {
  const msg = (() => {
    if (eventsState === "loading") return "Loading seismic event list...";
    if (eventsState === "error") return "Event list endpoint failed.";
    if (eventsState === "empty") return "No seismic events returned by event list endpoint.";
    if (state === "loading") return `Executing attribution engine for ${event?.id}...`;
    if (state === "error") return `Analysis failed for ${event?.id}.`;
    if (state === "done") return `Analysis complete / ${event?.id} / ${new Date().toISOString().slice(0, 19)} UTC`;
    return event ? `${event.id} selected - click Analyze event to begin` : "Ready / Select a seismic event from the list";
  })();

  return (
    <footer className="flex h-[26px] shrink-0 items-center gap-2 border-t border-zinc-200 bg-white px-4">
      {state === "loading" ? (
        <span className="inline-flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-1 rounded-full bg-amber-700/80"
              style={{ animation: `pulse 1s ${i * 0.18}s infinite` }}
            />
          ))}
        </span>
      ) : (
        <span
          className="inline-block size-1.5 rounded-full"
          style={{
            background: state === "done" ? "rgb(22 163 74)" : state === "error" || eventsState === "error" ? "rgb(220 38 38)" : "rgb(212 212 216)",
          }}
        />
      )}
      <span className="font-mono text-[10px] text-zinc-400">{msg}</span>
      {state === "done" ? <span className="ml-auto font-mono text-[10px] text-zinc-400">Attribution Engine / mock</span> : null}
    </footer>
  );
}
