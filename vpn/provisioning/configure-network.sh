#!/usr/bin/env bash

set -euo pipefail

WG_INTERFACE="${WG_INTERFACE:-wg0}"
VPN_ADDRESS="${VPN_ADDRESS:-10.0.0.1/24}"
MTU="${MTU:-1420}"

echo "[NexaVPN] Configuring VPN network..."

if [[ "${EUID}" -ne 0 ]]; then
  echo "[ERROR] Run this script as root."
  exit 1
fi

if ! ip link show "${WG_INTERFACE}" >/dev/null 2>&1; then
  echo "[ERROR] WireGuard interface ${WG_INTERFACE} does not exist."
  exit 1
fi

ip addr replace "${VPN_ADDRESS}" dev "${WG_INTERFACE}"

ip link set dev "${WG_INTERFACE}" mtu "${MTU}"

ip link set dev "${WG_INTERFACE}" up

if ! ip addr show dev "${WG_INTERFACE}" | grep -q "${VPN_ADDRESS%/*}"; then
  echo "[ERROR] Failed to configure VPN address."
  exit 1
fi

echo "[OK] Interface: ${WG_INTERFACE}"
echo "[OK] Address: ${VPN_ADDRESS}"
echo "[OK] MTU: ${MTU}"
