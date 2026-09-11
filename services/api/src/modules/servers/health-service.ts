import {
  findServerHealth
} from "./health-repository.js";
import {
  getHealthState
} from "./server-health-state.js";

export async function getServerHealth(
  serverId: string
) {
  const health =
    await findServerHealth(serverId);

  if (!health) {
    return {
      serverId,
      state: "unknown" as const,
      latencyMs: null,
      loadPercent: null,
      activeUsers: 0,
      checkedAt: null
    };
  }

  return {
    serverId,
    state: getHealthState(
      health.latencyMs,
      health.loadPercent
    ),
    latencyMs: health.latencyMs,
    loadPercent: health.loadPercent,
    activeUsers: health.activeUsers,
    checkedAt: health.checkedAt
  };
}
