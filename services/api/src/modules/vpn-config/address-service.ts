import {
  findActiveClientAddress,
  createClientAddress,
  releaseClientAddress
} from "./address-repository.js";

import {
  acquireAddressLock,
  releaseAddressLock
} from "./address-lock.js";

const POOL_START = 2;
const POOL_END = 254;

function buildAddress(
  host: number
): string {
  return `10.0.0.${host}/32`;
}

function isUniqueViolation(
  error: unknown
): boolean {
  if (
    typeof error !== "object" ||
    error === null
  ) {
    return false;
  }

  return (
    "code" in error &&
    String(
      (error as { code: unknown }).code
    ) === "23505"
  );
}

export async function allocateClientAddress(
  params: {
    userId: string;
    deviceId: string;
    serverId: string;
    protocol: string;
  }
): Promise<string> {
  const existing =
    await findActiveClientAddress(
      params.deviceId,
      params.serverId
    );

  if (existing) {
    return existing.address;
  }

  await acquireAddressLock(
    params.serverId
  );

  try {
    const lockedExisting =
      await findActiveClientAddress(
        params.deviceId,
        params.serverId
      );

    if (lockedExisting) {
      return lockedExisting.address;
    }

    for (
      let host = POOL_START;
      host <= POOL_END;
      host++
    ) {
      try {
        const result =
          await createClientAddress({
            ...params,
            address:
              buildAddress(host)
          });

        return result.address;
      } catch (error) {
        if (
          isUniqueViolation(error)
        ) {
          continue;
        }

        throw error;
      }
    }

    throw new Error(
      "VPN_ADDRESS_POOL_EXHAUSTED"
    );
  } finally {
    await releaseAddressLock(
      params.serverId
    );
  }
}

export async function releaseAllocatedAddress(
  params: {
    userId: string;
    deviceId: string;
    serverId: string;
  }
): Promise<void> {
  await releaseClientAddress(
    params.userId,
    params.deviceId,
    params.serverId
  );
}
