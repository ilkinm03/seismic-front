import { useEffect, useState } from "react";
import type { Map as LMap, LatLngTuple } from "leaflet";
import { useTheme } from "@/lib/theme";
import { MapBase } from "@/lib/map/MapBase";
import {
  useEpicenter,
  useFracLayer,
  useRadiusRings,
  useStationsLayer,
  useSwdLayer,
} from "@/lib/map/useNearbyLayers";
import { Switch } from "@/components/ui/Switch";
import type { EventContext } from "@/types/api";

export interface ContextMapProps {
  context: EventContext | undefined | null;
  loading?: boolean;
  /** Event lat/lon — used to center map before context loads. */
  eventLat?: number;
  eventLon?: number;
}

export function ContextMap({ context, loading, eventLat, eventLon }: ContextMapProps) {
  const { theme } = useTheme();
  const [variant, setVariant] = useState<"dark" | "light" | "satellite">(() => {
    const saved = localStorage.getItem("seismic-map-variant");
    if (saved === "dark" || saved === "light" || saved === "satellite") return saved as any;
    return theme;
  });

  const [show, setShow] = useState({
    swdRing: true,
    fracRing: true,
    stationRing: false,
    swdPins: true,
    fracPins: true,
    stationPins: true,
  });

  // Save variant to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("seismic-map-variant", variant);
  }, [variant]);

  // Sync with theme unless satellite is picked or manual override
  useEffect(() => {
    const saved = localStorage.getItem("seismic-map-variant");
    if (!saved || saved === "dark" || saved === "light") {
      setVariant(theme);
    }
  }, [theme]);

  const modes: { id: typeof variant; label: string }[] = [
    { id: "dark", label: "Dark" },
    { id: "light", label: "Light" },
    { id: "satellite", label: "Satellite" },
  ];

  const initialCenter: LatLngTuple | undefined =
    eventLat != null && eventLon != null ? [eventLat, eventLon] : undefined;
  const initialZoom = initialCenter ? 10 : 7;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)]">
      <MapBase initialCenter={initialCenter} initialZoom={initialZoom} variant={variant}>
        {(map) => (
          <ContextLayers map={map} context={context} show={show} eventLat={eventLat} eventLon={eventLon} />
        )}
      </MapBase>

      {/* Mode Selector */}
      <div className="absolute top-3 left-3 z-[850]">
        <div className="flex items-center gap-1 rounded-xl bg-[var(--color-card)]/90 p-1 shadow-lg backdrop-blur border border-[var(--color-border)]">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => setVariant(m.id)}
              className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${
                variant === m.id 
                  ? "bg-[var(--color-accent)] text-white shadow-sm" 
                  : "text-[var(--color-muted)] hover:text-[var(--color-fg)]"
              }`}
            >
              {m.id}
            </button>
          ))}
        </div>
      </div>

      {context ? <Legend /> : null}
      <OptionsPanel 
        show={show} 
        onChange={setShow} 
        disabled={!context || loading} 
        onRecenter={() => {
          if (eventLat != null && eventLon != null) {
            // Force a re-center if things slip
            window.dispatchEvent(new CustomEvent('map-recenter', { detail: [eventLat, eventLon] }));
          }
        }}
      />

      {!context && (
        <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-12 text-xs text-[var(--color-muted)]">
          <span className="rounded-lg border border-dashed border-[var(--color-border-strong)] bg-[var(--color-card)]/90 px-4 py-2 backdrop-blur">
            Load layers via Preview or Run Analysis
          </span>
        </div>
      )}
    </div>
  );
}

interface ShowState {
  swdRing: boolean;
  fracRing: boolean;
  stationRing: boolean;
  swdPins: boolean;
  fracPins: boolean;
  stationPins: boolean;
}

function ContextLayers({
  map,
  context,
  show,
  eventLat,
  eventLon,
}: {
  map: LMap;
  context: EventContext | undefined | null;
  show: ShowState;
  eventLat?: number;
  eventLon?: number;
}) {
  // Fly to event as soon as coordinates are known — before context/preview loads
  useEffect(() => {
    if (!map || eventLat == null || eventLon == null) return;
    map.flyTo([eventLat, eventLon], 10, { duration: 0.8 });
  }, [map, eventLat, eventLon]);

  useEpicenter({ map, lat: context?.event_latitude ?? null, lon: context?.event_longitude ?? null });
  useRadiusRings({
    map,
    centerLat: context?.event_latitude ?? null,
    centerLon: context?.event_longitude ?? null,
    swdRadiusKm: context?.swd_radius_km,
    fracRadiusKm: context?.frac_radius_km,
    stationRadiusKm: context?.station_radius_km,
    show: { swd: show.swdRing, frac: show.fracRing, station: show.stationRing },
  });
  useSwdLayer({ map, wells: context?.nearby_swd_wells ?? [], visible: show.swdPins });
  useFracLayer({ map, jobs: context?.nearby_frac_jobs ?? [], visible: show.fracPins });
  useStationsLayer({ map, stations: context?.nearby_stations ?? [], visible: show.stationPins });
  return null;
}

function Legend() {
  return (
    <div className="pointer-events-none absolute bottom-4 left-4 z-[800] w-[200px] space-y-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]/95 p-3 shadow-[var(--shadow-soft)] backdrop-blur">
      <p className="text-[9px] font-bold uppercase tracking-[.12em] text-[var(--color-muted)]">Legend</p>
      <Item color="#dc2626" label="Epicenter" shape="target" />
      <Item color="#ea580c" label="SWD well ◆" shape="diamond" />
      <Item color="#9333ea" label="Frac job ▢" shape="square" />
      <Item color="#2563eb" label="Station ▲" shape="triangle" />
    </div>
  );
}

function Item({ color, label, shape }: { color: string; label: string; shape: "star" | "diamond" | "square" | "triangle" | "target" }) {
  return (
    <div className="flex items-center gap-2 text-[11px] text-[var(--color-muted)]">
      <span
        className="inline-block size-3 shrink-0"
        style={{
          background: color,
          clipPath:
            shape === "diamond"
              ? "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"
              : shape === "triangle"
                ? "polygon(50% 0, 100% 100%, 0 100%)"
                : shape === "star"
                  ? "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"
                  : shape === "target"
                    ? "path('M 12,2 C 6.47,2 2,6.47 2,12 2,17.53 6.47,22 12,22 17.53,22 22,17.53 22,12 22,6.47 17.53,2 12,2 Z m 0,18 c -4.41,0 -8,-3.59 -8,-8 0,-4.41 3.59,-8 8,-8 4.41,0 8,3.59 8,8 0,4.41 -3.59,8 -8,8 z m 1,-13 h -2 v 3 H 8 v 2 h 3 v 3 h 2 v -3 h 3 v -2 h -3 z')"
                    : "none",
        }}
      />
      {label}
    </div>
  );
}

function OptionsPanel({
  show,
  onChange,
  disabled,
  onRecenter,
}: {
  show: ShowState;
  onChange: (next: ShowState) => void;
  disabled?: boolean;
  onRecenter?: () => void;
}) {
  const set = (k: keyof ShowState, v: boolean) => onChange({ ...show, [k]: v });
  const Row = ({ k, label }: { k: keyof ShowState; label: string }) => (
    <label className="flex cursor-pointer items-center justify-between gap-2 text-[11px] text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors">
      <span>{label}</span>
      <Switch checked={show[k]} onCheckedChange={(v) => set(k, v)} disabled={disabled} ariaLabel={label} />
    </label>
  );

  return (
    <div className="absolute right-3 top-3 z-[850] w-[190px] space-y-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]/95 p-3 shadow-[var(--shadow-soft)] backdrop-blur">
      <div className="flex items-center justify-between">
        <p className="text-[9px] font-bold uppercase tracking-[.12em] text-[var(--color-muted)]">
          Map layers
        </p>
        <button 
          onClick={onRecenter}
          disabled={disabled}
          className="text-[9px] font-bold uppercase text-[var(--color-accent)] hover:underline disabled:opacity-50"
        >
          Recenter
        </button>
      </div>
      <div className="space-y-1.5">
        <Row k="swdRing" label="SWD radius ring" />
        <Row k="fracRing" label="Frac radius ring" />
        <Row k="stationRing" label="Station radius ring" />
        <div className="my-1.5 h-px bg-[var(--color-border)]/60" />
        <Row k="swdPins" label="SWD wells" />
        <Row k="fracPins" label="Frac jobs" />
        <Row k="stationPins" label="Stations" />
      </div>
    </div>
  );
}
