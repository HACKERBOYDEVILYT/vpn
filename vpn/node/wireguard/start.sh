#!/usr/bin/env bash

set -euo pipefail

WG_INTERFACE="${WG_INTERFACE:-wg0}"

if [[ "${EUID}" -ne 0 ]]; then
  echo "[ERROR] Run as root."
  exit 1
fi

if ! command -v wg-quick >/dev/null 2>&1; then
  echo "[ERROR] wg-quick is unavailable."
  exit 1
fi

CONFIG="/etc/wireguard/${WG_INTERFACE}.conf"

if [[ ! -f "${CONFIG}" ]]; then
  echo "[ERROR] Configuration not found:"
  echo "${CONFIG}"
  exit 1
fi

chmod 600 "${CONFIG}"

if ip link show "${WG_INTERFACE}" >/dev/null 2>&1; then
  echo "[INFO] ${WG_INTERFACE} is already running."
else
  echo "[NexaVPN] Starting ${WG_INTERFACE}..."
  wg-quick up "${WG_INTERFACE}"
fi

systemctl enable "wg-quick@${WG_INTERFACE}"

echo "[OK] ${WG_INTERFACE} started."
wg show "${WG_INTERFACE}"
