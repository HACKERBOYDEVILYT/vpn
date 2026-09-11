export type ServerHealthState =
  | "healthy"
  | "degraded"
  | "unhealthy"
  | "unknown";

export function getHealthState(
  latencyMs: number | null,
  loadPercent: number | null
): ServerHealthState {
  if (latencyMs === null && loadPercent === null) {
    return "unknown";
  }

  if (
    (latencyMs !== null && latencyMs > 300) ||
    (loadPercent !== null && loadPercent >= 90)
  ) {
    return "unhealthy";
  }

  if (
    (latencyMs !== null && latencyMs > 150) ||
    (loadPercent !== null && loadPercent >= 75)
  ) {
    return "degraded";
  }

  return "healthy";
}
