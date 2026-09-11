#!/usr/bin/env bash
set -euo pipefail

WG_INTERFACE="${WG_INTERFACE:-wg0}"
MAX_HANDSHAKE_AGE="${MAX_HANDSHAKE_AGE:-86400}"
DRY_RUN="${DRY_RUN:-true}"

if ! command -v wg >/dev/null 2>&1; then
    echo "ERROR: wg command not found"
    exit 1
fi

if ! ip link show "$WG_INTERFACE" >/dev/null 2>&1; then
    echo "ERROR: interface $WG_INTERFACE not found"
    exit 1
fi

now="$(date +%s)"

while read -r public_key handshake; do
    [[ -z "$public_key" ]] && continue

    if [[ "$handshake" == "0" ]]; then
        continue
    fi

    age=$((now - handshake))

    if (( age > MAX_HANDSHAKE_AGE )); then
        if [[ "$DRY_RUN" == "true" ]]; then
            echo "STALE: $public_key age=${age}s (dry-run)"
        else
            echo "Removing stale peer: $public_key"
            wg set "$WG_INTERFACE" peer "$public_key" remove
        fi
    fi
done < <(
    wg show "$WG_INTERFACE" dump |
    awk 'NR > 1 {print $1, $5}'
)

echo "Stale-peer cleanup completed."
