import {
  findServerHealth
} from "./health-repository.js";

export async function buildServerCandidates(
  servers: any[]
) {
  const candidates = [];

  for (const server of servers) {
    const health =
      await findServerHealth(server.id);

    candidates.push({
      id: server.id,
      name: server.name,
      regionCode:
        server.regionCode ??
        server.region_code ??
        null,
      countryCode:
        server.countryCode ??
        server.country_code ??
        null,
      city: server.city ?? null,
      enabled: server.enabled !== false,
      healthy: health?.healthy ?? false,
      loadPercent:
        health?.loadPercent ?? 100,
      latencyMs:
        health?.latencyMs ?? null,
      activeUsers:
        health?.activeUsers ?? 0
    });
  }

  return candidates;
}
