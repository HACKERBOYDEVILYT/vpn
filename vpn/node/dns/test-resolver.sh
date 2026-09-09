#!/usr/bin/env bash

set -euo pipefail

DNS_SERVER="${DNS_SERVER:-10.0.0.1}"
TEST_DOMAIN="${TEST_DOMAIN:-example.com}"

echo "[NexaVPN] Testing VPN DNS resolver..."

if ! command -v dig >/dev/null 2>&1; then
  echo "[ERROR] dig is required."
  exit 1
fi

RESULT="$(
  dig \
    @"${DNS_SERVER}" \
    "${TEST_DOMAIN}" \
    +short \
    +time=3 \
    +tries=2
)"

if [[ -z "${RESULT}" ]]; then
  echo "[ERROR] DNS query returned no result."
  exit 1
fi

echo "[OK] DNS resolver responded."
echo
echo "Resolver: ${DNS_SERVER}"
echo "Domain:   ${TEST_DOMAIN}"
echo
echo "${RESULT}"
