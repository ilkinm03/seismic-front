import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useEvents } from "@/queries/useEvents";
import { useEventContext } from "@/queries/useEventContext";
import { useAnalyzeEvent } from "@/queries/useAnalyzeEvent";
import { useDebounce } from "@/hooks/useDebounce";
import { ContextMap } from "@/components/domain/ContextMap";
import { ContextSummary } from "@/components/domain/ContextSummary";
import { VerdictBanner } from "@/components/domain/VerdictBanner";
import { ScoreBar } from "@/components/domain/ScoreBar";
import { SignalCard } from "@/components/domain/SignalCard";
import { ContextSwdTable } from "@/components/domain/ContextSwdTable";
import { ContextFracTable } from "@/components/domain/ContextFracTable";
import { ContextStationsTable } from "@/components/domain/ContextStationsTable";
import { MagnitudePill } from "@/components/domain/MagnitudePill";
import { SourceBadge } from "@/components/domain/SourceBadge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import {
  DEFAULT_ANALYSIS_PARAMS,
  type AnalysisParams,
  type AttributionSignal,
  type EventContext,
} from "@/types/api";
import { dateTimeFmt, kmFmt, humanDays } from "@/lib/format";
import { formatLatLon } from "@/lib/geo";
import { fracJobKey } from "@/lib/contextKeys";

interface SliderRow {
  key: keyof AnalysisParams;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  hint?: (v: number) => string;
}

const PARAM_ROWS: SliderRow[] = [
  {
    key: "swd_radius_km",
    label: "SWD Radius",
    min: 1,
    max: 200,
    step: 1,
    unit: "km",
  },
  {
    key: "swd_window_days",
    label: "SWD Lookback",
    min: 30,
    max: 18250,
    step: 30,
    unit: "d",
    hint: humanDays,
  },
  {
    key: "frac_radius_km",
    label: "Frac Radius",
    min: 1,
    max: 200,
    step: 1,
    unit: "km",
  },
  {
    key: "frac_window_days",
    label: "Frac Lookback",
    min: 30,
    max: 18250,
    step: 30,
    unit: "d",
    hint: humanDays,
  },
  {
    key: "station_radius_km",
    label: "Station Radius",
    min: 5,
    max: 500,
    step: 5,
    unit: "km",
  },
];

const CONTEXT_TAB_CLASS =
  "cursor-pointer data-[state=active]:bg-[var(--color-card)] data-[state=active]:text-[var(--color-fg)] data-[state=active]:shadow-sm rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--color-accent)] h-full px-6";

type ContextFocusSource = "table" | "map";

type SignalTarget =
  | { type: "swd"; id: string }
  | { type: "frac"; id: string }
  | { type: "station"; id: string };

function signalTargetKey(target: SignalTarget | null) {
  return target ? `${target.type}:${target.id}` : null;
}

function signalText(signal: AttributionSignal) {
  return `${signal.name} ${signal.description}`.toLowerCase();
}

function resolveSignalTarget(
  signal: AttributionSignal,
  context: EventContext,
): SignalTarget | null {
  const text = signalText(signal);
  const swd = context.nearby_swd_wells.find((well) =>
    text.includes(well.uic_number.toLowerCase()),
  );
  if (swd) return { type: "swd", id: swd.uic_number };

  const fracCandidates = context.nearby_frac_jobs
    .map((job) => {
      let score = 0;
      if (text.includes(job.api_number.toLowerCase())) score += 4;
      if (job.job_start_date && text.includes(job.job_start_date.toLowerCase()))
        score += 3;
      if (job.job_end_date && text.includes(job.job_end_date.toLowerCase()))
        score += 2;
      if (text.includes(job.distance_km.toFixed(1))) score += 1;
      if (job.operator_name && text.includes(job.operator_name.toLowerCase()))
        score += 1;
      return { job, score };
    })
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score);
  const frac = fracCandidates[0]?.job;
  if (frac) return { type: "frac", id: fracJobKey(frac) };

  const station = context.nearby_stations.find((s) => {
    const networkStation = s.network_station.toLowerCase();
    const stationCode = s.station_code.toLowerCase();
    return text.includes(networkStation) || text.includes(stationCode);
  });
  if (station) return { type: "station", id: station.network_station };

  return null;
}

