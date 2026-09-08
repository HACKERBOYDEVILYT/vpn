import {
  query
} from "../../database/client.js";

export async function findActiveSessionByDevice(
  userId: string,
  deviceId: string
) {
  const result = await query(
    `
      SELECT *
      FROM vpn_sessions
      WHERE user_id = $1
        AND device_id = $2
        AND state IN (
          'connecting',
          'connected',
          'reconnecting'
        )
      ORDER BY created_at DESC
      LIMIT 1
    `,
    [
      userId,
      deviceId
    ]
  );

  return result.rows[0] ?? null;
}

export async function findSessionById(
  userId: string,
  sessionId: string
) {
  const result = await query(
    `
      SELECT *
      FROM vpn_sessions
      WHERE id = $1
        AND user_id = $2
      LIMIT 1
    `,
    [
      sessionId,
      userId
    ]
  );

  return result.rows[0] ?? null;
}

export async function createSession(
  params: {
    userId: string;
    deviceId: string;
    serverId: string;
    protocol: string;
    state: string;
  }
) {
  const result = await query(
    `
      INSERT INTO vpn_sessions (
        user_id,
        device_id,
        server_id,
        protocol,
        state
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
    [
      params.userId,
      params.deviceId,
      params.serverId,
      params.protocol,
      params.state
    ]
  );

  return result.rows[0];
}

export async function updateSessionState(
  userId: string,
  sessionId: string,
  state: string
) {
  const result = await query(
    `
      UPDATE vpn_sessions
      SET
        state = $3,
        updated_at = NOW()
      WHERE id = $1
        AND user_id = $2
      RETURNING *
    `,
    [
      sessionId,
      userId,
      state
    ]
  );

  return result.rows[0] ?? null;
}
