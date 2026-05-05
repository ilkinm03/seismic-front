/**
 * Magnitude → bucket mapping per FRONTEND_GUIDE §2.1:
 *   <2  = "low"     (gray)
 *   2-3 = "felt"    (yellow)
 *   3-4 = "strong"  (orange)
 *   4+  = "severe"  (red)
 *
 * Returns CSS variable references so all colors flow from styles.css @theme tokens
 * (and adapt automatically when dark mode is toggled).
 */

export type MagnitudeBucket = "low" | "felt" | "strong" | "severe";

export interface MagnitudeMeta {
  bucket: MagnitudeBucket;
  /** Human label shown in pills/popups */
  label: string;
  /** CSS color (uses theme variable) */
  color: string;
  /** Background tint (10% alpha) */
  bg: string;
  /** Border tint (35% alpha) */
  border: string;
  /** Marker tier 1..4 — controls SVG marker size */
  tier: 1 | 2 | 3 | 4;
}

export function magnitudeBucket(mag: number | null | undefined): MagnitudeBucket {
  if (mag == null) return "low";
  if (mag >= 4) return "severe";
  if (mag >= 3) return "strong";
  if (mag >= 2) return "felt";
  return "low";
}

const META: Record<MagnitudeBucket, Omit<MagnitudeMeta, "bucket">> = {
  low: {
    label: "Micro",
    color: "var(--color-mag-low)",
    bg: "color-mix(in oklch, var(--color-mag-low) 14%, transparent)",
    border: "color-mix(in oklch, var(--color-mag-low) 35%, transparent)",
    tier: 1,
  },
  felt: {
    label: "Felt",
    color: "var(--color-mag-mid)",
    bg: "color-mix(in oklch, var(--color-mag-mid) 16%, transparent)",
    border: "color-mix(in oklch, var(--color-mag-mid) 38%, transparent)",
    tier: 2,
  },
  strong: {
    label: "Strong",
    color: "var(--color-mag-high)",
    bg: "color-mix(in oklch, var(--color-mag-high) 18%, transparent)",
    border: "color-mix(in oklch, var(--color-mag-high) 40%, transparent)",
    tier: 3,
  },
  severe: {
    label: "Severe",
    color: "var(--color-mag-extreme)",
    bg: "color-mix(in oklch, var(--color-mag-extreme) 18%, transparent)",
    border: "color-mix(in oklch, var(--color-mag-extreme) 42%, transparent)",
    tier: 4,
  },
};

export function magnitudeMeta(mag: number | null | undefined): MagnitudeMeta {
  const bucket = magnitudeBucket(mag);
  return { bucket, ...META[bucket] };
}

export const magColor = (mag: number | null | undefined): string => magnitudeMeta(mag).color;
export const magLabel = (mag: number | null | undefined): string => magnitudeMeta(mag).label;

/** Concrete RGB (not CSS var) for SVG marker generation — falls back when CSS var doesn't paint. */
export function magHexFallback(mag: number | null | undefined): string {
  switch (magnitudeBucket(mag)) {
    case "severe":
      return "#dc2626";
    case "strong":
      return "#ea580c";
    case "felt":
      return "#ca8a04";
    default:
      return "#71717a";
  }
}
