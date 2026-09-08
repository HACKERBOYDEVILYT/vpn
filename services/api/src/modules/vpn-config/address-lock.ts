import {
  query
} from "../../database/client.js";

function hashLockKey(
  serverId: string
): bigint {
  let hash = 0n;

  for (const char of serverId) {
    hash =
      (hash * 31n +
        BigInt(char.charCodeAt(0))) &
      0x7fffffffffffffffn;
  }

  return hash;
}

export async function acquireAddressLock(
  serverId: string
): Promise<void> {
  await query(
    `
      SELECT pg_advisory_lock($1)
    `,
    [
      hashLockKey(serverId)
    ]
  );
}

export async function releaseAddressLock(
  serverId: string
): Promise<void> {
  await query(
    `
      SELECT pg_advisory_unlock($1)
    `,
    [
      hashLockKey(serverId)
    ]
  );
}
