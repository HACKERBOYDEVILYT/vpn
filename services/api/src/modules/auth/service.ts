import type { User } from "@nexavpn/types";

import {
  createAccessToken,
  createRefreshToken,
  ACCESS_TOKEN_EXPIRES_IN
} from "./token.js";

import {
  createSession,
  createUser,
  findUserByEmail
} from "./repository.js";

import {
  hashPassword,
  verifyPassword
} from "./password.js";

import {
  hashRefreshToken
} from "./crypto.js";

import type { AuthTokens } from "./types.js";

const REFRESH_TOKEN_TTL_DAYS = 30;

export async function registerUser(params: {
  email: string;
  password: string;
  displayName?: string;
}): Promise<{
  user: User;
  tokens: AuthTokens;
}> {
  const existingUser =
    await findUserByEmail(params.email);

  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const passwordHash =
    await hashPassword(params.password);

  const user = await createUser({
    email: params.email,
    passwordHash,
    displayName: params.displayName
  });

  return createAuthSession(user);
}

export async function loginUser(params: {
  email: string;
  password: string;
}): Promise<{
  user: User;
  tokens: AuthTokens;
}> {
  const user =
    await findUserByEmail(params.email);

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const validPassword =
    await verifyPassword(
      params.password,
      user.passwordHash
    );

  if (!validPassword) {
    throw new Error("INVALID_CREDENTIALS");
  }

  return createAuthSession(user);
}

async function createAuthSession(
  user: User
): Promise<{
  user: User;
  tokens: AuthTokens;
}> {
  const refreshToken =
    createRefreshToken();

  const expiresAt = new Date(
    Date.now() +
      REFRESH_TOKEN_TTL_DAYS *
        24 *
        60 *
        60 *
        1000
  );

  const sessionId =
    await createSession({
      userId: user.id,
      refreshTokenHash:
        hashRefreshToken(refreshToken),
      expiresAt
    });

  const accessToken =
    createAccessToken(
      user.id,
      sessionId
    );

  return {
    user,
    tokens: {
      accessToken,
      refreshToken,
      expiresIn:
        ACCESS_TOKEN_EXPIRES_IN
    }
  };
}
