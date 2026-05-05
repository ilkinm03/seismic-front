import L, { type Map as LMap } from "leaflet";
import { useEffect, useRef } from "react";
import type {
  NearbyFracJob,
  NearbyStation,
  NearbySwdWell,
} from "@/types/api";
import {
  epicenterStarSvg,
  fracMarkerSvg,
  stationMarkerSvg,
  wellMarkerSvg,
} from "@/lib/map/markers";
import { numberFmt } from "@/lib/format";

export interface UseEpicenterOpts {
  map: LMap | null;
  lat: number | null;
  lon: number | null;
  flyTo?: boolean;
}

export function useEpicenter({ map, lat, lon, flyTo = true }: UseEpicenterOpts) {
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!map) return;

    const handleRecenter = (e: any) => {
      const coords = e.detail as [number, number];
      map.flyTo(coords, Math.max(map.getZoom(), 10), { duration: 0.8 });
      // Also force a size refresh just in case
      map.invalidateSize();
    };

    window.addEventListener('map-recenter', handleRecenter);

    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
    if (lat == null || lon == null) return;

    const { size, html } = epicenterStarSvg();
    const icon = L.divIcon({
      className: "",
      html,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
    const marker = L.marker([lat, lon], { icon, zIndexOffset: 2000 }).addTo(map);
    markerRef.current = marker;
    
    // Initial flyTo only if it's the first load or coordinates changed
    if (flyTo) {
      // Delay slightly to allow any layout transitions (like panels opening) to finish
      setTimeout(() => {
        map.invalidateSize();
        map.flyTo([lat, lon], 10, { duration: 0.8 });
      }, 100);
    }

    return () => {
      window.removeEventListener('map-recenter', handleRecenter);
      marker.remove();
      markerRef.current = null;
    };
  }, [map, lat, lon, flyTo]);
}

export interface UseSwdLayerOpts {
  map: LMap | null;
  wells: NearbySwdWell[];
  visible?: boolean;
}

