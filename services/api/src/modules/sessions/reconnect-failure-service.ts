import {
  findSessionById,
  updateSessionState
} from "./repository.js";
import { releaseClientAddress } from "../vpn-config/address-service.js";

interface ReconnectFailureParams {
  userId: string;
  sessionId: string;
}

export async function failVPNReconnect(
  params: ReconnectFailureParams
) {
  const session = await findSessionById(
    params.sessionId,
    params.userId
  );

  if (!session) {
    throw new Error("SESSION_NOT_FOUND");
  }

  if (session.state !== "reconnecting") {
    throw new Error("INVALID_RECONNECT_STATE");
  }

  const failedSession = await updateSessionState(
    session.id,
    "failed"
  );

  await releaseClientAddress(
    session.user_id,
    session.device_id,
    session.server_id
  );

  return {
    session: failedSession
  };
}
