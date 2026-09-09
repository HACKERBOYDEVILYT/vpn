#!/usr/bin/env bash

set -euo pipefail

VPN_SUBNET="${VPN_SUBNET:-10.0.0.0/24}"

echo "[NexaVPN] Validating VPN NAT..."

if [[ "${EUID}" -ne 0 ]]; then
  echo "[ERROR] Run as root."
  exit 1
fi

if ! command -v nft >/dev/null 2>&1; then
  echo "[ERROR] nftables is not installed."
  exit 1
fi

if ! sysctl -n net.ipv4.ip_forward | grep -qx "1"; then
  echo "[ERROR] IPv4 forwarding is disabled."
  exit 1
fi

NAT_FOUND="$(
  nft list ruleset 2>/dev/null |
    grep -E "ip saddr ${VPN_SUBNET//\//\\/}.*masquerade" ||
    true
)"

if [[ -z "${NAT_FOUND}" ]]; then
  echo "[WARN] No matching masquerade rule found."
  echo "[INFO] Verify the active nftables configuration manually."
  exit 1
fi

echo "[OK] VPN NAT rule detected."
echo "[OK] Subnet: ${VPN_SUBNET}"
