import {
  ensureSessionTelemetry
} from "./telemetry-repository.js";

export async function initializeSessionTelemetry(
  sessionId: string
) {
  const telemetry =
    await ensureSessionTelemetry(sessionId);

  return {
    sessionId: telemetry.session_id,
    bytesIn: telemetry.bytes_in,
    bytesOut: telemetry.bytes_out,
    packetsIn: telemetry.packets_in,
    packetsOut: telemetry.packets_out,
    connectedAt: telemetry.connected_at,
    lastReportedAt: telemetry.last_reported_at
  };
}
