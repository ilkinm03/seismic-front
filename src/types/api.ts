/**
 * TypeScript mirrors of FastAPI Pydantic schemas exposed by the backend
 * at C:\Users\nihad\Desktop\fracfocus_data_fetch (see documents/FRONTEND_GUIDE.md).
 *
 * Keep these in sync with backend `app/schemas/*`. Field names match the JSON
 * payload exactly (snake_case) — do NOT camelCase here.
 */

// ──────────────────────────────────────────────────────────────────
// Generic shapes
// ──────────────────────────────────────────────────────────────────

export interface Paginated<T> {
  total: number;
  page: number;
  page_size: number;
  items: T[];
}

// ──────────────────────────────────────────────────────────────────
// Sync (Dashboard)
// ──────────────────────────────────────────────────────────────────

export type SyncSource =
  | "fracfocus"
  | "uic"
  | "h10"
  | "texnet"
  | "usgs"
  | "iris";
export type SyncStatus =
  | "pending"
  | "running"
  | "success"
  | "failed"
  | "skipped";

export interface SyncRun {
  id: number;
  source: SyncSource | string;
  status: SyncStatus | string;
  started_at: string | null;
  finished_at: string | null;
  rows_inserted: number | null;
  rows_updated: number | null;
  detail: string | null;
  created_at: string;
}

export interface SyncHistoryResponse {
  total: number;
  limit: number;
  items: SyncRun[];
}

export interface FracSyncCsvFile {
  filename: string;
  last_processed_at: string | null;
  row_count: number | null;
}

export interface FracSyncStatus {
  zip_url: string | null;
  last_sync_at: string | null;
  last_sync_status: string | null;
  etag: string | null;
  last_modified: string | null;
  csv_files: FracSyncCsvFile[];
}

export interface FracTriggerResponse {
  message: string;
  triggered_at: string;
  status: "started" | "already_running" | string;
}

export interface SyncFetchSummary {
  status: "success" | "failed" | string;
  source?: string;
  fetched: number;
  inserted: number;
  updated: number;
  pages?: number;
  error: string | null;
}

// ──────────────────────────────────────────────────────────────────
// Seismic Events
// ──────────────────────────────────────────────────────────────────

export interface SeismicEvent {
  source: "texnet" | "usgs" | string;
  event_id: string;
  magnitude: number | null;
  mag_type: string | null;
  latitude: number;
  longitude: number;
  depth: number | null;
  event_type: string | null;
  event_date: string | null;
  evaluation_status: string | null;
  rms: number | null;

  // TexNet-only
  county_name?: string | null;
  region_name?: string | null;
  station_count?: number | null;
  phase_count?: number | null;

  // USGS-only
  place?: string | null;
  title?: string | null;
  alternate_ids?: string | null;
  gap?: number | null;
}

export interface EventFilters {
  page?: number;
  page_size?: number;
  source?: "texnet" | "usgs";
  county?: string;
  min_magnitude?: number;
}

// ──────────────────────────────────────────────────────────────────
// SWD Wells & H-10 Monitoring
// ──────────────────────────────────────────────────────────────────

export interface SwdWell {
  uic_number: string;
  api_no: string | null;
  latitude: number | null;
  longitude: number | null;
  top_inj_zone: number | null;
  bot_inj_zone: number | null;
  max_liq_inj_pressure: number | null;
  activated_flag: boolean | null;
  lease_name: string | null;
  fetched_at: string | null;
}

export interface H10Record {
  uic_no: string;
  report_date: string;
  inj_press_avg: number | null;
  inj_press_max: number | null;
  vol_liq: number | null;
  vol_gas: number | null;
  fetched_at: string | null;
}

// ──────────────────────────────────────────────────────────────────
// FracFocus (dynamic schema)
// ──────────────────────────────────────────────────────────────────

export type FracJob = Record<string, string | number | boolean | null>;

export interface FracColumnsResponse {
  columns: string[];
}
export interface FracDistinctResponse {
  column: string;
  count: number;
  values: string[];
}
export interface FracGroupResponse {
  column: string;
  groups: { value: string; count: number }[];
}
export interface FracStatsResponse {
  total_records: number;
}

// ──────────────────────────────────────────────────────────────────
// IRIS Stations
// ──────────────────────────────────────────────────────────────────

export interface IrisStation {
  network_station: string;
  network: string;
  station_code: string;
  latitude: number;
  longitude: number;
  elevation: number | null;
  site_name: string | null;
  start_time: string | null;
  end_time: string | null;
}

// ──────────────────────────────────────────────────────────────────
// Analysis (Event Context + Attribution)
// ──────────────────────────────────────────────────────────────────

export interface AnalysisParams {
  swd_radius_km: number;
  swd_window_days: number;
  frac_radius_km: number;
  frac_window_days: number;
  station_radius_km: number;
}

export const DEFAULT_ANALYSIS_PARAMS: AnalysisParams = {
  swd_radius_km: 30,
  swd_window_days: 730,
  frac_radius_km: 30,
  frac_window_days: 730,
  station_radius_km: 50,
};

export interface NearbySwdWell {
  uic_number: string;
  api_no: string | null;
  distance_km: number;
  latitude: number;
  longitude: number;
  top_inj_zone: number | null;
  bot_inj_zone: number | null;
  monthly_record_count: number;
  cumulative_bbl: number;
  avg_pressure_psi: number | null;
  max_pressure_psi: number | null;
  first_report_date: string | null;
  last_report_date: string | null;
  rate_change_ratio: number | null;
}

export interface NearbyFracJob {
  api_number: string;
  distance_km: number;
  latitude: number;
  longitude: number;
  job_start_date: string | null;
  job_end_date: string | null;
  operator_name: string | null;
  well_name: string | null;
  total_water_volume: number | null;
  formation_depth: number | null;
}

export interface NearbyStation {
  network_station: string;
  network: string;
  station_code: string;
  distance_km: number;
  latitude: number;
  longitude: number;
  site_name: string | null;
  end_time: string | null;
}

export interface EventContext {
  event_id: string;
  event_latitude: number;
  event_longitude: number;
  event_depth_km: number | null;
  event_date: string | null;
  event_magnitude: number | null;

  swd_radius_km: number;
  swd_window_days: number;
  frac_radius_km: number;
  frac_window_days: number;
  station_radius_km: number;

  nearby_swd_wells: NearbySwdWell[];
  nearby_frac_jobs: NearbyFracJob[];
  nearby_stations: NearbyStation[];
}

export type AttributionDriver = "swd" | "frac" | "indeterminate";

export interface AttributionSignal {
  name: string;
  value: number;
  unit: string;
  description: string;
}

export interface AttributionResult {
  /** Engine label is intentionally `string` (changes between heuristic_v4 / physics_v1 / future). */
  engine: string;
  likely_driver: AttributionDriver;
  confidence: number;
  swd_score: number;
  frac_score: number;
  signals: AttributionSignal[];
}

export interface EventAnalysisResponse {
  snapshot_id: number;
  context: EventContext;
  attribution: AttributionResult;
}
