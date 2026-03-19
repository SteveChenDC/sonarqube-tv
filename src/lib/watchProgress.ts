const STORAGE_KEY = "sonarqube-tv-watch-progress";

interface WatchProgressMap {
  [videoId: string]: number; // 0-100 percentage
}

export function getAllProgress(): WatchProgressMap {
  if (globalThis.window === undefined) return {};
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return {};
    const parsed: unknown = JSON.parse(data);
    // Validate: must be a plain object (not array/null/primitive)
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return {};
    }
    // Validate each entry: keys must be strings, values finite numbers clamped 0-100
    const validated: WatchProgressMap = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "number" && isFinite(value)) {
        validated[key] = Math.min(100, Math.max(0, value));
      }
    }
    return validated;
  } catch {
    return {};
  }
}

export function getProgress(videoId: string): number {
  return getAllProgress()[videoId] ?? 0;
}

export function removeProgress(videoId: string): void {
  if (globalThis.window === undefined) return;
  const all = getAllProgress();
  delete all[videoId];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function setProgress(videoId: string, percent: number): void {
  if (globalThis.window === undefined) return;
  const all = getAllProgress();
  all[videoId] = Math.min(100, Math.max(0, Math.round(percent)));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}
