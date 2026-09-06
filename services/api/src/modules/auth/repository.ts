import { randomUUID } from "node:crypto";

import type { User } from "@nexavpn/types";

import { db } from "../../database/client.js";

interface UserRow {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  email_verified: boolean;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

interface SessionRow {
  id: string;
  user_id: string;
  refresh_token_hash: string;
  expires_at: Date;
  revoked_at: Date | null;
}

function mapUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name ?? undefined,
    avatarUrl: row.avatar_url ?? undefined,
    emailVerified: row.email_verified,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString()
  };
}

export async function findUserByEmail(
  email: string
): Promise<
  | (User & { passwordHash: string })
  | null
> {
  const result = await db.query<UserRow>(
    `
      SELECT
        id,
        email,
        display_name,
        avatar_url,
        email_verified,
        password_hash,
        created_at,
        updated_at
      FROM users
      WHERE email = $1
      LIMIT 1
    `,
    [email.toLowerCase()]
  );

  const row = result.rows[0];

  if (!row) {
    return null;
  }

  return {
    ...mapUser(row),
    passwordHash: row.password_hash
  };
}

export async function findUserById(
  userId: string
): Promise<User | null> {
  const result = await db.query<UserRow>(
    `
      SELECT
        id,
        email,
        display_name,
        avatar_url,
        email_verified,
        password_hash,
        created_at,
        updated_at
      FROM users
      WHERE id = $1
      LIMIT 1
    `,
    [userId]
  );

  const row = result.rows[0];

  return row ? mapUser(row) : null;
}

export async function createUser(params: {
  email: string;
  passwordHash: string;
  displayName?: string;
}): Promise<User> {
  const id = randomUUID();

  const result = await db.query<UserRow>(
    `
      INSERT INTO users (
        id,
        email,
        password_hash,
        display_name,
        email_verified
      )
      VALUES ($1, $2, $3, $4, false)
      RETURNING
        id,
        email,
        display_name,
        avatar_url,
        email_verified,
        password_hash,
        created_at,
        updated_at
    `,
    [
      id,
      params.email.toLowerCase(),
      params.passwordHash,
      params.displayName ?? null
    ]
  );

  const row = result.rows[0];

  if (!row) {
    throw new Error("Failed to create user");
  }

  return mapUser(row);
}

export async function createSession(params: {
  userId: string;
  refreshTokenHash: string;
  expiresAt: Date;
}): Promise<string> {
  const sessionId = randomUUID();

  await db.query(
    `
      INSERT INTO sessions (
        id,
        user_id,
        refresh_token_hash,
        expires_at
      )
      VALUES ($1, $2, $3, $4)
    `,
    [
      sessionId,
      params.userId,
      params.refreshTokenHash,
      params.expiresAt
    ]
  );

  return sessionId;
}

export async function findSession(
  sessionId: string
): Promise<SessionRow | null> {
  const result = await db.query<SessionRow>(
    `
      SELECT
        id,
        user_id,
        refresh_token_hash,
        expires_at,
        revoked_at
      FROM sessions
      WHERE id = $1
      LIMIT 1
    `,
    [sessionId]
  );

  return result.rows[0] ?? null;
}
