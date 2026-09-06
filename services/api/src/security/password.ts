import { randomBytes, scrypt as scryptCallback } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);

const KEY_LENGTH = 64;
const SALT_LENGTH = 32;

export async function hashPassword(
  password: string
): Promise<string> {
  const salt = randomBytes(SALT_LENGTH);

  const derivedKey = (await scrypt(
    password,
    salt,
    KEY_LENGTH
  )) as Buffer;

  return [
    "scrypt",
    salt.toString("base64"),
    derivedKey.toString("base64")
  ].join("$");
}

export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  const [algorithm, saltBase64, hashBase64] =
    storedHash.split("$");

  if (
    algorithm !== "scrypt" ||
    !saltBase64 ||
    !hashBase64
  ) {
    return false;
  }

  try {
    const salt = Buffer.from(saltBase64, "base64");
    const expectedHash = Buffer.from(
      hashBase64,
      "base64"
    );

    const derivedKey = (await scrypt(
      password,
      salt,
      expectedHash.length
    )) as Buffer;

    return derivedKey.equals(expectedHash);
  } catch {
    return false;
  }
}
