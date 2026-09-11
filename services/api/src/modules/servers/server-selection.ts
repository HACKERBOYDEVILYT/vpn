export type ServerSelectionCandidate = {
  id: string;
  regionCode: string;
  city: string;
  enabled: boolean;
  healthy: boolean;
  loadPercent: number;
  latencyMs: number | null;
};

export function scoreServer(
  server: ServerSelectionCandidate
): number {
  if (!server.enabled || !server.healthy) {
    return Number.POSITIVE_INFINITY;
  }

  const latency =
    server.latencyMs === null
      ? 500
      : Math.max(server.latencyMs, 1);

  const load = Math.min(
    Math.max(server.loadPercent, 0),
    100
  );

  return latency * 0.7 + load * 3;
}

export function selectBestServer(
  servers: ServerSelectionCandidate[]
) {
  return [...servers]
    .filter((server) => server.enabled && server.healthy)
    .sort((a, b) => scoreServer(a) - scoreServer(b))[0] ?? null;
}
