import {
  findSessionById,
  updateSessionState
} from "./repository.js";

interface CompleteReconnectParams {
  userId: string;
  sessionId: string;
}

export async function completeVPNReconnect(
  params: CompleteReconnectParams
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

  const updatedSession = await updateSessionState(
    session.id,
    "connected"
  );

  return {
    session: updatedSession
  };
}
