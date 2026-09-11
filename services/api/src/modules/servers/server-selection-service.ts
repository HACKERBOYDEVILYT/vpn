import type {
  ServerSelectionCandidate
} from "./server-selection.js";

import {
  selectBestServer
} from "./server-selection.js";

export type SelectionMode =
  | "best"
  | "lowest_latency"
  | "lowest_load";

function available(
  servers: ServerSelectionCandidate[]
) {
  return servers.filter(
    (server) =>
      server.enabled &&
      server.healthy
  );
}

export function chooseServer(
  servers: ServerSelectionCandidate[],
  mode: SelectionMode = "best"
) {
  const candidates = available(servers);

  if (candidates.length === 0) {
    return null;
  }

  if (mode === "lowest_latency") {
    return [...candidates].sort(
      (a, b) =>
        (a.latencyMs ?? Number.MAX_SAFE_INTEGER) -
        (b.latencyMs ?? Number.MAX_SAFE_INTEGER)
    )[0];
  }

  if (mode === "lowest_load") {
    return [...candidates].sort(
      (a, b) =>
        a.loadPercent -
        b.loadPercent
    )[0];
  }

  return selectBestServer(candidates);
}
