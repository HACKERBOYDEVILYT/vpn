import type {
  ServerHealth,
  ServerStatus
} from "@nexavpn/types";

import { db } from "../../database/client.js";

interface HealthRow {
  server_id: string;
  latency_ms: number;
  packet_loss_percent: number | null;
  load_percent: number;
  status: ServerStatus;
  checked_at: Date;
}

export async function getServerHealth(
  serverId: string
): Promise<ServerHealth | null> {
  const result =
    await db.query<HealthRow>(
      `
        SELECT
          server_id,
          latency_ms,
          packet_loss_percent,
          load_percent,
          status,
          checked_at
        FROM server_health
        WHERE server_id = $1
        ORDER BY checked_at DESC
        LIMIT 1
      `,
      [serverId]
    );

  const row = result.rows[0];

  if (!row) {
    return null;
  }

  return {
    serverId: row.server_id,
    latencyMs: row.latency_ms,
    packetLossPercent:
      row.packet_loss_percent ?? undefined,
    loadPercent: row.load_percent,
    status: row.status,
    checkedAt:
      row.checked_at.toISOString()
  };
}
