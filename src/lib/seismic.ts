import type { SeismicEvent, SwdWell } from "../mock/data";
import { MOCK_OPERATIONS, WELLS } from "../mock/data";

export function magnitudeTier(mag: number): "high" | "moderate" | "low" {
  if (mag >= 4) return "high";
  if (mag >= 3) return "moderate";
  return "low";
}

export function magColor(mag: number): string {
  const tier = magnitudeTier(mag);
  if (tier === "high") return "#dc2626";
  if (tier === "moderate") return "#b45309";
  return "#2563eb";
}

export function magLabel(mag: number): { label: string; color: string } {
  const tier = magnitudeTier(mag);
  if (tier === "high") return { label: "High", color: "#dc2626" };
  if (tier === "moderate") return { label: "Moderate", color: "#b45309" };
  return { label: "Low", color: "#2563eb" };
}

function kmDistanceApprox(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const dLat = a.lat - b.lat;
  const dLng = a.lng - b.lng;
  return Math.sqrt(dLat * dLat + dLng * dLng) * 111;
}

export type MockAttribution = {
  riskScore: number;
  confidence: number;
  leadingInterpretation: string;
  summary: string;
  signals: { key: string; value: string; flagged: boolean }[];
  wellsWithin10Km: SwdWell[];
  recentOperations: typeof MOCK_OPERATIONS;
};

export function buildMockAttribution(event: SeismicEvent): MockAttribution {
  const wellsWithin10Km = WELLS.filter(
    (w) => kmDistanceApprox({ lat: w.lat, lng: w.lng }, { lat: event.lat, lng: event.lng }) <= 10,
  );

  const riskScore = event.mag >= 4 ? 0.62 : event.mag >= 3 ? 0.44 : 0.28;
  const confidence = event.mag >= 4 ? 0.79 : 0.87;

  return {
    riskScore,
    confidence,
    leadingInterpretation:
      event.mag >= 4
        ? "Fault reactivation driven by induced stress changes (mock assessment)."
        : "Elevated pore pressure near high-volume SWD operations (mock assessment).",
    summary: "This demo uses mock data and mock scoring only. Replace this object with your real engine output.",
    signals: [
      { key: "Nearest SWD distance", value: "2.3 km", flagged: true },
      { key: "Active wells in radius", value: `${wellsWithin10Km.length} wells`, flagged: wellsWithin10Km.length >= 2 },
      { key: "90-day injection volume", value: "3.47M bbl", flagged: true },
      { key: "30-day volume trend", value: "+23% above baseline", flagged: true },
      { key: "Depth consistency", value: event.depthKm < 8 ? "Consistent" : "Mixed", flagged: event.depthKm < 8 },
    ],
    wellsWithin10Km,
    recentOperations: MOCK_OPERATIONS,
  };
}
