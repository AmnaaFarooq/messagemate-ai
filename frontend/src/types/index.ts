export type Tone =
  | "professional"
  | "friendly"
  | "formal"
  | "boss"
  | "client"
  | "shorter"
  | "longer"
  | "more_polite"
  | "more_confident";

export interface ToneOption {
  id: Tone;
  label: string;
  description: string;
  colorVar: string;
}

export interface RewriteRequestBody {
  text: string;
  tone: Tone;
}

export interface RewriteResponseBody {
  result: string;
}

export interface ApiErrorBody {
  error: string;
  detail: string;
}

export interface HistoryEntry {
  id: string;
  originalText: string;
  resultText: string;
  tone: Tone;
  createdAt: string;
  favorite: boolean;
}
