import { findSessionById, updateSessionState } from "./repository.js";
import { generateClientVPNConfig } from "../vpn-config/config-service.js";

interface ReconnectVPNParams {
  userId: string;
  sessionId: string;
}

export async function reconnectVPNSession(
  params: ReconnectVPNParams
) {
  const session = await findSessionById(
    params.sessionId,
    params.userId
  );

  if (!session) {
    throw new Error("SESSION_NOT_FOUND");
  }

  if (
    session.state !== "connected" &&
    session.state !== "failed"
  ) {
    throw new Error("SESSION_NOT_RECONNECTABLE");
  }

  await updateSessionState(
    params.sessionId,
    "reconnecting"
  );

  try {
    const vpnConfig = await generateClientVPNConfig({
      userId: session.user_id,
      deviceId: session.device_id,
      serverId: session.server_id,
      protocol: session.protocol
    });

    return {
      sessionId: session.id,
      state: "reconnecting",
      vpnConfig
    };
  } catch (error) {
    await updateSessionState(
      params.sessionId,
      "failed"
    );

    throw error;
  }
}
