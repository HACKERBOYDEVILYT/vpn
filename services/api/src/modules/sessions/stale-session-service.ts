import { query } from "../../database/client.js";

const STALE_AFTER_SECONDS = 90;

export async function findStaleVPNSessions() {
  const result = await query(
    `
      SELECT
        id,
        user_id,
        device_id,
        server_id,
        protocol,
        state,
        created_at,
        updated_at
      FROM vpn_sessions
      WHERE state IN (
        'connecting',
        'connected',
        'reconnecting'
      )
      AND updated_at < NOW() - ($1 * INTERVAL '1 second')
      ORDER BY updated_at ASC
    `,
    [STALE_AFTER_SECONDS]
  );

  return result.rows;
}
