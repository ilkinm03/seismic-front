import { useState, useEffect } from "react";
import type { Map as LMap } from "leaflet";
import { useTheme } from "@/lib/theme";
import { MapBase } from "@/lib/map/MapBase";
import { useEventLayer } from "@/lib/map/useEventLayer";
import { Card } from "@/components/ui/Card";
import type { SeismicEvent } from "@/types/api";
import { magHexFallback } from "@/lib/seismic";

export interface EventsMapProps {
  events: SeismicEvent[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function EventsMap({ events, selectedId, onSelect }: EventsMapProps) {
  const { theme } = useTheme();
  const [variant, setVariant] = useState<"dark" | "light" | "satellite">(() => {
    const saved = localStorage.getItem("seismic-map-variant");
    if (saved === "dark" || saved === "light" || saved === "satellite") return saved as any;
    return theme;
  });

  // Save variant to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("seismic-map-variant", variant);
  }, [variant]);

  // Keep map in sync with theme unless user manually selected satellite or override
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

  return (
    <div className="relative h-full w-full overflow-hidden">
      <MapBase variant={variant}>
        {(map) => (
          <EventsLayerInjector map={map} events={events} selectedId={selectedId} onSelect={onSelect} />
        )}
      </MapBase>
      
      <div className="absolute top-8 right-8 z-[800]">
        <div className="flex items-center gap-1 rounded-2xl bg-neutral-900/80 p-1 shadow-2xl backdrop-blur-xl border border-white/10">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => setVariant(m.id)}
              className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                variant === m.id 
                  ? "bg-white/10 text-white shadow-inner" 
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <Legend />
    </div>
  );
}

/** Hooks must run inside a component, not in MapBase's render-prop callback. */
function EventsLayerInjector({
  map,
  events,
  selectedId,
  onSelect,
}: {
  map: LMap;
  events: SeismicEvent[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  useEventLayer({ map, events, selectedId, onSelect, flyToSelected: true });
  return null;
}

function Legend() {
  const items = [
    { mag: 4.5, label: "Severe (≥ 4)" },
    { mag: 3.5, label: "Strong (3–4)" },
    { mag: 2.5, label: "Felt (2–3)" },
    { mag: 1.5, label: "Micro (<2)" },
  ];
  return (
    <div className="pointer-events-none absolute bottom-8 right-8 z-[800] w-[200px] rounded-2xl bg-neutral-900/80 p-4 shadow-2xl backdrop-blur-xl border border-white/10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <p className="relative mb-4 text-[10px] font-black uppercase tracking-[.2em] text-neutral-400">
        Event magnitude
      </p>
      <div className="relative space-y-3">
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-3">
            <span
              className="inline-block size-3.5 rounded-full border-2 border-white/20 shadow-[0_0_8px_rgba(255,255,255,0.1)]"
              style={{ background: magHexFallback(it.mag) }}
            />
            <span className="text-[12px] font-bold text-neutral-100/90 tracking-tight">{it.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

