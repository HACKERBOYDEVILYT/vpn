#!/usr/bin/env bash

set -euo pipefail

WG_INTERFACE="${WG_INTERFACE:-wg0}"
CLIENT_PUBLIC_KEY="${CLIENT_PUBLIC_KEY:-}"
CLIENT_ADDRESS="${CLIENT_ADDRESS:-}"

if [[ -z "${CLIENT_PUBLIC_KEY}" ]]; then
  echo "[ERROR] CLIENT_PUBLIC_KEY is required."
  exit 1
fi

if [[ -z "${CLIENT_ADDRESS}" ]]; then
  echo "[ERROR] CLIENT_ADDRESS is required."
  exit 1
fi

if ! command -v wg >/dev/null 2>&1; then
  echo "[ERROR] WireGuard tools unavailable."
  exit 1
fi

if ! ip link show "${WG_INTERFACE}" >/dev/null 2>&1; then
  echo "[ERROR] Interface ${WG_INTERFACE} unavailable."
  exit 1
fi

if ! wg show "${WG_INTERFACE}" peers | grep -Fxq "${CLIENT_PUBLIC_KEY}"; then
  echo "[ERROR] Peer is not configured."
  exit 1
fi

if ! wg show "${WG_INTERFACE}" allowed-ips \
    | awk -v peer="${CLIENT_PUBLIC_KEY}" -v address="${CLIENT_ADDRESS}" \
      '$1 == peer && $2 == address {found=1} END {exit !found}'; then
  echo "[ERROR] Peer AllowedIPs does not match."
  exit 1
fi

echo "[OK] Peer configuration validated."
echo "[INFO] Public key: ${CLIENT_PUBLIC_KEY}"
echo "[INFO] Address: ${CLIENT_ADDRESS}"