export function useSwdLayer({ map, wells, visible = true }: UseSwdLayerOpts) {
  const layerRef = useRef<L.LayerGroup | null>(null);
  useEffect(() => {
    if (!map) return;
    const layer = L.layerGroup().addTo(map);
    layerRef.current = layer;
    return () => {
      layer.remove();
      layerRef.current = null;
    };
  }, [map]);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    layer.clearLayers();
    if (!visible) return;
    wells.forEach((w) => {
      if (w.latitude == null || w.longitude == null) return;
      const { size, html } = wellMarkerSvg({ intensity: w.cumulative_bbl });
      const icon = L.divIcon({
        className: "",
        html: `<div style="opacity:0.9;">${html}</div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });
      const marker = L.marker([w.latitude, w.longitude], { icon }).addTo(layer);
      const lastDate = w.last_report_date ? w.last_report_date.split("T")[0] : "—";
      const popup = `<div style="width:240px; padding:0; color:var(--color-fg);">
        <div style="padding:10px 14px; background:color-mix(in oklch, var(--color-swd) 15%, transparent); border-bottom:1px solid var(--color-border);">
          <div style="font-size:9px; color:var(--color-swd); text-transform:uppercase; letter-spacing:.12em; font-weight:800; margin-bottom:2px;">SWD Well</div>
          <div style="font-family:var(--font-mono); font-size:13px; font-weight:700;">${w.uic_number}</div>
        </div>
        <div style="padding:12px 14px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span style="font-size:11px; color:var(--color-muted);">Distance</span>
            <span style="font-size:11px; font-weight:700;">${w.distance_km.toFixed(1)} km</span>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span style="font-size:11px; color:var(--color-muted);">Cumulative</span>
            <span style="font-size:11px; font-weight:700;">${numberFmt(w.cumulative_bbl, { decimals: 0 })} bbl</span>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:11px; color:var(--color-muted);">Last Active</span>
            <span style="font-size:11px; font-weight:700; color:var(--color-swd);">${lastDate}</span>
          </div>
        </div>
      </div>`;
      marker.bindPopup(popup, { className: "core-tip", offset: [0, -size / 2 - 4], closeButton: false, autoPan: false });
      marker.on("mouseover", () => marker.openPopup());
      marker.on("mouseout", () => marker.closePopup());
    });
  }, [wells, visible]);
}

export interface UseFracLayerOpts {
  map: LMap | null;
  jobs: NearbyFracJob[];
  visible?: boolean;
}

export function useFracLayer({ map, jobs, visible = true }: UseFracLayerOpts) {
  const layerRef = useRef<L.LayerGroup | null>(null);
  useEffect(() => {
    if (!map) return;
    const layer = L.layerGroup().addTo(map);
    layerRef.current = layer;
    return () => {
      layer.remove();
      layerRef.current = null;
    };
  }, [map]);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    layer.clearLayers();
    if (!visible) return;
    jobs.forEach((j) => {
      if (j.latitude == null || j.longitude == null) return;
      const { size, html } = fracMarkerSvg({ intensity: j.total_water_volume });
      const icon = L.divIcon({
        className: "",
        html,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });
      const marker = L.marker([j.latitude, j.longitude], { icon }).addTo(layer);
      const start = j.job_start_date ?? "—";
      const end = j.job_end_date ?? "—";
      const popup = `<div style="width:240px; padding:0; color:var(--color-fg);">
        <div style="padding:10px 14px; background:color-mix(in oklch, var(--color-frac) 15%, transparent); border-bottom:1px solid var(--color-border);">
          <div style="font-size:9px; color:var(--color-frac); text-transform:uppercase; letter-spacing:.12em; font-weight:800; margin-bottom:2px;">Frac Job</div>
          <div style="font-family:var(--font-mono); font-size:13px; font-weight:700;">${j.api_number}</div>
        </div>
        <div style="padding:12px 14px;">
          <div style="font-size:12px; font-weight:700; margin-bottom:10px;">${j.operator_name ?? "Unknown Operator"}</div>
          
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span style="font-size:11px; color:var(--color-muted);">Distance</span>
            <span style="font-size:11px; font-weight:700;">${j.distance_km.toFixed(1)} km</span>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span style="font-size:11px; color:var(--color-muted);">Volume</span>
            <span style="font-size:11px; font-weight:700;">${numberFmt(j.total_water_volume, { decimals: 0 })} gal</span>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:11px; color:var(--color-muted);">Job Window</span>
            <span style="font-size:11px; font-weight:700; color:var(--color-frac);">${start} · ${end}</span>
          </div>
        </div>
      </div>`;
      marker.bindPopup(popup, { className: "core-tip", offset: [0, -size / 2 - 4], closeButton: false, autoPan: false });
      marker.on("mouseover", () => marker.openPopup());
      marker.on("mouseout", () => marker.closePopup());
    });
  }, [jobs, visible]);
}

export interface UseStationsLayerOpts {
  map: LMap | null;
  stations: NearbyStation[];
  visible?: boolean;
}

export function useStationsLayer({ map, stations, visible = true }: UseStationsLayerOpts) {
  const layerRef = useRef<L.LayerGroup | null>(null);
  useEffect(() => {
    if (!map) return;
    const layer = L.layerGroup().addTo(map);
    layerRef.current = layer;
    return () => {
      layer.remove();
      layerRef.current = null;
    };
  }, [map]);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    layer.clearLayers();
    if (!visible) return;
    stations.forEach((s) => {
      if (s.latitude == null || s.longitude == null) return;
      const active = s.end_time == null;
      const { size, html } = stationMarkerSvg({ active });
      const icon = L.divIcon({
        className: "",
        html,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });
      const marker = L.marker([s.latitude, s.longitude], { icon }).addTo(layer);
      const popup = `<div style="width:200px;padding:10px 13px;">
        <div style="font-size:9px;color:var(--color-muted);text-transform:uppercase;letter-spacing:.08em;font-weight:700;margin-bottom:2px;">Seismic Station</div>
        <div style="font-family:var(--font-mono);font-size:12px;font-weight:600;color:var(--color-fg);">${s.network_station}</div>
        <div style="margin-top:6px;font-size:11px;color:var(--color-muted);">
          <div>${s.site_name ?? "—"}</div>
          <div>${s.distance_km.toFixed(1)} km away${active ? "" : " · decommissioned"}</div>
        </div>
      </div>`;
      marker.bindPopup(popup, { className: "core-tip", offset: [0, -size / 2 - 2], closeButton: false, autoPan: false });
      marker.on("mouseover", () => marker.openPopup());
      marker.on("mouseout", () => marker.closePopup());
    });
  }, [stations, visible]);
}

export interface UseRadiusRingsOpts {
  map: LMap | null;
  centerLat: number | null;
  centerLon: number | null;
  swdRadiusKm?: number;
  fracRadiusKm?: number;
  stationRadiusKm?: number;
  show?: { swd: boolean; frac: boolean; station: boolean };
}

export function useRadiusRings({
  map,
  centerLat,
  centerLon,
  swdRadiusKm,
  fracRadiusKm,
  stationRadiusKm,
  show = { swd: true, frac: true, station: false },
}: UseRadiusRingsOpts) {
  const layerRef = useRef<L.LayerGroup | null>(null);
  useEffect(() => {
    if (!map) return;
    const layer = L.layerGroup().addTo(map);
    layerRef.current = layer;
    return () => {
      layer.remove();
      layerRef.current = null;
    };
  }, [map]);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    layer.clearLayers();
    if (centerLat == null || centerLon == null) return;

    const ring = (km: number, color: string, label: string) => {
      L.circle([centerLat, centerLon], {
        radius: km * 1000,
        color,
        weight: 1.4,
        dashArray: "5 5",
        fill: false,
        opacity: 0.6,
      })
        .bindTooltip(`${label}: ${km} km`, { permanent: false, direction: "top" })
        .addTo(layer);
    };

    if (show.swd && swdRadiusKm) ring(swdRadiusKm, "#ea580c", "SWD radius");
    if (show.frac && fracRadiusKm) ring(fracRadiusKm, "#9333ea", "Frac radius");
    if (show.station && stationRadiusKm) ring(stationRadiusKm, "#2563eb", "Station radius");
  }, [centerLat, centerLon, swdRadiusKm, fracRadiusKm, stationRadiusKm, show.swd, show.frac, show.station]);
}
