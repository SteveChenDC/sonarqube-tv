/**
 * Converts a duration string like "3:31", "1:02:41", or "0:41" to ISO 8601 duration format.
 * Examples: "3:31" → "PT3M31S", "1:02:41" → "PT1H2M41S", "0:41" → "PT41S"
 */
export function durationToISO(duration: string): string {
  const parts = duration.split(":").map(Number);

  if (parts.length === 3) {
    const [h, m, s] = parts;
    return `PT${h}H${m}M${s}S`;
  }

  const [m, s] = parts;
  if (m === 0) {
    return `PT${s}S`;
  }
  return `PT${m}M${s}S`;
}
