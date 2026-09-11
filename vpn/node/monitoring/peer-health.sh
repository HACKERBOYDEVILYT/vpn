#!/usr/bin/env bash
set -euo pipefail

WG_INTERFACE="${WG_INTERFACE:-wg0}"
MAX_HANDSHAKE_AGE="${MAX_HANDSHAKE_AGE:-180}"

if ! command -v wg >/dev/null 2>&1; then
    echo "ERROR: wg command not found"
    exit 1
fi

if ! ip link show "$WG_INTERFACE" >/dev/null 2>&1; then
    echo "ERROR: interface $WG_INTERFACE not found"
    exit 1
fi

now="$(date +%s)"
has_peer=0
unhealthy=0

while read -r public_key _ endpoint _ _ handshake _ _ _ _; do
    [[ "$public_key" == "public" ]] && continue
    [[ -z "$public_key" ]] && continue

    has_peer=1

    age=$((now - handshake))

    if [[ "$handshake" == "0" ]]; then
        echo "WARN peer=$public_key no-handshake"
        unhealthy=1
    elif (( age > MAX_HANDSHAKE_AGE )); then
        echo "WARN peer=$public_key handshake_age=${age}s"
        unhealthy=1
    else
        echo "OK peer=$public_key handshake_age=${age}s"
    fi
done < <(
    wg show "$WG_INTERFACE" dump |
    awk 'NR > 1 {print $1, $3, $5, $6}'
)

if (( has_peer == 0 )); then
    echo "INFO: no peers configured"
    exit 0
fi

if (( unhealthy != 0 )); then
    exit 2
fi

echo "All active peers are healthy."
