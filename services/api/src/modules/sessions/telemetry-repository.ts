import { query } from "../../database/client.js";

export interface SessionTelemetry {
  session_id: string;
  bytes_in: string;
  bytes_out: string;
  packets_in: string;
  packets_out: string;
  connected_at: Date | null;
  last_reported_at: Date | null;
  ended_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export async function getSessionTelemetry(
  sessionId: string
): Promise<SessionTelemetry | null> {
  const result = await query<SessionTelemetry>(
    `
      SELECT
        session_id,
        bytes_in,
        bytes_out,
        packets_in,
        packets_out,
        connected_at,
        last_reported_at,
        ended_at,
        created_at,
        updated_at
      FROM vpn_session_telemetry
      WHERE session_id = $1
      LIMIT 1
    `,
    [sessionId]
  );

  return result.rows[0] ?? null;
}

export async function ensureSessionTelemetry(
  sessionId: string
): Promise<SessionTelemetry> {
  const result = await query<SessionTelemetry>(
    `
      INSERT INTO vpn_session_telemetry (
        session_id,
        bytes_in,
        bytes_out,
        packets_in,
        packets_out
      )
      VALUES (
        $1,
        0,
        0,
        0,
        0
      )
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
        ended_at,
        created_at,
        updated_at
    `,
    [sessionId]
  );

  return result.rows[0];
}

export async function markTelemetryConnected(
  sessionId: string
): Promise<SessionTelemetry> {
  const result = await query<SessionTelemetry>(
    `
      INSERT INTO vpn_session_telemetry (
        session_id,
        bytes_in,
        bytes_out,
        packets_in,
        packets_out,
        connected_at,
        ended_at
      )
      VALUES (
        $1,
        0,
        0,
        0,
        0,
        NOW(),
        NULL
      )
      ON CONFLICT (session_id)
      DO UPDATE SET
        connected_at = COALESCE(
          vpn_session_telemetry.connected_at,
          NOW()
        ),
        ended_at = NULL,
        updated_at = NOW()
      RETURNING
        session_id,
        bytes_in,
        bytes_out,
        packets_in,
        packets_out,
        connected_at,
        last_reported_at,
        ended_at,
        created_at,
        updated_at
    `,
    [sessionId]
  );

  return result.rows[0];
}

export async function markTelemetryEnded(
  sessionId: string
): Promise<SessionTelemetry | null> {
  const result = await query<SessionTelemetry>(
    `
      UPDATE vpn_session_telemetry
      SET
        ended_at = COALESCE(ended_at, NOW()),
        updated_at = NOW()
      WHERE session_id = $1
      RETURNING
        session_id,
        bytes_in,
        bytes_out,
        packets_in,
        packets_out,
        connected_at,
        last_reported_at,
        ended_at,
        created_at,
        updated_at
    `,
    [sessionId]
  );

  return result.rows[0] ?? null;
}

export async function updateSessionTelemetry(
  sessionId: string,
  bytesIn: number,
  bytesOut: number,
  packetsIn: number,
  packetsOut: number
): Promise<SessionTelemetry> {
  const result = await query<SessionTelemetry>(
    `
      INSERT INTO vpn_session_telemetry (
        session_id,
        bytes_in,
        bytes_out,
        packets_in,
        packets_out,
        last_reported_at
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        NOW()
      )
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
        ended_at,
        created_at,
        updated_at
    `,
    [
      sessionId,
      bytesIn,
      bytesOut,
      packetsIn,
      packetsOut
    ]
  );

  return result.rows[0];
}
