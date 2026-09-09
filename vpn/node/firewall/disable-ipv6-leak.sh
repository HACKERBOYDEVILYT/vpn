#!/usr/bin/env bash

set -euo pipefail

SYSCTL_FILE="/etc/sysctl.d/99-nexavpn-ipv6.conf"

echo "[NexaVPN] Configuring IPv6 leak protection..."

if [[ "${EUID}" -ne 0 ]]; then
  echo "[ERROR] Run this script as root."
  exit 1
fi

cat > "${SYSCTL_FILE}" <<'EOF'
# NexaVPN IPv6 leak protection.
#
# This disables IPv6 at the host level for nodes where
# IPv6 VPN routing is not intentionally configured.

net.ipv6.conf.all.disable_ipv6 = 1
net.ipv6.conf.default.disable_ipv6 = 1
EOF

sysctl --system

if [[ "$(sysctl -n net.ipv6.conf.all.disable_ipv6)" != "1" ]]; then
  echo "[ERROR] IPv6 leak protection was not enabled."
  exit 1
fi

echo "[OK] IPv6 disabled at host level."
echo "[OK] Native IPv6 traffic cannot bypass the IPv4 VPN tunnel."
