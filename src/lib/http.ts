/**
 * Single source of HTTP truth. All services call request<T>() — never fetch directly.
 * Backend is reached via Vite proxy: requests prefixed `/api/v1` are forwarded to localhost:8000.
 */

export class ApiError extends Error {
  readonly status: number;
  readonly detail: string;
  readonly url: string;

  constructor(status: number, detail: string, url: string) {
    super(`${status} ${detail}`);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
    this.url = url;
  }
}

export class NetworkError extends Error {
  readonly url: string;
  constructor(url: string, cause?: unknown) {
    super("Backend unreachable");
    this.name = "NetworkError";
    this.url = url;
    if (cause) (this as { cause?: unknown }).cause = cause;
  }
}

const API_PREFIX = "/api/v1";

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Override prefix (e.g. "" for /health). Defaults to "/api/v1". */
  prefix?: string;
}

export async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { body, prefix = API_PREFIX, headers, ...rest } = opts;
  const url = `${prefix}${path}`;

  let res: Response;
  try {
    res = await fetch(url, {
      ...rest,
      headers: {
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (err) {
    throw new NetworkError(url, err);
  }

  if (!res.ok) {
    let detail = res.statusText || `HTTP ${res.status}`;
    try {
      const data = (await res.json()) as { detail?: unknown };
      if (data && typeof data.detail === "string") detail = data.detail;
      else if (data && data.detail) detail = JSON.stringify(data.detail);
    } catch {
      // ignore: response may not be JSON
    }
    throw new ApiError(res.status, detail, url);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/** Build a query-string from a partial object; skips null/undefined. */
export function qs(params: Record<string, unknown>): string {
  const u = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === "") continue;
    u.set(key, String(value));
  }
  const s = u.toString();
  return s ? `?${s}` : "";
}
