import { query } from "../../database/client.js";

export async function markSessionConnected(
  sessionId: string
) {
  const result = await query(
    `
      INSERT INTO vpn_session_telemetry (
        session_id,
        connected_at,
        last_reported_at
      )
      VALUES ($1, NOW(), NOW())
      ON CONFLICT (session_id)
      DO UPDATE SET
        connected_at = COALESCE(
          vpn_session_telemetry.connected_at,
          NOW()
        ),
        last_reported_at = NOW(),
        updated_at = NOW()
      RETURNING
        session_id,
        connected_at,
        last_reported_at
    `,
    [sessionId]
  );

  return result.rows[0];
}
