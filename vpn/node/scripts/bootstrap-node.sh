#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VPN_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "=== NexaVPN Node Bootstrap ==="
echo "Root: $VPN_ROOT"
echo

if [[ "$EUID" -ne 0 ]]; then
    echo "ERROR: run this script as root"
    exit 1
fi

required_commands=(
    ip
    sysctl
    systemctl
)

for command in "${required_commands[@]}"; do
    if ! command -v "$command" >/dev/null 2>&1; then
        echo "ERROR: required command missing: $command"
        exit 1
    fi
done

mkdir -p \
    /etc/nexavpn \
    /etc/wireguard \
    /var/log/nexavpn

chmod 700 /etc/nexavpn
chmod 700 /etc/wireguard
chmod 700 /var/log/nexavpn

echo "Directories prepared."

if [[ -x "$VPN_ROOT/provisioning/create-node.sh" ]]; then
    "$VPN_ROOT/provisioning/create-node.sh"
fi

echo
echo "Bootstrap completed."
echo
echo "Next steps:"
echo "1. Install WireGuard"
echo "2. Configure the node identity"
echo "3. Configure DNS"
echo "4. Configure firewall/NAT"
echo "5. Generate the WireGuard server configuration"
echo "6. Run node health checks"
