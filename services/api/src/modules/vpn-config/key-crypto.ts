import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes
} from "node:crypto";

const ALGORITHM =
  "aes-256-gcm";

const IV_LENGTH = 12;
const TAG_LENGTH = 16;

function getEncryptionKey(): Buffer {
  const secret =
    process.env.VPN_KEY_ENCRYPTION_SECRET;

  if (!secret) {
    throw new Error(
      "VPN_KEY_ENCRYPTION_SECRET_NOT_CONFIGURED"
    );
  }

  return createHash("sha256")
    .update(secret, "utf8")
    .digest();
}

export function encryptPrivateKey(
  privateKey: string
): string {
  const key =
    getEncryptionKey();

  const iv =
    randomBytes(IV_LENGTH);

  const cipher =
    createCipheriv(
      ALGORITHM,
      key,
      iv
    );

  const encrypted = Buffer.concat([
    cipher.update(
      privateKey,
      "utf8"
    ),
    cipher.final()
  ]);

  const authTag =
    cipher.getAuthTag();

  return Buffer.concat([
    iv,
    authTag,
    encrypted
  ]).toString("base64url");
}

export function decryptPrivateKey(
  payload: string
): string {
  const key =
    getEncryptionKey();

  const data =
    Buffer.from(
      payload,
      "base64url"
    );

  if (
    data.length <
    IV_LENGTH + TAG_LENGTH
  ) {
    throw new Error(
      "INVALID_ENCRYPTED_PRIVATE_KEY"
    );
  }

  const iv =
    data.subarray(
      0,
      IV_LENGTH
    );

  const authTag =
    data.subarray(
      IV_LENGTH,
      IV_LENGTH + TAG_LENGTH
    );

  const encrypted =
    data.subarray(
      IV_LENGTH + TAG_LENGTH
    );

  const decipher =
    createDecipheriv(
      ALGORITHM,
      key,
      iv
    );

  decipher.setAuthTag(
    authTag
  );

  const decrypted =
    Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]);

  return decrypted.toString(
    "utf8"
  );
}
