import type {
  VPNSession,
  VPNProtocol
} from "@nexavpn/types";

import {
  findServerById
} from "../servers/repository.js";

import {
  listUserDevices
} from "../devices/repository.js";

import {
  createSession,
  findSessionById,
  updateSessionState,
  listActiveSessions
} from "./repository.js";

export async function startVPNSession(
  userId: string,
  params: {
    deviceId: string;
    serverId: string;
    protocol: VPNProtocol;
  }
): Promise<VPNSession> {
  const device =
    (await listUserDevices(userId))
      .find(
        (item) =>
          item.id === params.deviceId
      );

  if (!device) {
    throw new Error(
      "DEVICE_NOT_FOUND"
    );
  }

  const server =
    await findServerById(
      params.serverId
    );

  if (!server) {
    throw new Error(
      "SERVER_NOT_FOUND"
    );
  }

  if (
    server.status !== "online"
  ) {
    throw new Error(
      "SERVER_UNAVAILABLE"
    );
  }

  if (
    !server.protocols.includes(
      params.protocol
    )
  ) {
    throw new Error(
      "PROTOCOL_NOT_SUPPORTED"
    );
  }

  return createSession(
    userId,
    params
  );
}

export async function getVPNSession(
  userId: string,
  sessionId: string
): Promise<VPNSession | null> {
  return findSessionById(
    userId,
    sessionId
  );
}

export async function changeVPNSessionState(
  userId: string,
  sessionId: string,
  state: VPNSession["state"]
): Promise<VPNSession> {
  const session =
    await updateSessionState(
      userId,
      sessionId,
      state
    );

  if (!session) {
    throw new Error(
      "SESSION_NOT_FOUND"
    );
  }

  return session;
}

export async function getActiveVPNSessions(
  userId: string
): Promise<VPNSession[]> {
  return listActiveSessions(
    userId
  );
}
