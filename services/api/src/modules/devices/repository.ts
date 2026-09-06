import { randomUUID } from "node:crypto";

import type {
  Device
} from "@nexavpn/types";

import { db } from "../../database/client.js";

interface DeviceRow {
  id: string;
  user_id: string;
  name: string;
  platform:
    | "android"
    | "ios"
    | "windows"
    | "macos"
    | "linux"
    | "web";
  app_version: string | null;
  last_seen_at: Date | null;
  created_at: Date;
}

function mapDevice(
  row: DeviceRow
): Device {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    platform: row.platform,
    appVersion:
      row.app_version ?? undefined,
    lastSeenAt:
      row.last_seen_at?.toISOString(),
    createdAt:
      row.created_at.toISOString()
  };
}

export async function createDevice(
  userId: string,
  params: {
    name: string;
    platform: Device["platform"];
    appVersion?: string;
  }
): Promise<Device> {
  const result =
    await db.query<DeviceRow>(
      `
        INSERT INTO devices (
          id,
          user_id,
          name,
          platform,
          app_version
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
          id,
          user_id,
          name,
          platform,
          app_version,
          last_seen_at,
          created_at
      `,
      [
        randomUUID(),
        userId,
        params.name,
        params.platform,
        params.appVersion ?? null
      ]
    );

  const row = result.rows[0];

  if (!row) {
    throw new Error(
      "Failed to create device"
    );
  }

  return mapDevice(row);
}

export async function listUserDevices(
  userId: string
): Promise<Device[]> {
  const result =
    await db.query<DeviceRow>(
      `
        SELECT
          id,
          user_id,
          name,
          platform,
          app_version,
          last_seen_at,
          created_at
        FROM devices
        WHERE user_id = $1
        ORDER BY created_at DESC
      `,
      [userId]
    );

  return result.rows.map(mapDevice);
}

export async function deleteDevice(
  userId: string,
  deviceId: string
): Promise<boolean> {
  const result =
    await db.query(
      `
        DELETE FROM devices
        WHERE id = $1
          AND user_id = $2
      `,
      [
        deviceId,
        userId
      ]
    );

  return result.rowCount === 1;
}
