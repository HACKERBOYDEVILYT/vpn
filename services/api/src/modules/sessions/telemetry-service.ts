import {
  findSessionById
} from "./repository.js";

import {
  getSessionTelemetry,
  ensureSessionTelemetry,
  updateSessionTelemetry
} from "./telemetry-repository.js";

interface TelemetryParams {
  userId: string;
  sessionId: string;
}

export async function getVPNSessionTelemetry(
  params: TelemetryParams
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

  return (
    telemetry ??
    ensureSessionTelemetry(session.id)
  );
}

export async function reportVPNSessionTelemetry(
  params: TelemetryParams & {
    bytesIn: number;
    bytesOut: number;
    packetsIn: number;
    packetsOut: number;
  }
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

  if (
    !Number.isSafeInteger(params.bytesIn) ||
    params.bytesIn < 0 ||
    !Number.isSafeInteger(params.bytesOut) ||
    params.bytesOut < 0 ||
    !Number.isSafeInteger(params.packetsIn) ||
    params.packetsIn < 0 ||
    !Number.isSafeInteger(params.packetsOut) ||
    params.packetsOut < 0
  ) {
    throw new Error("INVALID_TELEMETRY");
  }

  return updateSessionTelemetry(
    session.id,
    {
      bytesIn: params.bytesIn,
      bytesOut: params.bytesOut,
      packetsIn: params.packetsIn,
      packetsOut: params.packetsOut
    }
  );
}
