#!/usr/bin/env bash
set -euo pipefail

DNS_HOST="${DNS_HOST:-10.0.0.1}"
DNS_PORT="${DNS_PORT:-53}"

echo "=== NexaVPN DNS Health ==="

if ! command -v ss >/dev/null 2>&1; then
    echo "ERROR: ss command not found"
    exit 1
fi

if ! ss -lunpt | grep -E "[:.]${DNS_PORT}[[:space:]]" >/dev/null 2>&1; then
    echo "ERROR: DNS port ${DNS_PORT} is not listening"
    exit 1
fi

if command -v dig >/dev/null 2>&1; then
    if dig @"$DNS_HOST" example.com +time=2 +tries=1 +short >/dev/null 2>&1; then
        echo "OK: DNS resolver responds"
    else
        echo "ERROR: DNS resolver query failed"
        exit 2
    fi
else
    echo "WARN: dig is not installed; listener check passed"
fi

echo "DNS health check completed."
