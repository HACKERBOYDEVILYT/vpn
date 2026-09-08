import {
  findSessionById,
  updateSessionState
} from "./repository.js";

import {
  releaseAllocatedAddress
} from "../vpn-config/address-service.js";

export async function disconnectVPNSession(
  params: {
    userId: string;
    sessionId: string;
  }
) {
  const session =
    await findSessionById(
      params.userId,
      params.sessionId
    );

  if (!session) {
    throw new Error(
      "SESSION_NOT_FOUND"
    );
  }

  if (
    session.state ===
      "disconnected" ||
    session.state ===
      "failed"
  ) {
    return session;
  }

  const updated =
    await updateSessionState(
      params.userId,
      params.sessionId,
      "disconnected"
    );

  if (
    session.device_id &&
    session.server_id
  ) {
    await releaseAllocatedAddress({
      userId:
        params.userId,
      deviceId:
        session.device_id,
      serverId:
        session.server_id
    });
  }

  return updated;
}
