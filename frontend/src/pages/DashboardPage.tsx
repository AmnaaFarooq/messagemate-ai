import { useCallback, useState } from "react";
import { FiCommand } from "react-icons/fi";
import { Navbar } from "@/components/Navbar";
import { MessageInput } from "@/components/MessageInput";
import { ToneButton } from "@/components/ToneButton";
import { OutputCard } from "@/components/OutputCard";
import { HistoryPanel } from "@/components/HistoryPanel";
import { useHistory } from "@/hooks/useHistory";
import { useToast } from "@/hooks/useToast";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { rewriteMessage, ApiError } from "@/lib/api";
import { trackEvent } from "@/lib/analytics";
import { TONE_OPTIONS } from "@/lib/tones";
import type { HistoryEntry, Tone } from "@/types";

export function DashboardPage() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");
  const [activeTone, setActiveTone] = useState<Tone | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { history, addEntry, toggleFavorite, removeEntry, clearHistory, exportAsJSON } =
    useHistory();
  const { showToast } = useToast();

  const runRewrite = useCallback(
    async (tone: Tone) => {
      const trimmed = message.trim();
      if (!trimmed) {
        setErrorMessage("Type a message first — there's nothing to rewrite yet.");
        return;
      }

      setActiveTone(tone);
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const { result: rewritten } = await rewriteMessage({ text: trimmed, tone });
        setResult(rewritten);
        addEntry(trimmed, rewritten, tone);
        trackEvent("rewrite_success", { tone });
      } catch (err) {
        if (err instanceof ApiError) {
          setErrorMessage(err.message);
        } else {
          setErrorMessage("Something went wrong. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [message, addEntry]
  );

  useKeyboardShortcut(
    { key: "Enter", ctrlOrCmd: true },
    () => {
      if (!isLoading) runRewrite(activeTone ?? "professional");
    },
    [activeTone, isLoading, message]
  );

  function handleSelectHistoryEntry(entry: HistoryEntry) {
    setMessage(entry.originalText);
    setResult(entry.resultText);
    setActiveTone(entry.tone);
    showToast("Loaded from history", "info");
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Rewrite your message
          </h1>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted dark:text-muted-dark">
            Paste your message, pick a tone below.
            <span className="hidden items-center gap-1 rounded-md border border-border px-1.5 py-0.5 text-xs sm:inline-flex dark:border-border-dark">
              <FiCommand className="h-3 w-3" />
              Enter to rewrite
            </span>
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            <MessageInput value={message} onChange={setMessage} />

            <div>
              <p className="mb-2.5 text-xs font-medium uppercase tracking-wide text-muted dark:text-muted-dark">
                Choose a tone
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {TONE_OPTIONS.map((tone) => (
                  <ToneButton
                    key={tone.id}
                    option={tone}
                    active={activeTone === tone.id}
                    disabled={isLoading}
                    onClick={() => runRewrite(tone.id)}
                  />
                ))}
              </div>
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="animate-fade-in rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400"
              >
                {errorMessage}
              </div>
            )}

            <OutputCard
              result={result}
              isLoading={isLoading}
              onRegenerate={() => activeTone && runRewrite(activeTone)}
            />
          </div>

          <div>
            <HistoryPanel
              history={history}
              onToggleFavorite={toggleFavorite}
              onRemove={removeEntry}
              onClear={clearHistory}
              onExport={exportAsJSON}
              onSelect={handleSelectHistoryEntry}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
