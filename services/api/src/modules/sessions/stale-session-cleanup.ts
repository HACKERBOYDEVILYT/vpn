import { query } from "../../database/client.js";
import { releaseClientAddress } from "../vpn-config/address-service.js";
import { findStaleVPNSessions } from "./stale-session-service.js";

export async function cleanupStaleVPNSessions() {
  const sessions = await findStaleVPNSessions();

  let cleaned = 0;

  for (const session of sessions) {
    try {
      await query(
        `
          UPDATE vpn_sessions
          SET
            state = 'failed',
            updated_at = NOW()
          WHERE id = $1
          AND state IN (
            'connecting',
            'connected',
            'reconnecting'
          )
        `,
        [session.id]
      );

      await releaseClientAddress(
        session.user_id,
        session.device_id,
        session.server_id
      );

      cleaned++;
    } catch {
      // Continue cleaning other stale sessions.
    }
  }

  return {
    scanned: sessions.length,
    cleaned
  };
}
