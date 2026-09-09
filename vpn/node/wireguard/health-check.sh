#!/usr/bin/env bash

set -euo pipefail

WG_INTERFACE="${WG_INTERFACE:-wg0}"
MAX_HANDSHAKE_AGE="${MAX_HANDSHAKE_AGE:-180}"

echo "[NexaVPN] Checking WireGuard..."

if [[ "${EUID}" -ne 0 ]]; then
  echo "[ERROR] Run as root."
  exit 1
fi

if ! command -v wg >/dev/null 2>&1; then
  echo "[ERROR] wg command not found."
  exit 1
fi

if ! ip link show "${WG_INTERFACE}" >/dev/null 2>&1; then
  echo "[ERROR] ${WG_INTERFACE} is not available."
  exit 1
fi

echo "[INFO] Interface:"
wg show "${WG_INTERFACE}"

PEER_COUNT="$(
  wg show "${WG_INTERFACE}" peers | wc -l | tr -d ' '
)"

echo "[INFO] Peer count: ${PEER_COUNT}"

if [[ "${PEER_COUNT}" -eq 0 ]]; then
  echo "[WARN] No WireGuard peers are currently configured."
  exit 0
fi

NOW="$(date +%s)"
STALE=0

while IFS= read -r PEER; do
  [[ -z "${PEER}" ]] && continue

  HANDSHAKE="$(
    wg show "${WG_INTERFACE}" latest-handshakes \
      | awk -v peer="${PEER}" '$1 == peer {print $2}'
  )"

  if [[ -z "${HANDSHAKE}" || "${HANDSHAKE}" == "0" ]]; then
    echo "[WARN] Peer has no successful handshake: ${PEER}"
    continue
  fi

  AGE=$((NOW - HANDSHAKE))

  if [[ "${AGE}" -gt "${MAX_HANDSHAKE_AGE}" ]]; then
    echo "[WARN] Stale handshake (${AGE}s): ${PEER}"
    STALE=$((STALE + 1))
  else
    echo "[OK] Peer handshake age: ${AGE}s"
  fi
done < <(wg show "${WG_INTERFACE}" peers)

if [[ "${STALE}" -gt 0 ]]; then
  echo "[WARN] ${STALE} peer(s) have stale handshakes."
fi

echo "[NexaVPN] WireGuard health check complete."
