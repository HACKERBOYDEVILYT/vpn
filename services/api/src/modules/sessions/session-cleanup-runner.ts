import { cleanupStaleVPNSessions } from "./stale-session-cleanup.js";

let timer: NodeJS.Timeout | undefined;
let running = false;

const CLEANUP_INTERVAL_MS = 30_000;

export function startSessionCleanupRunner() {
  if (timer) {
    return;
  }

  timer = setInterval(async () => {
    if (running) {
      return;
    }

    running = true;

    try {
      await cleanupStaleVPNSessions();
    } catch (error) {
      console.error(
        "[session-cleanup] cleanup failed",
        error
      );
    } finally {
      running = false;
    }
  }, CLEANUP_INTERVAL_MS);

  timer.unref();
}

export function stopSessionCleanupRunner() {
  if (!timer) {
    return;
  }

  clearInterval(timer);
  timer = undefined;
}
