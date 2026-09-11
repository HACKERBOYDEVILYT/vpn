import { pool } from "../../database/client.js";

export type ServerHealthRecord = {
  serverId: string;
  latencyMs: number | null;
  loadPercent: number | null;
  activeUsers: number;
  healthy: boolean;
  checkedAt: Date | null;
};

export async function findServerHealth(
  serverId: string
): Promise<ServerHealthRecord | null> {
  const result = await pool.query(
    `
      SELECT
        server_id,
        latency_ms,
        load_percent,
        active_users,
        healthy,
        checked_at
      FROM vpn_server_health
      WHERE server_id = $1
      LIMIT 1
    `,
    [serverId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];

  return {
    serverId: row.server_id,
    latencyMs: row.latency_ms,
    loadPercent: row.load_percent,
    activeUsers: row.active_users ?? 0,
    healthy: row.healthy,
    checkedAt: row.checked_at
  };
}
