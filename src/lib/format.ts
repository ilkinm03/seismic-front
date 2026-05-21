import { format, formatDistanceToNowStrict, parseISO } from "date-fns";

/** Numeric formatters memoized at module scope. */
const intFmt = new Intl.NumberFormat("en-US");
const floatFmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const compactFmt = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export const numberFmt = (
  n: number | null | undefined,
  opts?: { compact?: boolean; decimals?: number },
): string => {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  if (opts?.compact) return compactFmt.format(n);
  if (opts?.decimals !== undefined) {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: opts.decimals,
      minimumFractionDigits: opts.decimals,
    }).format(n);
  }
  return Number.isInteger(n) ? intFmt.format(n) : floatFmt.format(n);
};

const hasTime = (value: string): boolean => /[tT ]\d{2}:\d{2}/.test(value);
const hasTimeZone = (value: string): boolean =>
  /(?:[zZ]|[+-]\d{2}:?\d{2})$/.test(value);

/**
 * Backend datetime values are UTC. Some responses omit the trailing `Z`, so
 * add it before parsing or browsers will treat the value as local time.
 */
const normalizeIso = (iso: string): string =>
  hasTime(iso) && !hasTimeZone(iso) ? `${iso}Z` : iso;

const localTimeZoneLabel = (date: Date): string => {
  const zone = Intl.DateTimeFormat(undefined, {
    timeZoneName: "short",
  })
    .formatToParts(date)
    .find((part) => part.type === "timeZoneName")?.value;

  return zone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/** Convert raw ISO string from backend into a Date. Returns null on parse failure. */
function safeParse(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  try {
    const d = parseISO(normalizeIso(iso));
    return Number.isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
}

export const dateFmt = (
  iso: string | null | undefined,
  pattern = "yyyy-MM-dd",
): string => {
  const d = safeParse(iso);
  return d ? format(d, pattern) : "—";
};

export const dateTimeFmt = (
  iso: string | null | undefined,
  opts?: { timeZone?: boolean },
): string => {
  const d = safeParse(iso);
  if (!d) return "—";
  const value = format(d, "yyyy-MM-dd HH:mm");
  return opts?.timeZone === false ? value : `${value} ${localTimeZoneLabel(d)}`;
};

export const relativeTime = (iso: string | null | undefined): string => {
  const d = safeParse(iso);
  if (!d) return "—";
  return `${formatDistanceToNowStrict(d, { addSuffix: true })}`;
};

export const elapsedSince = (iso: string | null | undefined): string => {
  const d = safeParse(iso);
  if (!d) return "—";
  const ms = Date.now() - d.getTime();
  const s = Math.max(0, Math.round(ms / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${s % 60}s`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
};

/** USGS events have `place`, TexNet have `county_name`. Centralize the fallback. */
export const eventLocationLabel = (ev: {
  county_name?: string | null;
  region_name?: string | null;
  place?: string | null;
}): string =>
  ev.county_name?.trim() || ev.place?.trim() || ev.region_name?.trim() || "—";

/** Days → "X yıl" / "X ay" / "X gün" — used in slider helper text. */
export const humanDays = (days: number): string => {
  if (days >= 365) {
    const yrs = days / 365;
    return `≈ ${yrs.toFixed(yrs >= 10 ? 0 : 1)} years`;
  }
  if (days >= 30) {
    const m = Math.round(days / 30);
    return `≈ ${m} months`;
  }
  return `${days} days`;
};

export const psiFmt = (n: number | null | undefined) =>
  n == null ? "—" : `${numberFmt(n, { decimals: 0 })} psi`;
export const bblFmt = (n: number | null | undefined) =>
  n == null ? "—" : `${numberFmt(n, { decimals: 0 })} bbl`;
export const galFmt = (n: number | null | undefined) =>
  n == null ? "—" : `${numberFmt(n, { decimals: 0 })} gal`;
export const kmFmt = (n: number | null | undefined) =>
  n == null ? "—" : `${numberFmt(n, { decimals: 1 })} km`;
export const ftFmt = (n: number | null | undefined) =>
  n == null ? "—" : `${numberFmt(n, { decimals: 0 })} ft`;
export const pctFmt = (n: number | null | undefined) =>
  n == null ? "—" : `${(n * 100).toFixed(0)}%`;
