#!/usr/bin/env bash

set -euo pipefail

KEY_DIR="${KEY_DIR:-/etc/wireguard}"
OUTPUT="${OUTPUT:-/etc/wireguard/wg0.conf}"

SERVER_PRIVATE_KEY="${KEY_DIR}/server_private.key"

VPN_ADDRESS="${VPN_ADDRESS:-10.0.0.1/24}"
WIREGUARD_PORT="${WIREGUARD_PORT:-51820}"

if [[ "${EUID}" -ne 0 ]]; then
  echo "[ERROR] Run as root."
  exit 1
fi

if [[ ! -f "${SERVER_PRIVATE_KEY}" ]]; then
  echo "[ERROR] Server private key not found."
  echo "[INFO] Generate it first."
  exit 1
fi

if [[ -f "${OUTPUT}" ]]; then
  echo "[ERROR] ${OUTPUT} already exists."
  echo "[INFO] Refusing to overwrite an existing configuration."
  exit 1
fi

PRIVATE_KEY="$(cat "${SERVER_PRIVATE_KEY}")"

umask 077

cat > "${OUTPUT}" <<EOF
[Interface]
PrivateKey = ${PRIVATE_KEY}
Address = ${VPN_ADDRESS}
ListenPort = ${WIREGUARD_PORT}
SaveConfig = false
EOF

chmod 600 "${OUTPUT}"

echo "[OK] WireGuard server configuration created."
echo "[INFO] Configuration: ${OUTPUT}"
