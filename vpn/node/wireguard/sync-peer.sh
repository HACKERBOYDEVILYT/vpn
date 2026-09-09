#!/usr/bin/env bash

set -euo pipefail

WG_INTERFACE="${WG_INTERFACE:-wg0}"
CLIENT_PUBLIC_KEY="${CLIENT_PUBLIC_KEY:-}"
CLIENT_ADDRESS="${CLIENT_ADDRESS:-}"
PERSISTENT_KEEPALIVE="${PERSISTENT_KEEPALIVE:-25}"

if [[ -z "${CLIENT_PUBLIC_KEY}" ]]; then
  echo "[ERROR] CLIENT_PUBLIC_KEY is required."
  exit 1
fi

if [[ -z "${CLIENT_ADDRESS}" ]]; then
  echo "[ERROR] CLIENT_ADDRESS is required."
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

echo "[NexaVPN] Synchronizing peer..."

wg set "${WG_INTERFACE}" \
  peer "${CLIENT_PUBLIC_KEY}" \
  allowed-ips "${CLIENT_ADDRESS}" \
  persistent-keepalive "${PERSISTENT_KEEPALIVE}"

echo "[OK] Peer synchronized."
echo
echo "Interface: ${WG_INTERFACE}"
echo "Address: ${CLIENT_ADDRESS}"
echo "Keepalive: ${PERSISTENT_KEEPALIVE}"
