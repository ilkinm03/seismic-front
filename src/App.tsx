import React, { useEffect, useMemo, useState } from "react";
import EventList from "./components/EventList";
import MapView from "./components/MapView";
import ResultPanel from "./components/ResultPanel";
import StatusBar from "./components/StatusBar";
import Topbar from "./components/Topbar";
import type { SeismicEvent } from "./mock/data";
import { buildMockAttribution } from "./lib/seismic";
import { analyzeEvent, fetchEvents } from "./lib/api";

type AppState = "idle" | "loading" | "done" | "error";
type EventsState = "loading" | "ready" | "empty" | "error";

export default function App() {
  const [events, setEvents] = useState<SeismicEvent[]>([]);
  const [eventsState, setEventsState] = useState<EventsState>("loading");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [state, setState] = useState<AppState>("idle");
  const [result, setResult] = useState<ReturnType<typeof buildMockAttribution> | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [grayMap, setGrayMap] = useState(true);
  const [showWells, setShowWells] = useState(true);
  const [showRadius, setShowRadius] = useState(true);

  const event = useMemo(() => events.find((e) => e.id === selectedId) ?? null, [events, selectedId]);

  useEffect(() => {
    let mounted = true;
    setEventsState("loading");
    fetchEvents()
      .then((items) => {
        if (!mounted) return;
        setEvents(items);
        setEventsState(items.length ? "ready" : "empty");
      })
      .catch((error: unknown) => {
        if (!mounted) return;
        setErrorMessage(error instanceof Error ? error.message : "Could not load seismic events.");
        setEventsState("error");
      });

    return () => {
      mounted = false;
    };
  }, []);

  function handleSelect(id: string) {
    if (id === selectedId) return;
    setSelectedId(id);
    setState("idle");
    setResult(null);
    setErrorMessage(null);
  }

  async function handleAnalyze() {
    if (!event || state === "loading") return;
    setState("loading");
    setResult(null);
    setErrorMessage(null);

    try {
      const analysis = await analyzeEvent(event.id);
      setResult(analysis);
      setState("done");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Analysis failed.");
      setState("error");
    }
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden font-sans">
      <Topbar regionLabel="West Texas / Permian" eventCount={events.length} />

      <div className="relative flex flex-1 overflow-hidden">
        <EventList
          events={events}
          selectedId={selectedId}
          onSelect={handleSelect}
          disabled={state === "loading" || eventsState !== "ready"}
          state={eventsState}
          errorMessage={eventsState === "error" ? errorMessage : null}
        />

        <MapView
          events={events}
          selectedId={selectedId}
          onSelect={handleSelect}
          showWells={showWells}
          onShowWellsChange={setShowWells}
          showRadius={showRadius}
          onShowRadiusChange={setShowRadius}
          grayMap={grayMap}
          onGrayMapChange={setGrayMap}
        />

        <ResultPanel event={event} state={state} result={result} errorMessage={errorMessage} onAnalyze={handleAnalyze} />
      </div>

      <StatusBar state={state} event={event} eventsState={eventsState} />
    </div>
  );
}
