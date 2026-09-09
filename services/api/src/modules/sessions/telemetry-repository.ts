import { query } from "../../database/client.js";

export interface SessionTelemetry {
  session_id: string;
  bytes_in: number;
  bytes_out: number;
  packets_in: number;
  packets_out: number;
  connected_at: Date | null;
  last_reported_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export async function getSessionTelemetry(
  sessionId: string
): Promise<SessionTelemetry | null> {
  const result = await query(
    `
      SELECT
        session_id,
        bytes_in,
        bytes_out,
        packets_in,
        packets_out,
        connected_at,
        last_reported_at,
        created_at,
        updated_at
      FROM vpn_session_telemetry
      WHERE session_id = $1
    `,
    [sessionId]
  );

  return result.rows[0] ?? null;
}

export async function ensureSessionTelemetry(
  sessionId: string
) {
  const result = await query(
    `
      INSERT INTO vpn_session_telemetry (
        session_id
      )
      VALUES ($1)
      ON CONFLICT (session_id)
      DO UPDATE SET
        updated_at = NOW()
      RETURNING
        session_id,
        bytes_in,
        bytes_out,
        packets_in,
        packets_out,
        connected_at,
        last_reported_at,
        created_at,
        updated_at
    `,
    [sessionId]
  );

  return result.rows[0];
}

export async function updateSessionTelemetry(
  sessionId: string,
  data: {
    bytesIn: number;
    bytesOut: number;
    packetsIn: number;
    packetsOut: number;
  }
) {
  const result = await query(
    `
      INSERT INTO vpn_session_telemetry (
        session_id,
        bytes_in,
        bytes_out,
        packets_in,
        packets_out,
        last_reported_at
      )
      VALUES ($1, $2, $3, $4, $5, NOW())
      ON CONFLICT (session_id)
      DO UPDATE SET
        bytes_in = EXCLUDED.bytes_in,
        bytes_out = EXCLUDED.bytes_out,
        packets_in = EXCLUDED.packets_in,
        packets_out = EXCLUDED.packets_out,
        last_reported_at = NOW(),
        updated_at = NOW()
      RETURNING
        session_id,
        bytes_in,
        bytes_out,
        packets_in,
        packets_out,
        connected_at,
        last_reported_at,
        created_at,
        updated_at
    `,
    [
      sessionId,
      data.bytesIn,
      data.bytesOut,
      data.packetsIn,
      data.packetsOut
    ]
  );

  return result.rows[0];
}
