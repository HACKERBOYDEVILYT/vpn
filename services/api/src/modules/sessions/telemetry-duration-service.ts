import {
  findSessionById
} from "./repository.js";

import {
  getSessionTelemetry
} from "./telemetry-repository.js";

import {
  calculateConnectedDuration
} from "./telemetry-duration.js";

interface DurationParams {
  userId: string;
  sessionId: string;
}

export async function getVPNSessionDuration(
  params: DurationParams
) {
  const session = await findSessionById(
    params.sessionId,
    params.userId
  );

  if (!session) {
    throw new Error("SESSION_NOT_FOUND");
  }

  const telemetry =
    await getSessionTelemetry(session.id);

  const durationSeconds =
    calculateConnectedDuration(
      telemetry?.connected_at ?? null,
      session.state === "disconnected"
        ? session.updated_at
        : null
    );

  return {
    sessionId: session.id,
    state: session.state,
    durationSeconds,
    connectedAt: telemetry?.connected_at ?? null
  };
}
