import {
  createHash,
  timingSafeEqual
} from "node:crypto";

export function hashRefreshToken(
  token: string
): string {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}

export function compareHashes(
  actual: string,
  expected: string
): boolean {
  const actualBuffer = Buffer.from(
    actual,
    "hex"
  );

  const expectedBuffer = Buffer.from(
    expected,
    "hex"
  );

  if (
    actualBuffer.length !== expectedBuffer.length
  ) {
    return false;
  }

  return timingSafeEqual(
    actualBuffer,
    expectedBuffer
  );
}
