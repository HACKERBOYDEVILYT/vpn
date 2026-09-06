import { randomUUID } from "node:crypto";

import { db } from "../../database/client.js";

export interface DeviceKeyRecord {
  id: string;
  deviceId: string;
  keyType: "wireguard";
  publicKey: string;
  privateKeyEncrypted: string | null;
  createdAt: string;
  rotatedAt?: string;
}

interface DeviceKeyRow {
  id: string;
  device_id: string;
  key_type: "wireguard";
  public_key: string;
  private_key_encrypted: string | null;
  created_at: Date;
  rotated_at: Date | null;
}

function mapKey(
  row: DeviceKeyRow
): DeviceKeyRecord {
  return {
    id: row.id,
    deviceId: row.device_id,
    keyType: row.key_type,
    publicKey: row.public_key,
    privateKeyEncrypted:
      row.private_key_encrypted,
    createdAt:
      row.created_at.toISOString(),
    rotatedAt:
      row.rotated_at?.toISOString()
  };
}

export async function findDeviceKey(
  deviceId: string
): Promise<DeviceKeyRecord | null> {
  const result =
    await db.query<DeviceKeyRow>(
      `
        SELECT
          id,
          device_id,
          key_type,
          public_key,
          private_key_encrypted,
          created_at,
          rotated_at
        FROM device_keys
        WHERE device_id = $1
          AND key_type = 'wireguard'
        LIMIT 1
      `,
      [deviceId]
    );

  const row = result.rows[0];

  return row
    ? mapKey(row)
    : null;
}

export async function createDeviceKey(
  deviceId: string,
  publicKey: string,
  privateKeyEncrypted: string
): Promise<DeviceKeyRecord> {
  const result =
    await db.query<DeviceKeyRow>(
      `
        INSERT INTO device_keys (
          id,
          device_id,
          key_type,
          public_key,
          private_key_encrypted
        )
        VALUES (
          $1,
          $2,
          'wireguard',
          $3,
          $4
        )
        RETURNING
          id,
          device_id,
          key_type,
          public_key,
          private_key_encrypted,
          created_at,
          rotated_at
      `,
      [
        randomUUID(),
        deviceId,
        publicKey,
        privateKeyEncrypted
      ]
    );

  const row = result.rows[0];

  if (!row) {
    throw new Error(
      "Failed to create device key"
    );
  }

  return mapKey(row);
}
