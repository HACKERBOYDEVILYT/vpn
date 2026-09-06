import { randomUUID } from "node:crypto";

import type {
  VPNSession,
  VPNConnectionState,
  VPNProtocol
} from "@nexavpn/types";

import { db } from "../../database/client.js";

interface SessionRow {
  id: string;
  user_id: string;
  device_id: string;
  server_id: string;
  protocol: VPNProtocol;
  state: VPNConnectionState;
  started_at: Date | null;
  ended_at: Date | null;
  duration_seconds: number | null;
}

function mapSession(
  row: SessionRow
): VPNSession {
  return {
    id: row.id,
    userId: row.user_id,
    deviceId: row.device_id,
    serverId: row.server_id,
    protocol: row.protocol,
    state: row.state,
    startedAt:
      row.started_at?.toISOString(),
    endedAt:
      row.ended_at?.toISOString(),
    durationSeconds:
      row.duration_seconds ?? undefined
  };
}

export async function createSession(
  userId: string,
  params: {
    deviceId: string;
    serverId: string;
    protocol: VPNProtocol;
  }
): Promise<VPNSession> {
  const id = randomUUID();

  const result =
    await db.query<SessionRow>(
      `
        INSERT INTO vpn_sessions (
          id,
          user_id,
          device_id,
          server_id,
          protocol,
          state
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          'connecting'
        )
        RETURNING
          id,
          user_id,
          device_id,
          server_id,
          protocol,
          state,
          started_at,
          ended_at,
          duration_seconds
      `,
      [
        id,
        userId,
        params.deviceId,
        params.serverId,
        params.protocol
      ]
    );

  const row = result.rows[0];

  if (!row) {
    throw new Error(
      "Failed to create VPN session"
    );
  }

  return mapSession(row);
}

export async function findSessionById(
  userId: string,
  sessionId: string
): Promise<VPNSession | null> {
  const result =
    await db.query<SessionRow>(
      `
        SELECT
          id,
          user_id,
          device_id,
          server_id,
          protocol,
          state,
          started_at,
          ended_at,
          duration_seconds
        FROM vpn_sessions
        WHERE id = $1
          AND user_id = $2
        LIMIT 1
      `,
      [sessionId, userId]
    );

  const row = result.rows[0];

  return row
    ? mapSession(row)
    : null;
}

export async function updateSessionState(
  userId: string,
  sessionId: string,
  state: VPNConnectionState
): Promise<VPNSession | null> {
  const result =
    await db.query<SessionRow>(
      `
        UPDATE vpn_sessions
        SET
          state = $3,
          started_at =
            CASE
              WHEN $3 = 'connected'
                AND started_at IS NULL
              THEN NOW()
              ELSE started_at
            END,
          ended_at =
            CASE
              WHEN $3 = 'disconnected'
              THEN NOW()
              ELSE ended_at
            END,
          duration_seconds =
            CASE
              WHEN $3 = 'disconnected'
                AND started_at IS NOT NULL
              THEN EXTRACT(
                EPOCH FROM (NOW() - started_at)
              )::INTEGER
              ELSE duration_seconds
            END
        WHERE id = $1
          AND user_id = $2
        RETURNING
          id,
          user_id,
          device_id,
          server_id,
          protocol,
          state,
          started_at,
          ended_at,
          duration_seconds
      `,
      [
        sessionId,
        userId,
        state
      ]
    );

  const row = result.rows[0];

  return row
    ? mapSession(row)
    : null;
}

export async function listActiveSessions(
  userId: string
): Promise<VPNSession[]> {
  const result =
    await db.query<SessionRow>(
      `
        SELECT
          id,
          user_id,
          device_id,
          server_id,
          protocol,
          state,
          started_at,
          ended_at,
          duration_seconds
        FROM vpn_sessions
        WHERE user_id = $1
          AND state IN (
            'connecting',
            'connected',
            'reconnecting'
          )
        ORDER BY created_at DESC
      `,
      [userId]
    );

  return result.rows.map(
    mapSession
  );
}
