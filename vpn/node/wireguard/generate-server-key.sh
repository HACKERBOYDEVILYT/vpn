#!/usr/bin/env bash

set -euo pipefail

KEY_DIR="${KEY_DIR:-/etc/wireguard}"
PRIVATE_KEY="${KEY_DIR}/server_private.key"
PUBLIC_KEY="${KEY_DIR}/server_public.key"

echo "[NexaVPN] Generating WireGuard server keypair..."

if [[ "${EUID}" -ne 0 ]]; then
  echo "[ERROR] Run as root."
  exit 1
fi

if ! command -v wg >/dev/null 2>&1; then
  echo "[ERROR] WireGuard tools are not installed."
  exit 1
fi

mkdir -p "${KEY_DIR}"
chmod 700 "${KEY_DIR}"

if [[ -f "${PRIVATE_KEY}" ]]; then
  echo "[ERROR] Server private key already exists."
  echo "[INFO] Refusing to overwrite an existing production key."
  exit 1
fi

umask 077

wg genkey > "${PRIVATE_KEY}"
wg pubkey < "${PRIVATE_KEY}" > "${PUBLIC_KEY}"

chmod 600 "${PRIVATE_KEY}"
chmod 644 "${PUBLIC_KEY}"

echo "[OK] Server keypair generated."
echo "[INFO] Public key:"
cat "${PUBLIC_KEY}"

echo
echo "[SECURITY] Keep server_private.key secret."
