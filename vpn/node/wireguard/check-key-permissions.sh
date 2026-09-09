#!/usr/bin/env bash

set -euo pipefail

KEY_DIR="${KEY_DIR:-/etc/wireguard}"
PRIVATE_KEY="${KEY_DIR}/server_private.key"

if [[ ! -f "${PRIVATE_KEY}" ]]; then
  echo "[ERROR] Private key not found."
  exit 1
fi

PERMISSIONS="$(stat -c '%a' "${PRIVATE_KEY}")"
OWNER="$(stat -c '%U' "${PRIVATE_KEY}")"

echo "[NexaVPN] Checking private key permissions..."

if [[ "${PERMISSIONS}" != "600" ]]; then
  echo "[ERROR] Private key permissions are ${PERMISSIONS}."
  echo "[ERROR] Expected 600."
  exit 1
fi

if [[ "${OWNER}" != "root" ]]; then
  echo "[ERROR] Private key owner is ${OWNER}."
  echo "[ERROR] Expected root."
  exit 1
fi

echo "[OK] Private key permissions are secure."
echo "[OK] Owner: root"
echo "[OK] Mode: 600"
