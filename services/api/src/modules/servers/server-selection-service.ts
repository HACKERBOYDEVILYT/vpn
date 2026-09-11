import type { ServerSelectionCandidate } from "./server-selection.js";
import { selectBestServer } from "./server-selection.js";

export type SelectionMode =
  | "best"
  | "lowest_latency"
  | "lowest_load";

export function chooseServer(
  servers: ServerSelectionCandidate[],
  mode: SelectionMode = "best"
) {
  const available = servers.filter(
    (server) => server.enabled && server.healthy
  );

  if (available.length === 0) {
    return null;
  }

  if (mode === "lowest_latency") {
    return [...available].sort(
      (a, b) =>
        (a.latencyMs ?? 500) -
        (b.latencyMs ?? 500)
    )[0];
  }

  if (mode === "lowest_load") {
    return [...available].sort(
      (a, b) => a.loadPercent - b.loadPercent
    )[0];
  }

  return selectBestServer(available);
}
