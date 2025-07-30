import { useState, useEffect } from "react";

/**
 * Persisted minute-preset hook.
 * Returns the current array of positive minute values and a setter.
 * The values are stored in localStorage under the key "timeDurations".
 * If the stored value is invalid or absent, `defaultDurations` is used.
 */
export function useTimeDurations(defaultDurations: number[] = [15, 30, 45]) {
  const [durations, setDurations] = useState<number[]>(() => {
    if (typeof window === "undefined") return defaultDurations;
    try {
      const raw = window.localStorage.getItem("timeDurations");
      if (!raw) return defaultDurations;
      const parsed = JSON.parse(raw) as unknown;
      if (
        Array.isArray(parsed) &&
        parsed.every((n) => typeof n === "number" && n > 0)
      ) {
        return parsed;
      }
    } catch {
      // ignore and fall back
    }
    return defaultDurations;
  });

  // Persist on change
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("timeDurations", JSON.stringify(durations));
  }, [durations]);

  return [durations, setDurations] as const;
}