export function EventAnalysisPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [params, setParams] = useState<AnalysisParams>({
    ...DEFAULT_ANALYSIS_PARAMS,
  });
  const [previewRequested, setPreviewRequested] = useState(true);
  const [activeTab, setActiveTab] = useState("swd");
  const [contextPanelCollapsed, setContextPanelCollapsed] = useState(false);
  const [focusedSwdWell, setFocusedSwdWell] = useState<{
    uic: string;
    requestId: number;
    source: ContextFocusSource;
  } | null>(null);
  const [focusedFracJob, setFocusedFracJob] = useState<{
    id: string;
    requestId: number;
    source: ContextFocusSource;
  } | null>(null);
  const [focusedStation, setFocusedStation] = useState<{
    id: string;
    requestId: number;
    source: ContextFocusSource;
  } | null>(null);

  // Debounce params for the background "preview" context query.
  // Prevents slamming the API while the user is still sliding the values.
  const debouncedParams = useDebounce(params, 1500);

  const eventsQuery = useEvents({ page: 1, page_size: 100 });
  const event = eventsQuery.data?.items.find((e) => e.event_id === eventId);

  const contextQuery = useEventContext(eventId ?? "", debouncedParams, {
    enabled: previewRequested && !!eventId,
  });
  const analyze = useAnalyzeEvent(eventId ?? "");

  if (!eventId) {
    return (
      <div className="flex h-full items-center justify-center">
        <EmptyState
          title="Event not found"
          action={
            <Link to="/events" className="text-sm underline">
              Back to Events
            </Link>
          }
        />
      </div>
    );
  }

  const context = analyze.data?.context ?? contextQuery.data;
  const result = analyze.data?.attribution;
  const focusedSignalTargetKey =
    focusedSwdWell != null
      ? signalTargetKey({ type: "swd", id: focusedSwdWell.uic })
      : focusedFracJob != null
        ? signalTargetKey({ type: "frac", id: focusedFracJob.id })
        : focusedStation != null
          ? signalTargetKey({ type: "station", id: focusedStation.id })
          : null;
  const focusedSignalRequestId =
    focusedSwdWell?.requestId ??
    focusedFracJob?.requestId ??
    focusedStation?.requestId ??
    0;
  const set = (key: keyof AnalysisParams, v: number) =>
    setParams((p) => ({ ...p, [key]: v }));
  const setContextTab = (value: string) => {
    setActiveTab(value);
    setContextPanelCollapsed(false);
  };
  const focusSignalTarget = (target: SignalTarget) => {
    if (target.type === "swd") {
      setActiveTab("swd");
      setContextPanelCollapsed(false);
      setFocusedFracJob(null);
      setFocusedStation(null);
      setFocusedSwdWell((current) => ({
        uic: target.id,
        requestId: (current?.requestId ?? 0) + 1,
        source: "map",
      }));
      return;
    }

    if (target.type === "frac") {
      setActiveTab("frac");
      setContextPanelCollapsed(false);
      setFocusedSwdWell(null);
      setFocusedStation(null);
      setFocusedFracJob((current) => ({
        id: target.id,
        requestId: (current?.requestId ?? 0) + 1,
        source: "map",
      }));
      return;
    }

    setActiveTab("stations");
    setContextPanelCollapsed(false);
    setFocusedSwdWell(null);
    setFocusedFracJob(null);
    setFocusedStation((current) => ({
      id: target.id,
      requestId: (current?.requestId ?? 0) + 1,
      source: "map",
    }));
  };
  const isSignalTargetFocused = (target: SignalTarget | null) => {
    if (!target) return false;
    if (target.type === "swd") return focusedSwdWell?.uic === target.id;
    if (target.type === "frac") return focusedFracJob?.id === target.id;
    return focusedStation?.id === target.id;
  };

  const sidebarRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const signalCardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Auto-scroll to results when they arrive
  useEffect(() => {
    if (result && resultsRef.current && sidebarRef.current) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        const target = resultsRef.current;
        const parent = sidebarRef.current;
        if (target && parent) {
          const top = target.offsetTop - parent.offsetTop;
          parent.scrollTo({
            top: top - 20, // Leave a little breathing room
            behavior: "smooth",
          });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [result]);

  useEffect(() => {
    setFocusedSwdWell(null);
    setFocusedFracJob(null);
    setFocusedStation(null);
  }, [eventId]);

  useEffect(() => {
    if (!focusedSignalTargetKey) return;
    const card = signalCardRefs.current[focusedSignalTargetKey];
    if (!card) return;

    card.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [focusedSignalTargetKey, focusedSignalRequestId, result]);

  return (
    <div className="flex flex-1 min-h-0 bg-[var(--color-bg)]">
      {/* ═══════════════════════════════════════════════════
          LEFT: MAP + BOTTOM DATA PANEL
          ═══════════════════════════════════════════════════ */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top: Map */}
        <div className="relative flex-1 min-h-0">
          <ContextMap
            context={context}
            loading={contextQuery.isFetching}
            eventLat={event?.latitude}
            eventLon={event?.longitude}
            focusedSwdWell={focusedSwdWell}
            focusedFracJob={focusedFracJob}
            focusedStation={focusedStation}
            onSwdWellClick={(well) => {
              setActiveTab("swd");
              setContextPanelCollapsed(false);
              setFocusedFracJob(null);
              setFocusedStation(null);
              setFocusedSwdWell((current) => ({
                uic: well.uic_number,
                requestId: (current?.requestId ?? 0) + 1,
                source: "map",
              }));
            }}
            onFracJobClick={(job) => {
              setActiveTab("frac");
              setContextPanelCollapsed(false);
              setFocusedSwdWell(null);
              setFocusedStation(null);
              setFocusedFracJob((current) => ({
                id: fracJobKey(job),
                requestId: (current?.requestId ?? 0) + 1,
                source: "map",
              }));
            }}
            onStationClick={(station) => {
              setActiveTab("stations");
              setContextPanelCollapsed(false);
              setFocusedSwdWell(null);
              setFocusedFracJob(null);
              setFocusedStation((current) => ({
                id: station.network_station,
                requestId: (current?.requestId ?? 0) + 1,
                source: "map",
              }));
            }}
            onMapClick={() => {
              setFocusedSwdWell(null);
              setFocusedFracJob(null);
              setFocusedStation(null);
            }}
          />
        </div>

        {/* Bottom: Context Data Tables */}
        {context && (
          <div
            onClick={() => {
              if (contextPanelCollapsed) setContextPanelCollapsed(false);
            }}
            className={`shrink-0 border-t border-[var(--color-border)] bg-[var(--color-card)] shadow-2xl z-20 overflow-hidden flex flex-col transition-[height] duration-200 ${
              contextPanelCollapsed ? "h-12 cursor-pointer" : "h-[320px]"
            }`}
          >
            <Tabs
              value={activeTab}
              onValueChange={setContextTab}
              className="flex flex-col h-full"
            >
              <div className="flex h-12 shrink-0 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-card-elevated)]/50 px-4">
                <TabsList className="bg-transparent border-0 gap-1 h-12">
                  <TabsTrigger
                    value="swd"
                    count={context.nearby_swd_wells.length}
                    className={CONTEXT_TAB_CLASS}
                  >
                    SWD Wells
                  </TabsTrigger>
                  <TabsTrigger
                    value="frac"
                    count={context.nearby_frac_jobs.length}
                    className={CONTEXT_TAB_CLASS}
                  >
                    Frac Jobs
                  </TabsTrigger>
                  <TabsTrigger
                    value="stations"
                    count={context.nearby_stations.length}
                    className={CONTEXT_TAB_CLASS}
                  >
                    Seismic Stations
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)]">
                    Local Context Data
                  </div>

                  <button
                    type="button"
                    aria-label={
                      contextPanelCollapsed
                        ? "Expand context table"
                        : "Collapse context table"
                    }
                    onClick={(event) => {
                      event.stopPropagation();
                      setContextPanelCollapsed((collapsed) => !collapsed);
                    }}
                    className="flex cursor-pointer size-7 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-card)] font-mono text-[11px] font-bold text-[var(--color-muted)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-fg)]"
                  >
                    {contextPanelCollapsed ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="size-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m4.5 15.75 7.5-7.5 7.5 7.5"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="size-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m19.5 8.25-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {!contextPanelCollapsed && (
                <div className="flex-1 overflow-hidden">
                  <TabsContent
                    value="swd"
                    className="h-full m-0 p-0 overflow-auto"
                  >
                    <ContextSwdTable
                      wells={context.nearby_swd_wells}
                      focusedUic={focusedSwdWell?.uic ?? null}
                      onSelectWell={(well) => {
                        setFocusedFracJob(null);
                        setFocusedStation(null);
                        setFocusedSwdWell((current) => ({
                          uic: well.uic_number,
                          requestId: (current?.requestId ?? 0) + 1,
                          source: "table",
                        }));
                      }}
                    />
                  </TabsContent>
                  <TabsContent
                    value="frac"
                    className="h-full m-0 p-0 overflow-auto"
                  >
                    <ContextFracTable
                      jobs={context.nearby_frac_jobs}
                      focusedFracJob={focusedFracJob?.id ?? null}
                      onSelectJob={(job) => {
                        setFocusedSwdWell(null);
                        setFocusedStation(null);
                        setFocusedFracJob((current) => ({
                          id: fracJobKey(job),
                          requestId: (current?.requestId ?? 0) + 1,
                          source: "table",
                        }));
                      }}
                    />
                  </TabsContent>
                  <TabsContent
                    value="stations"
                    className="h-full m-0 p-0 overflow-auto"
                  >
                    <ContextStationsTable
                      stations={context.nearby_stations}
                      focusedStation={focusedStation?.id ?? null}
                      onSelectStation={(station) => {
                        setFocusedSwdWell(null);
                        setFocusedFracJob(null);
                        setFocusedStation((current) => ({
                          id: station.network_station,
                          requestId: (current?.requestId ?? 0) + 1,
                          source: "table",
                        }));
                      }}
                    />
                  </TabsContent>
                </div>
              )}
            </Tabs>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════
          RIGHT: ANALYSIS PANEL
          ═══════════════════════════════════════════════════ */}
      <div
        ref={sidebarRef}
        className="flex w-[380px] flex-none flex-col overflow-y-auto border-l border-[var(--color-border)] bg-[var(--color-card)] shadow-lg z-30 scroll-smooth"
      >
        {/* Section 1: Event header */}
        <div className="border-b border-[var(--color-border)] px-5 py-4 bg-[var(--color-card-elevated)]/30">
          <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)]">
            <Link
              to="/events"
              className="hover:text-[var(--color-accent)] transition-colors"
            >
              Events
            </Link>
            <span className="opacity-30">/</span>
            <span className="text-[var(--color-fg)]">{eventId}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <MagnitudePill magnitude={event?.magnitude ?? null} />
              {event && <SourceBadge source={event.source} />}
            </div>
            {event?.evaluation_status && (
              <span className="rounded-md border border-[var(--color-border)] px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-tighter text-[var(--color-muted)]">
                {event.evaluation_status}
              </span>
            )}
          </div>

          {event && (
            <div className="mt-4 space-y-1.5 rounded-xl border border-[var(--color-border)]/50 bg-[var(--color-card)] p-3 shadow-sm">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[var(--color-muted)]">Timestamp</span>
                <span className="font-mono font-bold text-[var(--color-fg)]">
                  {dateTimeFmt(event.event_date ?? "")}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[var(--color-muted)]">Coordinates</span>
                <span className="font-mono font-bold text-[var(--color-fg)]">
                  {formatLatLon(event.latitude, event.longitude)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[var(--color-muted)]">
                  Depth / Location
                </span>
                <div className="flex items-center gap-2">
                  {event.depth != null && (
                    <span className="font-mono font-bold text-[var(--color-fg)]">
                      {kmFmt(event.depth)}
                    </span>
                  )}
                  <span className="font-bold text-[var(--color-accent)]">
                    {event.county_name ?? event.place}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Parameters */}
        <div className="border-b border-[var(--color-border)] px-5 py-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-[var(--color-fg)]">
              Analysis Parameters
            </h3>
            <button
              type="button"
              onClick={() => setParams({ ...DEFAULT_ANALYSIS_PARAMS })}
              className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors"
            >
              Reset
            </button>
          </div>

          <div className="space-y-4">
            {PARAM_ROWS.map((row) => {
              const v = params[row.key];
              return (
                <div key={row.key} className="group">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[var(--color-muted)] group-hover:text-[var(--color-fg)] transition-colors">
                      {row.label}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono text-xs font-black text-[var(--color-fg)]">
                        {v}
                      </span>
                      <span className="text-[9px] font-bold text-[var(--color-subtle)] uppercase">
                        {row.unit}
                      </span>
                    </div>
                  </div>
                  <Slider
                    value={v}
                    onValueChange={(nv) => set(row.key, nv)}
                    min={row.min}
                    max={row.max}
                    step={row.step}
                    ariaLabel={row.label}
                    disabled={analyze.isPending || contextQuery.isFetching}
                  />
                  {row.hint && (
                    <div className="mt-1 text-[9px] font-medium text-[var(--color-subtle)] text-right">
                      {row.hint(v)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewRequested(true)}
              loading={contextQuery.isFetching}
              disabled={analyze.isPending}
              className="flex-1 font-bold uppercase tracking-widest text-[10px] h-9"
            >
              Refresh Preview
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setPreviewRequested(true);
                analyze.mutate(params);
              }}
              loading={analyze.isPending}
              disabled={contextQuery.isFetching}
              className="flex-1 font-bold uppercase tracking-widest text-[10px] h-9 shadow-md"
            >
              Run Analysis
            </Button>
          </div>
        </div>

        {/* Section 3: Results */}
        <div ref={resultsRef} className="px-5 py-5">
          {context && !result && !analyze.isPending && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <ContextSummary context={context} />
              <div className="rounded-xl border border-[var(--color-border)] border-dashed p-6 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-xs font-bold text-[var(--color-fg)]">
                  Ready for Attribution
                </p>
                <p className="mt-1 text-[10px] text-[var(--color-muted)] leading-relaxed">
                  Context loaded. Click "Run Analysis" to calculate well weights
                  and scores.
                </p>
              </div>
            </div>
          )}

          {analyze.isPending && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Spinner size={24} />
              <div className="text-center">
                <span className="text-xs font-black uppercase tracking-widest text-[var(--color-fg)]">
                  Analyzing Engine
                </span>
                <p className="mt-1 text-[10px] text-[var(--color-muted)]">
                  Calculating proximity and pressure signals…
                </p>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300">
              <VerdictBanner result={result} />

              <div className="space-y-1">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-muted)]">
                    Attribution Score
                  </span>
                  <span className="font-mono text-[10px] font-bold text-[var(--color-accent)]">
                    PHYSICS_V4
                  </span>
                </div>
                <ScoreBar result={result} />
              </div>

              <div className="space-y-3">
                <div className="text-[10px] font-black uppercase tracking-widest text-[var(--color-muted)] px-1">
                  Ranked Drivers
                </div>
                {result.signals
                  .slice()
                  .sort((a, b) => b.value - a.value)
                  .map((sig, i) => {
                    const target = context
                      ? resolveSignalTarget(sig, context)
                      : null;
                    const targetKey = signalTargetKey(target);
                    const selected = targetKey === focusedSignalTargetKey;
                    return (
                      <div
                        key={i}
                        ref={(node) => {
                          if (targetKey)
                            signalCardRefs.current[targetKey] = node;
                        }}
                      >
                        <SignalCard
                          signal={sig}
                          rank={i + 1}
                          selected={selected || isSignalTargetFocused(target)}
                          onClick={
                            target ? () => focusSignalTarget(target) : undefined
                          }
                        />
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
