#!/usr/bin/env bash

set -euo pipefail

DNS_CONFIG_DIR="/etc/dnsmasq.d"
NEXA_CONFIG="${DNS_CONFIG_DIR}/nexavpn.conf"

echo "[NexaVPN] Installing DNS resolver configuration..."

if [[ "${EUID}" -ne 0 ]]; then
  echo "[ERROR] Run this script as root."
  exit 1
fi

if ! command -v dnsmasq >/dev/null 2>&1; then
  echo "[INFO] dnsmasq is not installed."

  if command -v apt-get >/dev/null 2>&1; then
    apt-get update
    apt-get install -y dnsmasq
  else
    echo "[ERROR] Unsupported package manager."
    exit 1
  fi
fi

mkdir -p "${DNS_CONFIG_DIR}"

cat > "${NEXA_CONFIG}" <<'EOF'
port=53
listen-address=10.0.0.1
bind-interfaces
interface=wg0
no-resolv

server=1.1.1.1
server=1.0.0.1

cache-size=10000

no-ident
no-hosts

domain-needed
bogus-priv
stop-dns-rebind

local=/10.in-addr.arpa/
local=/16.172.in-addr.arpa/
local=/168.192.in-addr.arpa/
EOF

echo "[NexaVPN] Validating dnsmasq configuration..."

dnsmasq --test

echo "[NexaVPN] Restarting dnsmasq..."

systemctl enable dnsmasq
systemctl restart dnsmasq

echo "[NexaVPN] DNS resolver installed successfully."
echo "[NexaVPN] Listening on 10.0.0.1:53 via wg0."
