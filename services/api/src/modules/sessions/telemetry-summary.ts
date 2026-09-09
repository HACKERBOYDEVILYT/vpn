import {
  getSessionTelemetry
} from "./telemetry-repository.js";

export async function getSessionTelemetrySummary(
  sessionId: string
) {
  const telemetry =
    await getSessionTelemetry(sessionId);

  if (!telemetry) {
    return {
      sessionId,
      bytesIn: 0,
      bytesOut: 0,
      totalBytes: 0,
      packetsIn: 0,
      packetsOut: 0,
      totalPackets: 0,
      connectedAt: null,
      lastReportedAt: null
    };
  }

  const bytesIn = Number(telemetry.bytes_in);
  const bytesOut = Number(telemetry.bytes_out);

  const packetsIn = Number(telemetry.packets_in);
  const packetsOut = Number(telemetry.packets_out);

  return {
    sessionId: telemetry.session_id,
    bytesIn,
    bytesOut,
    totalBytes: bytesIn + bytesOut,
    packetsIn,
    packetsOut,
    totalPackets: packetsIn + packetsOut,
    connectedAt: telemetry.connected_at,
    lastReportedAt: telemetry.last_reported_at
  };
}
