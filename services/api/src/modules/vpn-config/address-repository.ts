import {
  query
} from "../../database/client.js";

export interface VPNClientAddress {
  id: string;
  userId: string;
  deviceId: string;
  serverId: string;
  address: string;
  protocol: string;
}

export async function findActiveClientAddress(
  deviceId: string,
  serverId: string
): Promise<VPNClientAddress | null> {
  const result =
    await query<VPNClientAddress>(
      `
        SELECT
          id,
          user_id AS "userId",
          device_id AS "deviceId",
          server_id AS "serverId",
          address::text AS address,
          protocol
        FROM vpn_client_addresses
        WHERE device_id = $1
          AND server_id = $2
          AND released_at IS NULL
        LIMIT 1
      `,
      [
        deviceId,
        serverId
      ]
    );

  return result.rows[0] ?? null;
}

export async function findActiveClientAddressForUser(
  userId: string,
  deviceId: string,
  serverId: string
): Promise<VPNClientAddress | null> {
  const result =
    await query<VPNClientAddress>(
      `
        SELECT
          id,
          user_id AS "userId",
          device_id AS "deviceId",
          server_id AS "serverId",
          address::text AS address,
          protocol
        FROM vpn_client_addresses
        WHERE user_id = $1
          AND device_id = $2
          AND server_id = $3
          AND released_at IS NULL
        LIMIT 1
      `,
      [
        userId,
        deviceId,
        serverId
      ]
    );

  return result.rows[0] ?? null;
}

export async function createClientAddress(
  params: {
    userId: string;
    deviceId: string;
    serverId: string;
    address: string;
    protocol: string;
  }
): Promise<VPNClientAddress> {
  const result =
    await query<VPNClientAddress>(
      `
        INSERT INTO vpn_client_addresses (
          user_id,
          device_id,
          server_id,
          address,
          protocol
        )
        VALUES ($1, $2, $3, $4::inet, $5)
        RETURNING
          id,
          user_id AS "userId",
          device_id AS "deviceId",
          server_id AS "serverId",
          address::text AS address,
          protocol
      `,
      [
        params.userId,
        params.deviceId,
        params.serverId,
        params.address,
        params.protocol
      ]
    );

  return result.rows[0];
}

export async function releaseClientAddress(
  userId: string,
  deviceId: string,
  serverId: string
): Promise<void> {
  await query(
    `
      UPDATE vpn_client_addresses
      SET released_at = NOW()
      WHERE user_id = $1
        AND device_id = $2
        AND server_id = $3
        AND released_at IS NULL
    `,
    [
      userId,
      deviceId,
      serverId
    ]
  );
}
