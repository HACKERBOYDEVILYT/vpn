#!/usr/bin/env bash

set -euo pipefail

WG_INTERFACE="${WG_INTERFACE:-wg0}"

echo "[NexaVPN] Reloading WireGuard configuration..."

if [[ "${EUID}" -ne 0 ]]; then
  echo "[ERROR] Run as root."
  exit 1
fi

if ! command -v wg-quick >/dev/null 2>&1; then
  echo "[ERROR] wg-quick is unavailable."
  exit 1
fi

if [[ ! -f "/etc/wireguard/${WG_INTERFACE}.conf" ]]; then
  echo "[ERROR] Configuration not found."
  exit 1
fi

wg-quick down "${WG_INTERFACE}" 2>/dev/null || true

wg-quick up "${WG_INTERFACE}"

echo "[OK] ${WG_INTERFACE} reloaded."

wg show "${WG_INTERFACE}"
