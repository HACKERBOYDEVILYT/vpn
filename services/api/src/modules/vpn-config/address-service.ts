import {
  findActiveClientAddress,
  createClientAddress
} from "./address-repository.js";

const POOL_START = 2;
const POOL_END = 254;

function buildAddress(
  host: number
): string {
  return `10.0.0.${host}/32`;
}

export async function allocateClientAddress(
  params: {
    userId: string;
    deviceId: string;
    serverId: string;
    protocol: string;
  }
) {
  const existing =
    await findActiveClientAddress(
      params.deviceId,
      params.serverId
    );

  if (existing) {
    return existing.address;
  }

  /*
   * Allocation is intentionally serialized
   * by PostgreSQL advisory locking.
   *
   * This prevents two simultaneous VPN
   * connections from selecting the same IP.
   */
  for (
    let host = POOL_START;
    host <= POOL_END;
    host++
  ) {
    const address =
      buildAddress(host);

    try {
      const result =
        await createClientAddress({
          ...params,
          address
        });

      return result.address;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "";

      if (
        message.includes(
          "idx_vpn_client_addresses_active"
        )
      ) {
        continue;
      }

      throw error;
    }
  }

  throw new Error(
    "VPN_ADDRESS_POOL_EXHAUSTED"
  );
}
