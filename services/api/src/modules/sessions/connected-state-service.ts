import {
  findSessionById,
  updateSessionState
} from "./repository.js";

import {
  markSessionConnected
} from "./telemetry-state-service.js";

interface ConnectedStateParams {
  userId: string;
  sessionId: string;
}

export async function markVPNSessionConnected(
  params: ConnectedStateParams
) {
  const session = await findSessionById(
    params.sessionId,
    params.userId
  );

  if (!session) {
    throw new Error("SESSION_NOT_FOUND");
  }

  if (
    session.state !== "connecting" &&
    session.state !== "reconnecting"
  ) {
    throw new Error("INVALID_SESSION_STATE");
  }

  const updatedSession = await updateSessionState(
    session.id,
    "connected"
  );

  const telemetry =
    await markSessionConnected(session.id);

  return {
    session: updatedSession,
    telemetry
  };
}
