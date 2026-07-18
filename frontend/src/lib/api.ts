import type { ApiErrorBody, RewriteRequestBody, RewriteResponseBody, Tone } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export class ApiError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function friendlyMessageFor(status: number, body: ApiErrorBody | null): string {
  if (body?.detail) return body.detail;
  if (status === 0) return "Can't reach the server. Check your internet connection.";
  if (status === 400) return "That message looks empty. Type something first.";
  if (status === 401) return "The AI provider rejected the configured API key.";
  if (status === 413) return "That message is too long. Try trimming it down.";
  if (status === 429) return "You're sending requests too quickly. Wait a moment and try again.";
  if (status === 502 || status === 503) return "The AI provider is temporarily unavailable.";
  if (status === 504) return "The AI provider took too long to respond. Try again.";
  return "Something went wrong. Please try again.";
}

export async function rewriteMessage(
  body: RewriteRequestBody,
  signal?: AbortSignal
): Promise<RewriteResponseBody> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/api/rewrite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    throw new ApiError(0, "NetworkError", friendlyMessageFor(0, null));
  }

  if (!response.ok) {
    let errorBody: ApiErrorBody | null = null;
    try {
      errorBody = await response.json();
    } catch {
      // response body wasn't JSON — fall back to status-based message
    }
    throw new ApiError(
      response.status,
      errorBody?.error ?? "UnknownError",
      friendlyMessageFor(response.status, errorBody)
    );
  }

  return response.json();
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
}

export type { Tone };
