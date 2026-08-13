/**
 * Formats a duration in seconds as `m:ss`.
 * formatTime(65) -> "1:05"
 * formatTime(0)  -> "0:00"
 * formatTime(-1) -> "0:00"
 */
export function formatTime(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0:00";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * clamp(5, 0, 10) -> 5
 * clamp(-5, 0, 10) -> 0
 * clamp(15, 0, 10) -> 10
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * nextTrackIndex(0, 3) -> 1
 * nextTrackIndex(2, 3) -> 0  (wraps)
 */
export function nextTrackIndex(currentIndex: number, trackCount: number): number {
  if (trackCount <= 0) return 0;
  return (currentIndex + 1) % trackCount;
}

/**
 * prevTrackIndex(1, 3) -> 0
 * prevTrackIndex(0, 3) -> 2  (wraps)
 */
export function prevTrackIndex(currentIndex: number, trackCount: number): number {
  if (trackCount <= 0) return 0;
  return (currentIndex - 1 + trackCount) % trackCount;
}
