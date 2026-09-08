import {
  generateClientKeyPair
} from "./crypto.js";

import {
  findDeviceKey,
  createDeviceKey
} from "./key-repository.js";

import {
  encryptPrivateKey
} from "./key-crypto.js";

export async function getOrCreateDeviceKey(
  userId: string,
  deviceId: string
) {
  const existing =
    await findDeviceKey(
      userId,
      deviceId
    );

  if (existing) {
    return existing;
  }

  const keyPair =
    generateClientKeyPair();

  const encryptedPrivateKey =
    encryptPrivateKey(
      keyPair.privateKey
    );

  return createDeviceKey({
    userId,
    deviceId,
    publicKey:
      keyPair.publicKey,
    privateKeyEncrypted:
      encryptedPrivateKey
  });
}
