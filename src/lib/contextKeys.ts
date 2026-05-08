import type { NearbyFracJob } from "@/types/api";

export function fracJobKey(job: NearbyFracJob) {
  return [
    job.api_number,
    job.job_start_date ?? "",
    job.job_end_date ?? "",
    job.distance_km,
    job.latitude,
    job.longitude,
  ].join("|");
}
