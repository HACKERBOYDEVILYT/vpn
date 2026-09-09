#!/usr/bin/env bash

set -euo pipefail

NODE_NAME="${NODE_NAME:-nexavpn-node}"
WG_INTERFACE="${WG_INTERFACE:-wg0}"
WG_CONFIG_DIR="/etc/wireguard"
NODE_DIR="/etc/nexavpn"

echo "[NexaVPN] Creating VPN node: ${NODE_NAME}"

if [[ "${EUID}" -ne 0 ]]; then
  echo "[ERROR] Run this script as root."
  exit 1
fi

mkdir -p "${WG_CONFIG_DIR}"
mkdir -p "${NODE_DIR}"
mkdir -p /var/log/nexavpn

chmod 700 "${WG_CONFIG_DIR}"
chmod 700 "${NODE_DIR}"

if ! command -v wg >/dev/null 2>&1; then
  echo "[ERROR] WireGuard is not installed."
  echo "[INFO] Run vpn/node/wireguard/install-wireguard.sh first."
  exit 1
fi

if ! ip link show "${WG_INTERFACE}" >/dev/null 2>&1; then
  echo "[INFO] ${WG_INTERFACE} is not active yet."
else
  echo "[INFO] ${WG_INTERFACE} already exists."
fi

cat > "${NODE_DIR}/node.env" <<EOF
NEXAVPN_NODE_NAME=${NODE_NAME}
NEXAVPN_WG_INTERFACE=${WG_INTERFACE}
NEXAVPN_NODE_CREATED_AT=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
EOF

chmod 600 "${NODE_DIR}/node.env"

echo "[OK] Node directory initialized."
echo "[OK] Node: ${NODE_NAME}"
echo "[OK] Interface: ${WG_INTERFACE}"
