import { db } from "../../database/client.js";

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserRow {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  email_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

function mapUser(row: UserRow): UserProfile {
  return {
    id: row.id,
    email: row.email,
    displayName:
      row.display_name ?? undefined,
    avatarUrl:
      row.avatar_url ?? undefined,
    emailVerified:
      row.email_verified,
    createdAt:
      row.created_at.toISOString(),
    updatedAt:
      row.updated_at.toISOString()
  };
}

export async function getUserProfile(
  userId: string
): Promise<UserProfile | null> {
  const result = await db.query<UserRow>(
    `
      SELECT
        id,
        email,
        display_name,
        avatar_url,
        email_verified,
        created_at,
        updated_at
      FROM users
      WHERE id = $1
      LIMIT 1
    `,
    [userId]
  );

  const row = result.rows[0];

  return row
    ? mapUser(row)
    : null;
}

export async function updateUserProfile(
  userId: string,
  params: {
    displayName?: string;
    avatarUrl?: string;
  }
): Promise<UserProfile | null> {
  const result = await db.query<UserRow>(
    `
      UPDATE users
      SET
        display_name = COALESCE($2, display_name),
        avatar_url = COALESCE($3, avatar_url)
      WHERE id = $1
      RETURNING
        id,
        email,
        display_name,
        avatar_url,
        email_verified,
        created_at,
        updated_at
    `,
    [
      userId,
      params.displayName ?? null,
      params.avatarUrl ?? null
    ]
  );

  const row = result.rows[0];

  return row
    ? mapUser(row)
    : null;
}
