import {
  findSessionById,
  updateSessionState
} from "./repository.js";

const ALLOWED_TRANSITIONS: Record<
  string,
  string[]
> = {
  connecting: [
    "connected",
    "failed",
    "disconnected"
  ],

  connected: [
    "reconnecting",
    "disconnected",
    "failed"
  ],

  reconnecting: [
    "connected",
    "failed",
    "disconnected"
  ],

  failed: [
    "connecting",
    "disconnected"
  ],

  disconnected: [
    "connecting"
  ]
};

export async function transitionSession(
  params: {
    userId: string;
    sessionId: string;
    nextState: string;
  }
) {
  const session =
    await findSessionById(
      params.userId,
      params.sessionId
    );

  if (!session) {
    throw new Error(
      "SESSION_NOT_FOUND"
    );
  }

  const currentState =
    String(session.state);

  const allowed =
    ALLOWED_TRANSITIONS[
      currentState
    ] ?? [];

  if (
    !allowed.includes(
      params.nextState
    )
  ) {
    throw new Error(
      "INVALID_SESSION_TRANSITION"
    );
  }

  return updateSessionState(
    params.userId,
    params.sessionId,
    params.nextState
  );
}
