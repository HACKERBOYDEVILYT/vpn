import type {
  FavoriteServer
} from "@nexavpn/types";

import { db } from "../../database/client.js";

interface FavoriteRow {
  user_id: string;
  server_id: string;
  created_at: Date;
}

function mapFavorite(
  row: FavoriteRow
): FavoriteServer {
  return {
    userId: row.user_id,
    serverId: row.server_id,
    createdAt:
      row.created_at.toISOString()
  };
}

export async function listFavorites(
  userId: string
): Promise<FavoriteServer[]> {
  const result =
    await db.query<FavoriteRow>(
      `
        SELECT
          user_id,
          server_id,
          created_at
        FROM favorite_servers
        WHERE user_id = $1
        ORDER BY created_at DESC
      `,
      [userId]
    );

  return result.rows.map(mapFavorite);
}

export async function addFavorite(
  userId: string,
  serverId: string
): Promise<FavoriteServer> {
  const result =
    await db.query<FavoriteRow>(
      `
        INSERT INTO favorite_servers (
          user_id,
          server_id
        )
        VALUES ($1, $2)
        ON CONFLICT (
          user_id,
          server_id
        )
        DO UPDATE SET
          created_at =
            favorite_servers.created_at
        RETURNING
          user_id,
          server_id,
          created_at
      `,
      [
        userId,
        serverId
      ]
    );

  const row = result.rows[0];

  if (!row) {
    throw new Error(
      "Failed to add favorite server"
    );
  }

  return mapFavorite(row);
}

export async function removeFavorite(
  userId: string,
  serverId: string
): Promise<boolean> {
  const result =
    await db.query(
      `
        DELETE FROM favorite_servers
        WHERE user_id = $1
          AND server_id = $2
      `,
      [
        userId,
        serverId
      ]
    );

  return result.rowCount === 1;
}
