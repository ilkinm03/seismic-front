import L, { type Map as LMap } from "leaflet";
import { useEffect, useRef } from "react";
import type { SeismicEvent } from "@/types/api";
import { eventMarkerSvg } from "@/lib/map/markers";
import { magHexFallback, magnitudeMeta } from "@/lib/seismic";
import { eventLocationLabel } from "@/lib/format";

export interface UseEventLayerOpts {
  map: LMap | null;
  events: SeismicEvent[];
  selectedId?: string | null;
  onSelect?: (eventId: string) => void;
  /** Center on selection. */
  flyToSelected?: boolean;
}

function popupHtml(ev: SeismicEvent): string {
  const meta = magnitudeMeta(ev.magnitude);
  const color = magHexFallback(ev.magnitude);
  const label = meta.label;
  const date = ev.event_date
    ? ev.event_date.replace("T", " ").slice(0, 16)
    : "—";
  const where = eventLocationLabel(ev);

  return `<div style="width:260px; padding:0; border-radius:16px; overflow:hidden; background:rgba(23, 23, 23, 0.85); backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.1); shadow:0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);">
    <div style="padding:14px 16px 12px; background:linear-gradient(to bottom, rgba(255,255,255,0.03), transparent); border-bottom:1px solid rgba(255,255,255,0.08);">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
        <span style="font-family: var(--font-mono); font-size:10px; color:rgba(255,255,255,0.4); font-weight:700; letter-spacing:0.05em; text-transform:uppercase;">${ev.event_id}</span>
        <span style="font-size:10px; font-weight:900; color:${color}; background:${color}15; border:1px solid ${color}40; padding:2.5px 9px; border-radius:8px; text-transform:uppercase; letter-spacing:0.02em;">
          ${label} · M${ev.magnitude ?? "—"}
        </span>
      </div>
      <div style="font-weight:800; font-size:15px; color:white; margin-bottom:4px; letter-spacing:-0.01em;">${where}</div>
      <div style="display:flex; align-items:center; gap:6px;">
        <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:${color}; box-shadow:0 0 8px ${color}80;"></span>
        <span style="font-size:11px; color:rgba(255,255,255,0.5); font-family:var(--font-mono); font-weight:500;">${date} UTC</span>
      </div>
    </div>
    <div style="padding:12px 16px 16px; display:grid; grid-template-columns:1fr 1fr; gap:10px;">
      <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:10px; padding:8px 10px;">
        <div style="font-size:9px; color:rgba(255,255,255,0.3); text-transform:uppercase; letter-spacing:.12em; font-weight:800; margin-bottom:4px;">Depth</div>
        <div style="font-size:13px; font-weight:800; color:white; font-family:var(--font-mono);">${ev.depth ?? "—"} <span style="font-size:10px; opacity:0.5; font-weight:500;">km</span></div>
      </div>
      <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:10px; padding:8px 10px;">
        <div style="font-size:9px; color:rgba(255,255,255,0.3); text-transform:uppercase; letter-spacing:.12em; font-weight:800; margin-bottom:4px;">Source</div>
        <div style="font-size:13px; font-weight:800; color:${ev.source === "usgs" ? "#3b82f6" : "#10b981"}; font-family:var(--font-mono);">${(ev.source ?? "—").toUpperCase()}</div>
      </div>
    </div>
  </div>`;
}

export function useEventLayer({
  map,
  events,
  selectedId,
  onSelect,
  flyToSelected = true,
}: UseEventLayerOpts) {
  const layerRef = useRef<L.LayerGroup | null>(null);

  // Lazy create the layer
  useEffect(() => {
    if (!map) return;
    const layer = L.layerGroup().addTo(map);
    layerRef.current = layer;
    return () => {
      layer.remove();
      layerRef.current = null;
    };
  }, [map]);

  // Repaint markers when events / selection change
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || !map) return;
    layer.clearLayers();

    events.forEach((event) => {
      if (event.latitude == null || event.longitude == null) return;
      const selected = event.event_id === selectedId;
      const { outerR, html } = eventMarkerSvg({
        id: event.event_id,
        magnitude: event.magnitude,
        selected,
      });
      const icon = L.divIcon({
        className: "",
        html: `<div style="cursor:pointer;">${html}</div>`,
        iconSize: [outerR * 2, outerR * 2],
        iconAnchor: [outerR, outerR],
      });
      const marker = L.marker([event.latitude, event.longitude], {
        icon,
        zIndexOffset: selected ? 1000 : 0,
      }).addTo(layer);
      marker.on("click", () => onSelect?.(event.event_id));
      marker.bindPopup(popupHtml(event), {
        className: "core-tip",
        offset: [0, -(outerR + 4)],
        maxWidth: 260,
        closeButton: false,
        autoPan: false,
      });
      marker.on("mouseover", () => marker.openPopup());
      marker.on("mouseout", () => marker.closePopup());
    });

    if (flyToSelected && selectedId) {
      const sel = events.find((e) => e.event_id === selectedId);
      if (sel && sel.latitude != null && sel.longitude != null) {
        map.flyTo([sel.latitude, sel.longitude], Math.max(map.getZoom(), 9), {
          duration: 0.7,
        });
      }
    }
  }, [map, events, selectedId, onSelect, flyToSelected]);
}
