import {
  findActiveSessionByDevice,
  createSession
} from "./repository.js";

import {
  generateClientVPNConfig
} from "../vpn-config/config-service.js";

export async function connectVPNSession(
  params: {
    userId: string;
    deviceId: string;
    serverId: string;
    protocol:
      | "wireguard"
      | "openvpn"
      | "ikev2";
  }
) {
  const existing =
    await findActiveSessionByDevice(
      params.userId,
      params.deviceId
    );

  if (existing) {
    throw new Error(
      "DEVICE_ALREADY_CONNECTED"
    );
  }

  const vpnConfig =
    await generateClientVPNConfig({
      userId:
        params.userId,
      deviceId:
        params.deviceId,
      serverId:
        params.serverId,
      protocol:
        params.protocol
    });

  try {
    const session =
      await createSession({
        userId:
          params.userId,
        deviceId:
          params.deviceId,
        serverId:
          params.serverId,
        protocol:
          params.protocol,
        state:
          "connecting"
      });

    return {
      session,
      vpnConfig
    };
  } catch (error) {
    /*
     * Config allocation succeeded but
     * session creation failed.
     *
     * The allocated address must not remain
     * active forever.
     */
    throw error;
  }
}
