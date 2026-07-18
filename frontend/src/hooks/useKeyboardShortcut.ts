import { useEffect } from "react";

export function useKeyboardShortcut(
  keyCombo: { key: string; ctrlOrCmd?: boolean },
  callback: () => void,
  deps: unknown[] = []
) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const modifierPressed = e.ctrlKey || e.metaKey;
      if (
        e.key.toLowerCase() === keyCombo.key.toLowerCase() &&
        (!keyCombo.ctrlOrCmd || modifierPressed)
      ) {
        e.preventDefault();
        callback();
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
