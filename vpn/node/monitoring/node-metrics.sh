#!/usr/bin/env bash
set -euo pipefail

WG_INTERFACE="${WG_INTERFACE:-wg0}"

echo "=== NexaVPN Node Metrics ==="
echo

echo "[System]"
uptime || true
echo

echo "[Memory]"
free -h || true
echo

echo "[Disk]"
df -h / || true
echo

echo "[CPU Load]"
awk '{print "load1=" $1, "load5=" $2, "load15=" $3}' /proc/loadavg || true
echo

echo "[WireGuard]"
if command -v wg >/dev/null 2>&1 && ip link show "$WG_INTERFACE" >/dev/null 2>&1; then
    wg show "$WG_INTERFACE" || true
else
    echo "WireGuard interface not available"
fi

echo
echo "[Forwarding]"
sysctl net.ipv4.ip_forward 2>/dev/null || true

echo
echo "[IPv6]"
sysctl net.ipv6.conf.all.disable_ipv6 2>/dev/null || true
