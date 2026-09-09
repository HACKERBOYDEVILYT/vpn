#!/usr/bin/env bash

set -euo pipefail

WG_INTERFACE="${WG_INTERFACE:-wg0}"
OUTPUT_DIR="${OUTPUT_DIR:-/etc/nexavpn/runtime}"
OUTPUT_FILE="${OUTPUT_DIR}/${WG_INTERFACE}.runtime"

if [[ "${EUID}" -ne 0 ]]; then
  echo "[ERROR] Run as root."
  exit 1
fi

if ! command -v wg >/dev/null 2>&1; then
  echo "[ERROR] WireGuard tools are not installed."
  exit 1
fi

if ! ip link show "${WG_INTERFACE}" >/dev/null 2>&1; then
  echo "[ERROR] Interface ${WG_INTERFACE} does not exist."
  exit 1
fi

mkdir -p "${OUTPUT_DIR}"
chmod 700 "${OUTPUT_DIR}"

umask 077

{
  echo "interface=${WG_INTERFACE}"
  echo "listen_port=$(wg show "${WG_INTERFACE}" listen-port)"
  echo "public_key=$(wg show "${WG_INTERFACE}" public-key)"
  echo "generated_at=$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
} > "${OUTPUT_FILE}"

chmod 600 "${OUTPUT_FILE}"

echo "[OK] Runtime metadata exported."
echo "[INFO] ${OUTPUT_FILE}"
