import { FiStar, FiTrash2, FiDownload, FiClock } from "react-icons/fi";
import { Card } from "@/components/ui/Card";
import { getToneOption } from "@/lib/tones";
import type { HistoryEntry } from "@/types";
import { cn } from "@/lib/cn";

interface HistoryPanelProps {
  history: HistoryEntry[];
  onToggleFavorite: (id: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onExport: () => void;
  onSelect: (entry: HistoryEntry) => void;
}

export function HistoryPanel({
  history,
  onToggleFavorite,
  onRemove,
  onClear,
  onExport,
  onSelect,
}: HistoryPanelProps) {
  return (
    <Card className="flex max-h-[600px] flex-col p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-display text-sm font-semibold">
          <FiClock className="h-4 w-4" /> History
        </h3>
        {history.length > 0 && (
          <div className="flex gap-1">
            <button
              onClick={onExport}
              title="Export history as JSON"
              aria-label="Export history as JSON"
              className="rounded-lg p-1.5 text-muted hover:bg-canvas hover:text-ink dark:text-muted-dark dark:hover:bg-canvas-dark dark:hover:text-ink-dark"
            >
              <FiDownload className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={onClear}
              title="Clear all history"
              aria-label="Clear all history"
              className="rounded-lg p-1.5 text-muted hover:bg-canvas hover:text-red-500 dark:text-muted-dark dark:hover:bg-canvas-dark"
            >
              <FiTrash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted dark:text-muted-dark">
          Your rewrites will show up here.
        </p>
      ) : (
        <div className="flex-1 space-y-2 overflow-y-auto pr-1">
          {history.map((entry) => {
            const tone = getToneOption(entry.tone);
            return (
              <button
                key={entry.id}
                onClick={() => onSelect(entry)}
                className="group block w-full rounded-xl border border-border p-3 text-left transition-colors hover:border-brand-300 dark:border-border-dark"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                    style={{ backgroundColor: tone?.colorVar ?? "var(--tone-professional)" }}
                  >
                    {tone?.label ?? entry.tone}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(entry.id);
                      }}
                      aria-label="Toggle favorite"
                      className="rounded-md p-1 hover:bg-canvas dark:hover:bg-canvas-dark"
                    >
                      <FiStar
                        className={cn(
                          "h-3.5 w-3.5",
                          entry.favorite ? "fill-amber-400 text-amber-400" : "text-muted dark:text-muted-dark"
                        )}
                      />
                    </span>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(entry.id);
                      }}
                      aria-label="Remove from history"
                      className="rounded-md p-1 hover:bg-canvas dark:hover:bg-canvas-dark"
                    >
                      <FiTrash2 className="h-3.5 w-3.5 text-muted dark:text-muted-dark" />
                    </span>
                  </div>
                </div>
                <p className="line-clamp-2 text-xs text-ink dark:text-ink-dark">{entry.resultText}</p>
              </button>
            );
          })}
        </div>
      )}
    </Card>
  );
}
