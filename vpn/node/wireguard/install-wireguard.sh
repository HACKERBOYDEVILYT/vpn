#!/usr/bin/env bash

set -euo pipefail

WG_INTERFACE="${WG_INTERFACE:-wg0}"
WG_CONFIG="${WG_CONFIG:-/etc/wireguard/${WG_INTERFACE}.conf}"

echo "[NexaVPN] Installing WireGuard node..."

if [[ "${EUID}" -ne 0 ]]; then
  echo "[ERROR] Run this script as root."
  exit 1
fi

if ! command -v wg >/dev/null 2>&1; then
  echo "[INFO] Installing WireGuard..."

  if command -v apt-get >/dev/null 2>&1; then
    apt-get update
    apt-get install -y wireguard wireguard-tools
  else
    echo "[ERROR] Unsupported package manager."
    exit 1
  fi
fi

mkdir -p /etc/wireguard

if [[ ! -f "${WG_CONFIG}" ]]; then
  echo "[ERROR] WireGuard configuration does not exist:"
  echo "        ${WG_CONFIG}"
  echo
  echo "Create a production configuration before starting ${WG_INTERFACE}."
  exit 1
fi

chmod 600 "${WG_CONFIG}"

echo "[NexaVPN] Bringing up ${WG_INTERFACE}..."

wg-quick up "${WG_INTERFACE}" || {
  echo "[ERROR] Failed to start ${WG_INTERFACE}."
  exit 1
}

echo "[OK] ${WG_INTERFACE} is running."

echo "[NexaVPN] Current WireGuard status:"
wg show "${WG_INTERFACE}"
