import React, { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import type { SeismicEvent } from "../mock/data";
import { WELLS } from "../mock/data";
import { magColor, magLabel } from "../lib/seismic";
import { Dot } from "./ui";

function eventMarkerSvg({ id, mag, selected }: { id: string; mag: number; selected: boolean }) {
  const color = magColor(mag);
  const tier = mag >= 4 ? 3 : mag >= 3 ? 2 : 1;
  const outerR = 7 + tier * 4;
  const innerR = 4 + tier * 1.8;
  const suffix = id.slice(-4).replace(/[^a-zA-Z0-9]/g, "");

  const ring =
    tier > 1
      ? `<circle cx="${outerR}" cy="${outerR}" r="${innerR + 5}" fill="none" stroke="${color}" stroke-width="1" opacity="${
          selected ? 0.3 : 0.1
        }"/>`
      : "";

  const pulse = selected
    ? [
        `<circle cx="${outerR}" cy="${outerR}" r="${innerR}" fill="none" stroke="${color}" stroke-width="2">`,
        `<animate attributeName="r" values="${innerR};${innerR + 12};${innerR}" dur="2.2s" repeatCount="indefinite"/>`,
        `<animate attributeName="opacity" values=".55;0;.55" dur="2.2s" repeatCount="indefinite"/>`,
        `</circle>`,
      ].join("")
    : "";

  return {
    outerR,
    html: [
      `<svg xmlns="http://www.w3.org/2000/svg" width="${outerR * 2}" height="${outerR * 2}" viewBox="0 0 ${
        outerR * 2
      } ${outerR * 2}" overflow="visible">`,
      `<defs><filter id="g${suffix}"><feGaussianBlur in="SourceGraphic" stdDeviation="${
        selected ? 2.5 : 1.2
      }" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`,
      `<circle cx="${outerR}" cy="${outerR}" r="${outerR - 1}" fill="${color}" opacity="${selected ? 0.12 : 0.05}"/>`,
      ring,
      `<circle cx="${outerR}" cy="${outerR}" r="${innerR}" fill="${color}" stroke="white" stroke-width="2" filter="url(#g${suffix})"/>`,
      pulse,
      `</svg>`,
    ].join(""),
  };
}

function eventPopupHtml(ev: SeismicEvent) {
  const color = magColor(ev.mag);
  const label = magLabel(ev.mag);
  return `<div style="width:228px;font-family:Geist,-apple-system,sans-serif;">
    <div style="padding:11px 13px 9px;border-bottom:1px solid #f0f0f0;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
        <span style="font-family:Geist Mono,monospace;font-size:10px;color:#71717a;font-weight:500;">${ev.id}</span>
        <span style="font-size:10px;font-weight:700;color:${color};background:${color}14;border:1px solid ${color}33;padding:2px 7px;border-radius:999px;">
          ${label.label} / M${ev.mag}
        </span>
      </div>
      <div style="font-weight:700;font-size:13px;color:#09090b;margin-bottom:2px;">${ev.location}, ${ev.state}</div>
      <div style="font-size:10px;color:#a1a1aa;font-family:Geist Mono,monospace;">${ev.date} / ${ev.time} UTC</div>
    </div>
    <div style="padding:10px 13px 12px;display:grid;grid-template-columns:1fr 1fr;gap:6px;">
      <div style="background:#fafafa;border:1px solid #ececec;border-radius:8px;padding:7px 9px;">
        <div style="font-size:9px;color:#a1a1aa;text-transform:uppercase;letter-spacing:.08em;font-weight:700;margin-bottom:2px;">Depth</div>
        <div style="font-size:12px;font-weight:700;color:#09090b;font-family:Geist Mono,monospace;">${ev.depthKm} km</div>
      </div>
      <div style="background:#fafafa;border:1px solid #ececec;border-radius:8px;padding:7px 9px;">
        <div style="font-size:9px;color:#a1a1aa;text-transform:uppercase;letter-spacing:.08em;font-weight:700;margin-bottom:2px;">Coords</div>
        <div style="font-size:12px;font-weight:700;color:#09090b;font-family:Geist Mono,monospace;">${ev.lat.toFixed(3)} N</div>
      </div>
    </div>
  </div>`;
}

function wellMarkerSvg(vol: number) {
  const scale = 0.7 + (vol / 55000) * 0.6;
  const size = Math.round(20 * scale);
  const html = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">
    <polygon points="12,1 23,12 12,23 1,12" fill="#09090b" stroke="white" stroke-width="1.5"/>
    <polygon points="12,5 19,12 12,19 5,12" fill="none" stroke="rgba(255,255,255,.35)" stroke-width=".9"/>
    <circle cx="12" cy="12" r="2.5" fill="white"/>
  </svg>`;
  return { size, html };
}

function wellPopupHtml(well: (typeof WELLS)[number]) {
  return `<div style="width:212px;font-family:Geist,-apple-system,sans-serif;">
    <div style="padding:11px 13px 9px;border-bottom:1px solid #f0f0f0;">
      <p style="font-size:9px;color:#a1a1aa;text-transform:uppercase;letter-spacing:.08em;font-weight:700;margin:0 0 2px;">SWD Injection Well</p>
      <p style="font-size:12px;font-weight:600;color:#09090b;margin:0;">${well.operator}</p>
    </div>
    <div style="padding:10px 13px;">
      <div style="background:#f9f9f9;border-radius:8px;padding:8px 10px;border:1px solid #ececec;">
        <p style="font-size:9px;color:#a1a1aa;text-transform:uppercase;letter-spacing:.07em;font-weight:600;margin:0 0 3px;">Daily injection volume</p>
        <span style="font-size:16px;font-weight:700;color:#09090b;font-family:Geist Mono,monospace;">${well.volBblPerDay.toLocaleString()}</span>
        <span style="font-size:11px;color:#71717a;margin-left:5px;">bbl/day</span>
      </div>
    </div>
  </div>`;
}

export default function MapView({
  events,
  selectedId,
  onSelect,
  showWells,
  onShowWellsChange,
  showRadius,
  onShowRadiusChange,
  grayMap,
  onGrayMapChange,
}: {
  events: SeismicEvent[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  showWells: boolean;
  onShowWellsChange: (value: boolean) => void;
  showRadius: boolean;
  onShowRadiusChange: (value: boolean) => void;
  grayMap: boolean;
  onGrayMapChange: (value: boolean) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const eventsLayerRef = useRef<L.LayerGroup | null>(null);
  const wellsLayerRef = useRef<L.LayerGroup | null>(null);
  const radiusRef = useRef<L.Circle | null>(null);

  const selectedEvent = useMemo(
    () => events.find((event) => event.id === selectedId) ?? null,
    [events, selectedId],
  );

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;
    const map = L.map(containerRef.current, {
      center: [31.85, -103.2],
      zoom: 8,
      zoomControl: true,
      attributionControl: false,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18 }).addTo(map);
    mapRef.current = map;
    eventsLayerRef.current = L.layerGroup().addTo(map);
    wellsLayerRef.current = L.layerGroup().addTo(map);
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = eventsLayerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();

    events.forEach((event) => {
      const selected = event.id === selectedId;
      const { outerR, html } = eventMarkerSvg({ id: event.id, mag: event.mag, selected });
      const icon = L.divIcon({
        className: "",
        html: `<div style="cursor:pointer;">${html}</div>`,
        iconSize: [outerR * 2, outerR * 2],
        iconAnchor: [outerR, outerR],
      });
      const marker = L.marker([event.lat, event.lng], { icon, zIndexOffset: selected ? 1000 : 0 }).addTo(layer);
      marker.on("click", () => onSelect(event.id));
      marker.bindPopup(eventPopupHtml(event), {
        className: "core-tip",
        offset: [0, -(outerR + 4)],
        maxWidth: 240,
        closeButton: false,
        autoPan: false,
      });
      marker.on("mouseover", () => marker.openPopup());
      marker.on("mouseout", () => marker.closePopup());
    });

    if (selectedEvent) {
      map.flyTo([selectedEvent.lat, selectedEvent.lng], 9.8, { duration: 0.9 });
    }
  }, [events, selectedId, onSelect, selectedEvent]);

  useEffect(() => {
    const layer = wellsLayerRef.current;
    if (!layer) return;
    layer.clearLayers();
    if (!showWells) return;

    WELLS.forEach((well) => {
      const { size, html } = wellMarkerSvg(well.volBblPerDay);
      const icon = L.divIcon({
        className: "",
        html: `<div style="opacity:.88;filter:drop-shadow(0 1px 3px rgba(0,0,0,.25));">${html}</div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });
      const marker = L.marker([well.lat, well.lng], { icon }).addTo(layer);
      marker.bindPopup(wellPopupHtml(well), {
        className: "core-tip",
        offset: [0, -size / 2 - 2],
        maxWidth: 230,
        closeButton: false,
        autoPan: false,
      });
      marker.on("mouseover", () => marker.openPopup());
      marker.on("mouseout", () => marker.closePopup());
    });
  }, [showWells]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (radiusRef.current) {
      map.removeLayer(radiusRef.current);
      radiusRef.current = null;
    }
    if (!selectedEvent || !showRadius) return;
    radiusRef.current = L.circle([selectedEvent.lat, selectedEvent.lng], {
      radius: 10000,
      color: "#09090b",
      weight: 1.5,
      dashArray: "5 6",
      fillColor: "#09090b",
      fillOpacity: 0.025,
      opacity: 0.2,
    }).addTo(map);
  }, [selectedEvent, showRadius]);

  useEffect(() => {
    document.querySelectorAll<HTMLElement>(".leaflet-tile").forEach((tile) => {
      tile.style.filter = grayMap ? "grayscale(1) contrast(0.8) brightness(1.12)" : "none";
    });
  }, [grayMap]);

  return (
    <section className="relative flex-1 overflow-hidden">
      <div ref={containerRef} className="h-full w-full" />

      <div className="pointer-events-none absolute bottom-4 left-4 z-[800] w-[230px] rounded-xl border border-zinc-200 bg-white/95 p-3 shadow-soft">
        <p className="mb-2.5 text-[9px] font-bold uppercase tracking-[.12em] text-zinc-400">Map legend</p>
        <p className="mb-2 text-[9px] font-semibold uppercase tracking-[.08em] text-zinc-400">Seismic events</p>
        {[
          ["#dc2626", "M >= 4.0", "High"],
          ["#b45309", "M 3.0-3.9", "Moderate"],
          ["#2563eb", "M < 3.0", "Low"],
        ].map(([color, mag, label]) => (
          <div key={label} className="mb-1.5 flex items-center gap-2.5">
            <span className="inline-block size-3 rounded-full border-2 border-white" style={{ background: color }} />
            <span className="text-[11px] text-zinc-600">
              <b className="font-semibold text-zinc-950">{mag}</b>
              <span className="text-zinc-400"> / {label}</span>
            </span>
          </div>
        ))}
        <div className="my-2 h-px bg-zinc-200" />
        <div className="flex items-center gap-2.5 text-[11px] text-zinc-600">
          <span className="inline-block size-3 rotate-45 bg-zinc-950" />
          SWD well <span className="text-zinc-400">/ size = volume</span>
        </div>
      </div>

      {selectedEvent ? (
        <div className="pointer-events-none absolute left-1/2 top-3 z-[800] -translate-x-1/2 rounded-full border border-zinc-200 bg-white/95 px-3 py-1.5 font-mono text-[10px] shadow-sm">
          <span className="mr-2 inline-flex items-center gap-2">
            <Dot on color={magColor(selectedEvent.mag)} />
            <span className="font-medium text-zinc-600">{selectedEvent.id}</span>
          </span>
          <span className="text-zinc-300">/</span>{" "}
          <span className="text-zinc-400">
            {selectedEvent.lat.toFixed(3)} N, {Math.abs(selectedEvent.lng).toFixed(3)} W
          </span>{" "}
          <span className="text-zinc-300">/</span>{" "}
          <span className="font-bold" style={{ color: magColor(selectedEvent.mag) }}>
            M{selectedEvent.mag}
          </span>
        </div>
      ) : null}

      <div className="absolute right-4 top-4 z-[850] w-[190px] rounded-md border border-zinc-200 bg-white/95 p-3 shadow-soft">
        <p className="mb-2.5 text-[9px] font-semibold uppercase tracking-[.1em] text-zinc-400">Map options</p>
        <div className="space-y-2">
          {[
            ["Map grayscale", grayMap, onGrayMapChange],
            ["Show SWD wells", showWells, onShowWellsChange],
            ["Show radius ring", showRadius, onShowRadiusChange],
          ].map(([label, checked, onChange]) => (
            <label key={label as string} className="flex cursor-pointer items-center justify-between gap-2 text-[11px] text-zinc-600">
              <span className="truncate">{label as string}</span>
              <input
                type="checkbox"
                checked={checked as boolean}
                onChange={(event) => (onChange as (value: boolean) => void)(event.target.checked)}
              />
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}
