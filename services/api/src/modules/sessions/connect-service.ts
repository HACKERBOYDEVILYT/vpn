import type { VPNProtocol } from "@nexavpn/types";
import { generateClientVPNConfig } from "../vpn-config/config-service.js";
import { createSession, findActiveSessionByDevice } from "./repository.js";
import { releaseClientAddress } from "../vpn-config/address-service.js";

interface ConnectVPNParams {
  userId: string;
  deviceId: string;
  serverId: string;
  protocol: VPNProtocol;
}

export async function connectVPNSession(params: ConnectVPNParams) {
  const activeSession = await findActiveSessionByDevice(
    params.userId,
    params.deviceId
  );

  if (activeSession) {
    throw new Error("DEVICE_ALREADY_CONNECTED");
  }

  const vpnConfig = await generateClientVPNConfig({
    userId: params.userId,
    deviceId: params.deviceId,
    serverId: params.serverId,
    protocol: params.protocol
  });

  try {
    const session = await createSession({
      userId: params.userId,
      deviceId: params.deviceId,
      serverId: params.serverId,
      protocol: params.protocol,
      state: "connecting"
    });

    return {
      session,
      vpnConfig
    };
  } catch (error) {
    await releaseClientAddress(params.userId, params.deviceId, params.serverId);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "23505"
    ) {
      throw new Error("DEVICE_ALREADY_CONNECTED");
    }

    throw error;
  }
}
