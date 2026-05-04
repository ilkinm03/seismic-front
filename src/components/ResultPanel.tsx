import React, { useEffect, useMemo, useState } from "react";
import type { SeismicEvent } from "../mock/data";
import type { MockAttribution } from "../lib/seismic";
import { magLabel } from "../lib/seismic";
import { Dot, Pill, Sep, Spinner } from "./ui";

function ConfBar({ value, color, animated }: { value: number; color: string; animated: boolean }) {
  const [width, setWidth] = useState(animated ? 0 : value);
  useEffect(() => {
    if (!animated) return;
    const timer = window.setTimeout(() => setWidth(value), 120);
    return () => window.clearTimeout(timer);
  }, [value, animated]);

  return (
    <div className="h-1 flex-1 overflow-hidden rounded bg-zinc-200/70">
      <div
        className="h-full rounded transition-[width] duration-700"
        style={{
          width: `${Math.round(width * 100)}%`,
          background: color,
          boxShadow: `0 0 6px ${color}55`,
        }}
      />
    </div>
  );
}

function scoreTheme(score: number) {
  if (score >= 0.6)
    return { color: "#dc2626", bg: "rgba(220,38,38,.08)", br: "rgba(220,38,38,.22)", label: "Elevated" };
  if (score >= 0.4)
    return { color: "#b45309", bg: "rgba(180,83,9,.08)", br: "rgba(180,83,9,.22)", label: "Moderate" };
  return { color: "#16a34a", bg: "rgba(22,163,74,.08)", br: "rgba(22,163,74,.22)", label: "Low" };
}

