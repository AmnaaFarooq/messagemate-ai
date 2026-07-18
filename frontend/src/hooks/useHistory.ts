import { useCallback, useEffect, useState } from "react";
import { HISTORY_KEY, loadJSON, saveJSON } from "@/lib/storage";
import type { HistoryEntry, Tone } from "@/types";

const MAX_HISTORY_ENTRIES = 50;

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadJSON(HISTORY_KEY, []));

  useEffect(() => {
    saveJSON(HISTORY_KEY, history);
  }, [history]);

  const addEntry = useCallback((originalText: string, resultText: string, tone: Tone) => {
    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      originalText,
      resultText,
      tone,
      createdAt: new Date().toISOString(),
      favorite: false,
    };
    setHistory((prev) => [entry, ...prev].slice(0, MAX_HISTORY_ENTRIES));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setHistory((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, favorite: !entry.favorite } : entry))
    );
  }, []);

  const removeEntry = useCallback((id: string) => {
    setHistory((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const exportAsJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `messagemate-history-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [history]);

  return { history, addEntry, toggleFavorite, removeEntry, clearHistory, exportAsJSON };
}
