import {
  generateKeyPairSync,
  randomBytes
} from "node:crypto";

export interface VPNKeyPair {
  privateKey: string;
  publicKey: string;
}

export function generateClientKeyPair(): VPNKeyPair {
  const { privateKey, publicKey } =
    generateKeyPairSync("x25519", {
      privateKeyEncoding: {
        type: "pkcs8",
        format: "der"
      },
      publicKeyEncoding: {
        type: "spki",
        format: "der"
      }
    });

  return {
    privateKey:
      Buffer.from(
        privateKey
      ).toString("base64url"),

    publicKey:
      Buffer.from(
        publicKey
      ).toString("base64url")
  };
}

export function generateClientId(): string {
  return randomBytes(16)
    .toString("hex");
}
