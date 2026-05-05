/**
 * SVG marker factories. Output is HTML strings consumed by Leaflet's L.divIcon.
 * Ported and parameterized from the original components/MapView.tsx.
 */

import { magHexFallback, magnitudeMeta } from "@/lib/seismic";

export interface EventMarkerOpts {
  id: string;
  magnitude: number | null | undefined;
  selected?: boolean;
}

export interface EventMarkerOut {
  outerR: number;
  html: string;
}

export function eventMarkerSvg({ id, magnitude, selected = false }: EventMarkerOpts): EventMarkerOut {
  const meta = magnitudeMeta(magnitude);
  const color = magHexFallback(magnitude);
  const tier = meta.tier;
  const outerR = 7 + tier * 4;
  const innerR = 4 + tier * 1.8;
  const suffix = id.replace(/[^a-zA-Z0-9]/g, "").slice(-6) || "x";

  const ring =
    tier > 1
      ? `<circle cx="${outerR}" cy="${outerR}" r="${innerR + 5}" fill="none" stroke="${color}" stroke-width="1" opacity="${selected ? 0.4 : 0.12}"/>`
      : "";

  const pulse = selected
    ? `<circle cx="${outerR}" cy="${outerR}" r="${innerR}" fill="none" stroke="${color}" stroke-width="2">
         <animate attributeName="r" values="${innerR};${innerR + 12};${innerR}" dur="2.2s" repeatCount="indefinite"/>
         <animate attributeName="opacity" values=".55;0;.55" dur="2.2s" repeatCount="indefinite"/>
       </circle>`
    : "";

  const html = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${outerR * 2}" height="${outerR * 2}" viewBox="0 0 ${outerR * 2} ${outerR * 2}" overflow="visible">`,
    `<defs><filter id="g${suffix}"><feGaussianBlur in="SourceGraphic" stdDeviation="${selected ? 2.4 : 1.1}" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`,
    `<circle cx="${outerR}" cy="${outerR}" r="${outerR - 1}" fill="${color}" opacity="${selected ? 0.14 : 0.05}"/>`,
    ring,
    `<circle cx="${outerR}" cy="${outerR}" r="${innerR}" fill="${color}" stroke="white" stroke-width="2" filter="url(#g${suffix})"/>`,
    pulse,
    `</svg>`,
  ].join("");

  return { outerR, html };
}

export interface WellMarkerOpts {
  /** Used to scale marker size; pass cumulative_bbl or any positive intensity. */
  intensity?: number | null;
  /** Visual color — defaults to SWD orange. */
  color?: string;
}

export function wellMarkerSvg({ intensity, color = "#ea580c" }: WellMarkerOpts) {
  const norm = intensity ? Math.min(1, Math.log10(Math.max(1, intensity)) / 7) : 0.3;
  const scale = 0.7 + norm * 0.85;
  const size = Math.round(20 * scale);
  const html = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">
    <polygon points="12,1 23,12 12,23 1,12" fill="${color}" stroke="white" stroke-width="1.5"/>
    <polygon points="12,5 19,12 12,19 5,12" fill="none" stroke="rgba(255,255,255,.45)" stroke-width=".9"/>
    <circle cx="12" cy="12" r="2.5" fill="white"/>
  </svg>`;
  return { size, html };
}

export interface FracMarkerOpts {
  intensity?: number | null;
  color?: string;
}

export function fracMarkerSvg({ intensity, color = "#9333ea" }: FracMarkerOpts) {
  const norm = intensity ? Math.min(1, Math.log10(Math.max(1, intensity / 1000)) / 7) : 0.3;
  const scale = 0.7 + norm * 0.85;
  const size = Math.round(20 * scale);
  const html = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">
    <rect x="4" y="4" width="16" height="16" rx="3" fill="${color}" stroke="white" stroke-width="1.5"/>
    <path d="M8 8 l8 8 M16 8 l-8 8" stroke="rgba(255,255,255,.7)" stroke-width="1.4"/>
  </svg>`;
  return { size, html };
}

export interface StationMarkerOpts {
  active?: boolean;
  color?: string;
}

export function stationMarkerSvg({ active = true, color = "#2563eb" }: StationMarkerOpts) {
  const opacity = active ? 1 : 0.45;
  const html = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" opacity="${opacity}">
    <polygon points="12,3 22,21 2,21" fill="${color}" stroke="white" stroke-width="1.5"/>
    <circle cx="12" cy="16" r="2" fill="white"/>
  </svg>`;
  return { size: 18, html };
}

export interface EpicenterMarkerOpts {
  color?: string;
}

export function epicenterStarSvg({ color = "#dc2626" }: EpicenterMarkerOpts = {}) {
  const html = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" overflow="visible">
    <!-- Ripple 1 -->
    <circle cx="20" cy="20" r="8" fill="none" stroke="${color}" stroke-width="1.5" opacity=".6">
      <animate attributeName="r" values="8;18;8" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values=".6;0;.6" dur="2s" repeatCount="indefinite"/>
    </circle>
    <!-- Ripple 2 -->
    <circle cx="20" cy="20" r="12" fill="none" stroke="${color}" stroke-width="1" opacity=".3">
      <animate attributeName="r" values="12;24;12" dur="2s" begin="0.5s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values=".3;0;.3" dur="2s" begin="0.5s" repeatCount="indefinite"/>
    </circle>
    
    <!-- Crosshair lines -->
    <line x1="20" y1="8" x2="20" y2="32" stroke="${color}" stroke-width="2" stroke-linecap="round" />
    <line x1="8" y1="20" x2="32" y2="20" stroke="${color}" stroke-width="2" stroke-linecap="round" />
    
    <!-- Center Dot -->
    <circle cx="20" cy="20" r="5" fill="${color}" stroke="white" stroke-width="1.5" />
    
    <!-- Outer static ring -->
    <circle cx="20" cy="20" r="14" fill="none" stroke="${color}" stroke-width="1" opacity=".15" />
  </svg>`;
  return { size: 40, html };
}
