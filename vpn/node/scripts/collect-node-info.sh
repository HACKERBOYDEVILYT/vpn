#!/usr/bin/env bash
set -euo pipefail

OUTPUT_DIR="${OUTPUT_DIR:-/var/log/nexavpn}"
WG_INTERFACE="${WG_INTERFACE:-wg0}"

mkdir -p "$OUTPUT_DIR"
chmod 700 "$OUTPUT_DIR"

timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
output="$OUTPUT_DIR/node-info-$timestamp.txt"

{
    echo "NexaVPN Node Information"
    echo "Generated: $(date -u)"
    echo

    echo "=== Host ==="
    hostnamectl 2>/dev/null || hostname
    uname -a

    echo
    echo "=== Network ==="
    ip addr show

    echo
    echo "=== Routes ==="
    ip route show

    echo
    echo "=== WireGuard ==="
    if command -v wg >/dev/null 2>&1; then
        wg show "$WG_INTERFACE" 2>/dev/null || true
    fi

    echo
    echo "=== Forwarding ==="
    sysctl net.ipv4.ip_forward 2>/dev/null || true

    echo
    echo "=== IPv6 ==="
    sysctl net.ipv6.conf.all.disable_ipv6 2>/dev/null || true

    echo
    echo "=== Firewall ==="
    nft list ruleset 2>/dev/null || true

} > "$output"

chmod 600 "$output"

echo "Node information collected:"
echo "$output"
