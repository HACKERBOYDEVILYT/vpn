#!/usr/bin/env bash

set -euo pipefail

WG_INTERFACE="${WG_INTERFACE:-wg0}"
CLIENT_PUBLIC_KEY="${CLIENT_PUBLIC_KEY:-}"

if [[ -z "${CLIENT_PUBLIC_KEY}" ]]; then
  echo "[ERROR] CLIENT_PUBLIC_KEY is required."
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

if ! wg show "${WG_INTERFACE}" peers | grep -Fxq "${CLIENT_PUBLIC_KEY}"; then
  echo "[INFO] Peer does not exist."
  exit 0
fi

echo "[NexaVPN] Removing WireGuard peer..."

wg set "${WG_INTERFACE}" \
  peer "${CLIENT_PUBLIC_KEY}" \
  remove

echo "[OK] Peer removed."
