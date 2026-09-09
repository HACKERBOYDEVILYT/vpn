import {
  findSessionById
} from "./repository.js";

import {
  getSessionTelemetrySummary
} from "./telemetry-summary.js";

interface SummaryParams {
  userId: string;
  sessionId: string;
}

export async function getVPNSessionUsageSummary(
  params: SummaryParams
) {
  const session = await findSessionById(
    params.sessionId,
    params.userId
  );

  if (!session) {
    throw new Error("SESSION_NOT_FOUND");
  }

  const summary =
    await getSessionTelemetrySummary(session.id);

  return {
    session: {
      id: session.id,
      state: session.state,
      deviceId: session.device_id,
      serverId: session.server_id,
      protocol: session.protocol
    },
    usage: summary
  };
}