export default function ResultPanel({
  event,
  state,
  result,
  errorMessage,
  onAnalyze,
}: {
  event: SeismicEvent | null;
  state: "idle" | "loading" | "done" | "error";
  result: MockAttribution | null;
  errorMessage: string | null;
  onAnalyze: () => void;
}) {
  const risk = useMemo(() => (result ? scoreTheme(result.riskScore) : null), [result]);

  if (!event) {
    return (
      <aside className="grid w-[360px] shrink-0 place-items-center border-l border-zinc-200 bg-zinc-50">
        <div className="flex max-w-[220px] flex-col items-center gap-3 text-center">
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="rgb(212 212 216)" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <circle cx="12" cy="17" r=".5" fill="rgb(212 212 216)" />
          </svg>
          <p className="text-[12px] leading-7 text-zinc-400">Select a seismic event to begin analysis.</p>
        </div>
      </aside>
    );
  }

  const label = magLabel(event.mag);
  const coords = `${event.lat.toFixed(2)} N, ${Math.abs(event.lng).toFixed(2)} W`;

  return (
    <aside className="flex w-[360px] shrink-0 flex-col overflow-hidden border-l border-zinc-200 bg-zinc-50">
      <div className="shrink-0 border-b border-zinc-200 bg-white px-4 py-3">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[.1em] text-zinc-400">Attribution</span>
          <Pill color={label.color} bg={`${label.color}14`} border={`${label.color}33`}>
            {label.label} / M{event.mag}
          </Pill>
        </div>
        <p className="text-[15px] font-bold tracking-[-0.03em] text-zinc-950">
          {event.location}, {event.state}
        </p>
        <p className="font-mono text-[10px] text-zinc-400">
          {event.id} / {event.date} / {event.time} UTC
        </p>
      </div>

      <div className="shrink-0 border-b border-zinc-200 px-4 py-3">
        <div className="grid grid-cols-3 gap-2">
          {[
            ["MAG", `M${event.mag}`, label.color],
            ["DEPTH", `${event.depthKm} km`, null],
            ["COORDS", coords, null],
          ].map(([key, value, color]) => (
            <div key={key} className="rounded-lg border border-zinc-200 bg-white px-2.5 py-2">
              <p className="mb-0.5 text-[9px] font-bold uppercase tracking-[.08em] text-zinc-400">{key}</p>
              <p className="font-mono text-[12px] font-semibold" style={{ color: (color as string | null) ?? "rgb(9 9 11)" }}>
                {value as string}
              </p>
            </div>
          ))}
        </div>
      </div>

      {state === "idle" ? (
        <div className="shrink-0 border-b border-zinc-200 px-4 py-3">
          <button
            type="button"
            onClick={onAnalyze}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-950 px-3 py-2.5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-zinc-800 active:translate-y-[1px]"
          >
            Analyze event
          </button>
          <p className="mt-2 text-[11px] text-zinc-400">This is a UI demo. Replace mock analysis with your engine.</p>
        </div>
      ) : null}

      {state === "loading" ? (
        <div className="shrink-0 border-b border-zinc-200 px-4 py-3">
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2">
            <Spinner />
            <span className="text-[12px] font-medium text-zinc-600">Running attribution engine...</span>
          </div>
          <div className="space-y-2">
            {["Loading regional dataset", "Gathering contextual records", "Executing attribution logic", "Generating evidence object"].map((step) => (
              <div key={step} className="flex items-center gap-2 text-[11px] text-zinc-400">
                <span className="inline-block size-2 rounded-full border border-zinc-200 bg-white" />
                {step}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {state === "error" ? (
        <div className="shrink-0 border-b border-zinc-200 px-4 py-3">
          <div className="rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-[12px] font-semibold text-red-800">Analysis failed</p>
            <p className="mt-1 text-[11px] leading-5 text-red-700">
              {errorMessage ?? "The analysis endpoint did not return a usable response."}
            </p>
          </div>
          <button
            type="button"
            onClick={onAnalyze}
            className="mt-3 h-9 w-full rounded-lg border border-zinc-300 bg-white text-[12px] font-semibold text-zinc-700 transition hover:bg-zinc-50"
          >
            Retry analysis
          </button>
        </div>
      ) : null}

      {state === "done" && result && risk ? (
        <div className="flex-1 overflow-y-auto">
          <div className="border-b border-zinc-200 px-4 py-3">
            <p className="mb-2 text-[9px] font-bold uppercase tracking-[.1em] text-zinc-400">Leading interpretation</p>
            <div
              className="rounded-xl border bg-white p-3"
              style={{ borderColor: risk.br, boxShadow: `0 2px 12px ${risk.color}0d` }}
            >
              <p className="mb-2 text-[13px] font-semibold leading-6 tracking-[-0.01em] text-zinc-950">
                {result.leadingInterpretation}
              </p>
              <div className="flex items-center gap-2">
                <Pill color={risk.color} bg={risk.bg} border={risk.br}>
                  Risk: {risk.label} ({Math.round(result.riskScore * 100)}%)
                </Pill>
                <span className="text-[11px] text-zinc-400">Mock score</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[.08em] text-zinc-400">Confidence</span>
                <ConfBar value={result.confidence} color="#16a34a" animated />
                <span className="font-mono text-[10px] text-zinc-400">{Math.round(result.confidence * 100)}%</span>
              </div>
              <p className="mt-2 text-[11px] leading-6 text-zinc-500">{result.summary}</p>
            </div>
          </div>

          <div className="border-b border-zinc-200 px-4 py-3">
            <p className="mb-2 text-[9px] font-bold uppercase tracking-[.1em] text-zinc-400">Signals</p>
            <div className="space-y-2">
              {result.signals.map((signal) => (
                <div
                  key={signal.key}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2"
                >
                  <span className="text-[11px] text-zinc-600">{signal.key}</span>
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-medium text-zinc-700">{signal.value}</span>
                    <span
                      className="inline-block size-2 rounded-full border"
                      style={{
                        background: signal.flagged ? "#b45309" : "rgb(212 212 216)",
                        borderColor: signal.flagged ? "rgba(180,83,9,.4)" : "rgb(212 212 216)",
                      }}
                      aria-hidden="true"
                    />
                  </span>
                </div>
              ))}
            </div>
          </div>

          {result.wellsWithin10Km.length ? (
            <div className="border-b border-zinc-200 px-4 py-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[9px] font-bold uppercase tracking-[.1em] text-zinc-400">Qualifying SWD wells</p>
                <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-[1px] font-mono text-[10px] text-zinc-400">
                  {result.wellsWithin10Km.length}
                </span>
              </div>
              <div className="space-y-2">
                {result.wellsWithin10Km.map((well) => (
                  <div key={well.id} className="rounded-lg border border-zinc-200 bg-white px-3 py-2">
                    <div className="truncate text-[12px] font-semibold text-zinc-950">{well.operator}</div>
                    <div className="font-mono text-[10px] text-zinc-400">
                      {well.volBblPerDay.toLocaleString()} bbl/day / {well.lat.toFixed(3)} N, {Math.abs(well.lng).toFixed(3)} W
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="px-4 py-3">
            <p className="mb-2 text-[9px] font-bold uppercase tracking-[.1em] text-zinc-400">Recent operations (mock)</p>
            <div className="space-y-2">
              {result.recentOperations.map((operation) => (
                <div key={operation.id} className="rounded-lg border border-zinc-200 bg-white px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-[12px] font-semibold text-zinc-950">{operation.title}</div>
                      <div className="truncate text-[11px] text-zinc-500">{operation.detail}</div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="font-mono text-[10px] text-zinc-400">{operation.date}</div>
                      <div className="font-mono text-[10px] text-zinc-400">{operation.depthM} m</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <Sep />
      <div className="shrink-0 bg-white px-4 py-2">
        <div className="flex items-center justify-between text-[10px] text-zinc-400">
          <span className="inline-flex items-center gap-2">
            <Dot on={state !== "idle"} color={state === "done" ? "#16a34a" : state === "loading" ? "#b45309" : "#d4d4d8"} />
            Engine status
          </span>
          <span className="font-mono">UI-only demo</span>
        </div>
      </div>
    </aside>
  );
}
