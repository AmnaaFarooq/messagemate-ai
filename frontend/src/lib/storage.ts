const HISTORY_KEY = "messagemate:history";
const THEME_KEY = "messagemate:theme";

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJSON<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage full or unavailable (private browsing) — fail silently,
    // history simply won't persist across sessions.
  }
}

export { HISTORY_KEY, THEME_KEY };
