import type { ToneOption } from "@/types";
import { cn } from "@/lib/cn";

interface ToneButtonProps {
  option: ToneOption;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export function ToneButton({ option, active, disabled, onClick }: ToneButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      title={option.description}
      className={cn(
        "group relative flex flex-col items-start gap-1.5 rounded-xl border px-3.5 py-2.5 text-left transition-all duration-150 disabled:opacity-50",
        active
          ? "border-transparent text-white shadow-soft"
          : "border-border bg-surface text-ink hover:-translate-y-0.5 hover:shadow-soft dark:border-border-dark dark:bg-surface-dark dark:text-ink-dark"
      )}
      style={active ? { backgroundColor: option.colorVar } : undefined}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: active ? "rgba(255,255,255,0.85)" : option.colorVar }}
        aria-hidden="true"
      />
      <span className="text-sm font-semibold leading-none">{option.label}</span>
    </button>
  );
}
