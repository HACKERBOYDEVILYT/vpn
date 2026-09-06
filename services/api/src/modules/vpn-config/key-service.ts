import {
  generateClientKeyPair
} from "./crypto.js";

import {
  findDeviceKey,
  createDeviceKey
} from "./key-repository.js";

import {
  listUserDevices
} from "../devices/repository.js";

export async function getOrCreateDeviceKey(
  userId: string,
  deviceId: string
) {
  const device =
    (await listUserDevices(userId))
      .find(
        (item) =>
          item.id === deviceId
      );

  if (!device) {
    throw new Error(
      "DEVICE_NOT_FOUND"
    );
  }

  const existingKey =
    await findDeviceKey(
      deviceId
    );

  if (existingKey) {
    return existingKey;
  }

  const keyPair =
    generateClientKeyPair();

  /*
   * Temporary encrypted-storage
   * placeholder.
   *
   * The real production implementation
   * will use a dedicated encryption/key
   * management layer.
   */
  const privateKeyEncrypted =
    Buffer.from(
      keyPair.privateKey,
      "utf8"
    ).toString("base64");

  return createDeviceKey(
    deviceId,
    keyPair.publicKey,
    privateKeyEncrypted
  );
}
