const STORAGE_KEY = "sonarqube-tv-watch-progress";

interface WatchProgressMap {
  [videoId: string]: number; // 0-100 percentage
}

export function getAllProgress(): WatchProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function getProgress(videoId: string): number {
  return getAllProgress()[videoId] ?? 0;
}

export function removeProgress(videoId: string): void {
  if (typeof window === "undefined") return;
  const all = getAllProgress();
  delete all[videoId];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function setProgress(videoId: string, percent: number): void {
  if (typeof window === "undefined") return;
  const all = getAllProgress();
  all[videoId] = Math.min(100, Math.max(0, Math.round(percent)));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}
