import {
  findSessionById,
  updateSessionState
} from "./repository.js";

import { releaseClientAddress } from "../vpn-config/address-service.js";
import { markTelemetryEnded } from "./telemetry-repository.js";

export async function disconnectVPNSession(
  userId: string,
  sessionId: string
) {
  const session = await findSessionById(
    sessionId,
    userId
  );

  if (!session) {
    const error = new Error("SESSION_NOT_FOUND");
    throw error;
  }

  if (session.state === "disconnected") {
    await markTelemetryEnded(session.id);

    return {
      session,
      alreadyDisconnected: true
    };
  }

  const updatedSession = await updateSessionState(
    session.id,
    "disconnected"
  );

  await markTelemetryEnded(session.id);

  await releaseClientAddress(
    session.user_id,
    session.device_id,
    session.server_id
  );

  return {
    session: updatedSession,
    alreadyDisconnected: false
  };
}
