#!/usr/bin/env bash

set -euo pipefail

WG_INTERFACE="${WG_INTERFACE:-wg0}"
EXPECTED_PORT="${EXPECTED_PORT:-51820}"

if ! command -v wg >/dev/null 2>&1; then
  echo "[ERROR] WireGuard tools unavailable."
  exit 1
fi

if ! ip link show "${WG_INTERFACE}" >/dev/null 2>&1; then
  echo "[ERROR] ${WG_INTERFACE} does not exist."
  exit 1
fi

ACTUAL_PORT="$(wg show "${WG_INTERFACE}" listen-port)"

if [[ "${ACTUAL_PORT}" != "${EXPECTED_PORT}" ]]; then
  echo "[ERROR] Unexpected WireGuard listen port."
  echo "Expected: ${EXPECTED_PORT}"
  echo "Actual:   ${ACTUAL_PORT}"
  exit 1
fi

echo "[OK] WireGuard listen port: ${ACTUAL_PORT}"
