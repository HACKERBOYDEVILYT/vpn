#!/usr/bin/env bash

set -euo pipefail

WG_INTERFACE="${WG_INTERFACE:-wg0}"

echo "[NexaVPN] Running network leak checks..."

if [[ "${EUID}" -ne 0 ]]; then
  echo "[ERROR] Run as root."
  exit 1
fi

FAILED=0

echo
echo "=== IPv4 Forwarding ==="

if [[ "$(sysctl -n net.ipv4.ip_forward)" == "1" ]]; then
  echo "[OK] IPv4 forwarding enabled."
else
  echo "[FAIL] IPv4 forwarding disabled."
  FAILED=1
fi

echo
echo "=== IPv6 ==="

IPV6_DISABLED="$(sysctl -n net.ipv6.conf.all.disable_ipv6 2>/dev/null || echo 0)"

if [[ "${IPV6_DISABLED}" == "1" ]]; then
  echo "[OK] IPv6 disabled."
else
  echo "[WARN] IPv6 is enabled."
  echo "[INFO] Make sure IPv6 VPN routing is intentionally configured."
fi

echo
echo "=== WireGuard ==="

if ip link show "${WG_INTERFACE}" >/dev/null 2>&1; then
  echo "[OK] ${WG_INTERFACE} exists."
else
  echo "[FAIL] ${WG_INTERFACE} does not exist."
  FAILED=1
fi

echo
echo "=== NAT ==="

if nft list ruleset 2>/dev/null | grep -q "masquerade"; then
  echo "[OK] NAT masquerade detected."
else
  echo "[FAIL] NAT masquerade not detected."
  FAILED=1
fi

echo

if [[ "${FAILED}" -ne 0 ]]; then
  echo "[NexaVPN] Leak test FAILED."
  exit 1
fi

echo "[NexaVPN] Basic leak test PASSED."
