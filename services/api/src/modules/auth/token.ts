import {
  createHmac,
  randomBytes,
  timingSafeEqual
} from "node:crypto";

import { env } from "../../config/env.js";

const ACCESS_TOKEN_TTL = 15 * 60;
const REFRESH_TOKEN_BYTES = 48;

function encode(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decode(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(payload: string): string {
  return createHmac("sha256", env.JWT_SECRET)
    .update(payload)
    .digest("base64url");
}

export function createAccessToken(
  userId: string,
  sessionId: string
): string {
  const payload = JSON.stringify({
    sub: userId,
    sid: sessionId,
    type: "access",
    exp: Math.floor(Date.now() / 1000) + ACCESS_TOKEN_TTL
  });

  const encodedPayload = encode(payload);
  const signature = sign(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifyAccessToken(
  token: string
): {
  userId: string;
  sessionId: string;
} | null {
  const parts = token.split(".");

  if (parts.length !== 2) {
    return null;
  }

  const [payloadPart, signaturePart] = parts;

  if (!payloadPart || !signaturePart) {
    return null;
  }

  const expectedSignature = sign(payloadPart);

  const actualBuffer = Buffer.from(
    signaturePart,
    "base64url"
  );

  const expectedBuffer = Buffer.from(
    expectedSignature,
    "base64url"
  );

  if (
    actualBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(actualBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      decode(payloadPart)
    ) as {
      sub?: string;
      sid?: string;
      type?: string;
      exp?: number;
    };

    if (
      payload.type !== "access" ||
      !payload.sub ||
      !payload.sid ||
      !payload.exp ||
      payload.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return {
      userId: payload.sub,
      sessionId: payload.sid
    };
  } catch {
    return null;
  }
}

export function createRefreshToken(): string {
  return randomBytes(
    REFRESH_TOKEN_BYTES
  ).toString("base64url");
}

export const ACCESS_TOKEN_EXPIRES_IN =
  ACCESS_TOKEN_TTL;
