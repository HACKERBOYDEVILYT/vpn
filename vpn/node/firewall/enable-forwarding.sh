#!/usr/bin/env bash

set -euo pipefail

SYSCTL_FILE="/etc/sysctl.d/99-nexavpn-forwarding.conf"

echo "[NexaVPN] Enabling IP forwarding..."

if [[ "${EUID}" -ne 0 ]]; then
  echo "[ERROR] Run this script as root."
  exit 1
fi

cat > "${SYSCTL_FILE}" <<'EOF'
# NexaVPN IPv4 forwarding
net.ipv4.ip_forward = 1

# Do not accept IPv4 source-routed packets.
net.ipv4.conf.all.accept_source_route = 0
net.ipv4.conf.default.accept_source_route = 0

# Ignore ICMP redirects.
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0

# Do not send redirects.
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.send_redirects = 0
EOF

sysctl --system

if [[ "$(sysctl -n net.ipv4.ip_forward)" != "1" ]]; then
  echo "[ERROR] IPv4 forwarding is not enabled."
  exit 1
fi

echo "[OK] IPv4 forwarding is enabled."
