#!/usr/bin/env bash

set -euo pipefail

OUTPUT_DIR="${OUTPUT_DIR:-/etc/nexavpn/peers}"

CLIENT_PRIVATE_KEY="${CLIENT_PRIVATE_KEY:-}"
CLIENT_PUBLIC_KEY="${CLIENT_PUBLIC_KEY:-}"
CLIENT_ADDRESS="${CLIENT_ADDRESS:-}"

SERVER_PUBLIC_KEY="${SERVER_PUBLIC_KEY:-}"
SERVER_ENDPOINT="${SERVER_ENDPOINT:-}"
SERVER_PORT="${SERVER_PORT:-51820}"

DNS_SERVER="${DNS_SERVER:-10.0.0.1}"
PERSISTENT_KEEPALIVE="${PERSISTENT_KEEPALIVE:-25}"

if [[ -z "${CLIENT_PRIVATE_KEY}" ]]; then
  echo "[ERROR] CLIENT_PRIVATE_KEY is required."
  exit 1
fi

if [[ -z "${CLIENT_PUBLIC_KEY}" ]]; then
  echo "[ERROR] CLIENT_PUBLIC_KEY is required."
  exit 1
fi

if [[ -z "${CLIENT_ADDRESS}" ]]; then
  echo "[ERROR] CLIENT_ADDRESS is required."
  exit 1
fi

if [[ -z "${SERVER_PUBLIC_KEY}" ]]; then
  echo "[ERROR] SERVER_PUBLIC_KEY is required."
  exit 1
fi

if [[ -z "${SERVER_ENDPOINT}" ]]; then
  echo "[ERROR] SERVER_ENDPOINT is required."
  exit 1
fi

mkdir -p "${OUTPUT_DIR}"
chmod 700 "${OUTPUT_DIR}"

CLIENT_FILE="${OUTPUT_DIR}/${CLIENT_PUBLIC_KEY}.conf"

if [[ -f "${CLIENT_FILE}" ]]; then
  echo "[ERROR] Peer configuration already exists."
  exit 1
fi

umask 077

cat > "${CLIENT_FILE}" <<EOF
[Interface]
PrivateKey = ${CLIENT_PRIVATE_KEY}
Address = ${CLIENT_ADDRESS}
DNS = ${DNS_SERVER}

[Peer]
PublicKey = ${SERVER_PUBLIC_KEY}
Endpoint = ${SERVER_ENDPOINT}:${SERVER_PORT}
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = ${PERSISTENT_KEEPALIVE}
EOF

chmod 600 "${CLIENT_FILE}"

echo "[OK] Client WireGuard configuration generated."
echo "[INFO] ${CLIENT_FILE}"
