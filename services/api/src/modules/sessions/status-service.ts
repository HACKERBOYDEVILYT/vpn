import { findSessionById } from "./repository.js";

interface GetSessionStatusParams {
  userId: string;
  sessionId: string;
}

export async function getVPNSessionStatus(
  params: GetSessionStatusParams
) {
  const session = await findSessionById(
    params.sessionId,
    params.userId
  );

  if (!session) {
    throw new Error("SESSION_NOT_FOUND");
  }

  return {
    id: session.id,
    userId: session.user_id,
    deviceId: session.device_id,
    serverId: session.server_id,
    protocol: session.protocol,
    state: session.state,
    createdAt: session.created_at,
    updatedAt: session.updated_at
  };
}
