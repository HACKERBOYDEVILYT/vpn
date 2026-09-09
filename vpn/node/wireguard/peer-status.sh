#!/usr/bin/env bash

set -euo pipefail

WG_INTERFACE="${WG_INTERFACE:-wg0}"

echo "[NexaVPN] WireGuard peer status"
echo "================================"

if ! command -v wg >/dev/null 2>&1; then
  echo "[ERROR] WireGuard tools are not installed."
  exit 1
fi

if ! ip link show "${WG_INTERFACE}" >/dev/null 2>&1; then
  echo "[ERROR] Interface ${WG_INTERFACE} is unavailable."
  exit 1
fi

echo
echo "Interface:"
wg show "${WG_INTERFACE}" listen-port

echo
echo "Peers:"
wg show "${WG_INTERFACE}" peers

echo
echo "Latest handshakes:"
wg show "${WG_INTERFACE}" latest-handshakes

echo
echo "Transfer:"
wg show "${WG_INTERFACE}" transfer

echo
echo "[NexaVPN] Peer status complete."
