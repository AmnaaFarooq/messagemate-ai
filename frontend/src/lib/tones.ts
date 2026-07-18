import type { ToneOption } from "@/types";

// Ordered left (casual/warm) to right (formal/cool) — the order itself is
// the "spectrum" signature element on the dashboard.
export const TONE_OPTIONS: ToneOption[] = [
  {
    id: "friendly",
    label: "Friendly",
    description: "Warm and casual, still polite",
    colorVar: "var(--tone-friendly)",
  },
  {
    id: "more_polite",
    label: "More Polite",
    description: "Softer, more considerate phrasing",
    colorVar: "var(--tone-polite)",
  },
  {
    id: "professional",
    label: "Professional",
    description: "Clear and workplace-appropriate",
    colorVar: "var(--tone-professional)",
  },
  {
    id: "client",
    label: "Client",
    description: "Courteous, client-facing",
    colorVar: "var(--tone-client)",
  },
  {
    id: "more_confident",
    label: "More Confident",
    description: "Direct and self-assured",
    colorVar: "var(--tone-confident)",
  },
  {
    id: "boss",
    label: "Boss",
    description: "For messages to your manager",
    colorVar: "var(--tone-boss)",
  },
  {
    id: "formal",
    label: "Formal",
    description: "Official, formal correspondence",
    colorVar: "var(--tone-formal)",
  },
  {
    id: "shorter",
    label: "Shorter",
    description: "Trims it down, same meaning",
    colorVar: "var(--tone-shorter)",
  },
  {
    id: "longer",
    label: "Longer",
    description: "Adds detail and context",
    colorVar: "var(--tone-longer)",
  },
];

export function getToneOption(tone: string): ToneOption | undefined {
  return TONE_OPTIONS.find((t) => t.id === tone);
}
