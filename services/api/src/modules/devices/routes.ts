import type {
  FastifyInstance
} from "fastify";

import {
  requireAuth
} from "../auth/guard.js";

import {
  RegisterDeviceSchema,
  DeviceIdSchema
} from "./schema.js";

import {
  createDevice,
  listUserDevices,
  deleteDevice
} from "./repository.js";

export async function registerDeviceRoutes(
  app: FastifyInstance
): Promise<void> {
  app.get(
    "/devices",
    {
      preHandler: requireAuth
    },
    async (request) => {
      const devices =
        await listUserDevices(
          request.auth.user.id
        );

      return {
        devices
      };
    }
  );

  app.post(
    "/devices",
    {
      preHandler: requireAuth
    },
    async (request, reply) => {
      const input =
        RegisterDeviceSchema.parse(
          request.body
        );

      const device =
        await createDevice(
          request.auth.user.id,
          input
        );

      return reply.status(201).send({
        device
      });
    }
  );

  app.delete(
    "/devices/:deviceId",
    {
      preHandler: requireAuth
    },
    async (request, reply) => {
      const params =
        DeviceIdSchema.parse(
          request.params
        );

      const deleted =
        await deleteDevice(
          request.auth.user.id,
          params.deviceId
        );

      if (!deleted) {
        return reply.status(404).send({
          code: "DEVICE_NOT_FOUND",
          message: "Device not found",
          requestId: request.id
        });
      }

      return reply.status(204).send();
    }
  );
}
