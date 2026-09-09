#!/usr/bin/env bash

set -euo pipefail

WG_INTERFACE="${WG_INTERFACE:-wg0}"

if ! command -v wg >/dev/null 2>&1; then
  echo "[ERROR] WireGuard tools are not installed."
  exit 1
fi

if ! ip link show "${WG_INTERFACE}" >/dev/null 2>&1; then
  echo "[ERROR] Interface ${WG_INTERFACE} does not exist."
  exit 1
fi

echo "[NexaVPN] Configured peers"
echo "========================"

PEERS="$(wg show "${WG_INTERFACE}" peers || true)"

if [[ -z "${PEERS}" ]]; then
  echo "No peers configured."
  exit 0
fi

COUNT=0

while IFS= read -r PEER; do
  [[ -z "${PEER}" ]] && continue

  COUNT=$((COUNT + 1))

  echo
  echo "Peer #${COUNT}"
  echo "PublicKey: ${PEER}"

  wg show "${WG_INTERFACE}" allowed-ips \
    | awk -v peer="${PEER}" '$1 == peer {print "AllowedIPs:", $2}'
done <<< "${PEERS}"

echo
echo "Total peers: ${COUNT}"
