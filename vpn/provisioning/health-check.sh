#!/usr/bin/env bash

set -euo pipefail

WG_INTERFACE="${WG_INTERFACE:-wg0}"
VPN_GATEWAY="${VPN_GATEWAY:-10.0.0.1}"

echo "[NexaVPN] Running node health check..."

if [[ "${EUID}" -ne 0 ]]; then
  echo "[ERROR] Run this script as root."
  exit 1
fi

FAILED=0

if ! command -v wg >/dev/null 2>&1; then
  echo "[FAIL] WireGuard tools unavailable."
  FAILED=1
else
  echo "[OK] WireGuard tools available."
fi

if ! ip link show "${WG_INTERFACE}" >/dev/null 2>&1; then
  echo "[FAIL] ${WG_INTERFACE} interface unavailable."
  FAILED=1
else
  echo "[OK] ${WG_INTERFACE} interface available."
fi

if ! ip addr show dev "${WG_INTERFACE}" | grep -q "${VPN_GATEWAY}"; then
  echo "[FAIL] VPN gateway address missing."
  FAILED=1
else
  echo "[OK] VPN gateway address configured."
fi

if ! sysctl -n net.ipv4.ip_forward | grep -qx "1"; then
  echo "[FAIL] IPv4 forwarding disabled."
  FAILED=1
else
  echo "[OK] IPv4 forwarding enabled."
fi

if ! command -v nft >/dev/null 2>&1; then
  echo "[FAIL] nftables unavailable."
  FAILED=1
else
  echo "[OK] nftables available."
fi

if [[ "${FAILED}" -ne 0 ]]; then
  echo "[NexaVPN] Node health check FAILED."
  exit 1
fi

echo "[NexaVPN] Node health check PASSED."
