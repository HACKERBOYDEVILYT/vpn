import {
  findSessionById,
  updateSessionHeartbeat
} from "./repository.js";

interface HeartbeatParams {
  userId: string;
  sessionId: string;
}

export async function heartbeatVPNSession(
  params: HeartbeatParams
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
    session.state !== "connected" &&
    session.state !== "reconnecting"
  ) {
    throw new Error("SESSION_NOT_ACTIVE");
  }

  const updatedSession = await updateSessionHeartbeat(
    session.id
  );

  return {
    sessionId: updatedSession.id,
    state: updatedSession.state,
    updatedAt: updatedSession.updated_at
  };
}
