#!/usr/bin/env bash
set -euo pipefail

if ! command -v nft >/dev/null 2>&1; then
    echo "ERROR: nft command not found"
    exit 1
fi

ruleset="$(nft list ruleset 2>/dev/null || true)"

if [[ -z "$ruleset" ]]; then
    echo "ERROR: nftables ruleset is empty"
    exit 2
fi

echo "=== NexaVPN Firewall Health ==="

if grep -q 'masquerade' <<< "$ruleset"; then
    echo "OK: NAT masquerade rule found"
else
    echo "WARN: NAT masquerade rule not found"
fi

if sysctl net.ipv4.ip_forward 2>/dev/null | grep -q '= 1'; then
    echo "OK: IPv4 forwarding enabled"
else
    echo "ERROR: IPv4 forwarding disabled"
fi

if ip link show wg0 >/dev/null 2>&1; then
    echo "OK: wg0 interface exists"
else
    echo "WARN: wg0 interface not found"
fi

echo "Firewall health check completed."
