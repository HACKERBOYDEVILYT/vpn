import { getHealthState } from "./server-health-state.js";

export function buildServerSummary(
  server: any
) {
  const latencyMs =
    server.latencyMs ?? null;

  const loadPercent =
    server.loadPercent ?? null;

  return {
    id: server.id,
    name: server.name,
    regionCode: server.regionCode ?? null,
    city: server.city ?? null,
    countryCode: server.countryCode ?? null,
    enabled: server.enabled !== false,
    latencyMs,
    loadPercent,
    health: getHealthState(
      latencyMs,
      loadPercent
    )
  };
}
