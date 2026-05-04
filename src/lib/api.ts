import type { SeismicEvent } from "../mock/data";
import type { MockAttribution } from "./seismic";
import { EVENTS } from "../mock/data";
import { buildMockAttribution } from "./seismic";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function requestJson<T>(path: string): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured.");
  }

  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}.`);
  }
  return (await response.json()) as T;
}

export async function fetchEvents(): Promise<SeismicEvent[]> {
  if (API_BASE_URL) {
    return requestJson<SeismicEvent[]>("/events");
  }

  await wait(450);
  return EVENTS;
}

export async function analyzeEvent(eventId: string): Promise<MockAttribution> {
  if (API_BASE_URL) {
    return requestJson<MockAttribution>(`/events/${encodeURIComponent(eventId)}/analysis`);
  }

  await wait(1200);
  const event = EVENTS.find((item) => item.id === eventId);
  if (!event) {
    throw new Error("Selected event was not found.");
  }
  return buildMockAttribution(event);
}
